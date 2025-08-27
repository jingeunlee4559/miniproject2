#!/usr/bin/env python3
import sys
import json
import argparse
from pathlib import Path
from typing import List, Dict, Any, Optional
from langchain_core.messages import AIMessage
from datetime import datetime

from langchain.output_parsers import JsonOutputParser
from langchain.schema import OutputParserException
import logging

USED_FOR_RETRIEVER = ("destination", "season", "companion", "TravelConcept")

def to_retriever_query(payload: dict) -> dict:
    return {k: payload.get(k, "") for k in USED_FOR_RETRIEVER}

# make_insert_db 폴더를 Python path에 추가
current_dir = Path(__file__).parent
make_insert_db_path = current_dir / "make_insert_db"
sys.path.insert(0, str(make_insert_db_path))

from make_db import load_vectorstore
from langchain_work.project.service.Retriever import JejuTravelRetriever
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_google_genai import ChatGoogleGenerativeAI
from dotenv import load_dotenv
from langchain_core.prompts import ChatPromptTemplate

load_dotenv()

class JejuTravelPlanner:
    def __init__(self, env: str = "test"):
        self.env = env
        self.vectorstore = None
        self.retriever = None
        self.llm = None
        self.chain = None
        self._setup_retriever()
        self._setup_llm()
        self._setup_chain()
    
    def _setup_retriever(self):
        try:
            self.vectorstore = load_vectorstore("config.txt")
            self.retriever = JejuTravelRetriever(self.vectorstore)
        except Exception as e:
            raise RuntimeError(f"Failed to load existing vectorstore: {e}")
    
    def _setup_llm(self):
        """LLM 설정"""
        try:
            self.llm = ChatGoogleGenerativeAI(
                model="gemini-2.5-flash",
                temperature=0,
            )
            print("LLM 초기화 완료 (Gemini 2.5 Flash)")
        except Exception as e:
            print(f"LLM 초기화 실패: {e}")
            raise e
    
    def _setup_chain(self):
        # ------------------------------
        # 1) System Prompt
        # ------------------------------
        TRAVEL_SYSTEM_PROMPT = """
        당신은 한국 여행 블로그 전문가이자 개인화된 여행 플래너입니다.
        입력으로 제공되는 네이버 블로그 상위 5개 후기(벡터 검색 결과)를
        핵심 근거로 적극 활용하고, 필요한 경우 Google Search/Maps 도구를
        사용해 최신성·정확성을 보강하세요.

        [목표]
        - 사용자의 목적지/계절/동반자/컨셉에 맞춘 추천을 제공
        - isRoute=true면 '코스(동선)' 중심, false면 '장소 목록' 중심
        - (isRoute=true일 때만) onlyLoc 제약에 따라 맛집/카페 포함 여부를 준수
        - 모든 응답은 "유효한 JSON"만 출력 (불필요한 문장/마크다운 금지)

        [도구 사용 원칙]
        - Google Search: 운영시간/요금/이벤트/휴무 등 최신 정보 검증
        - Google Maps: 거리/소요시간/경로 산출(특히 isRoute=true일 때 필수)
        - 도구 호출이 실패하면 추정값 대신 "unknown" 필드로 명시

        [응답 작성 원칙]
        1) 우선 RAG(상위 5개 후기)에서 장소/경험/팁을 추출해 추천의 근거로 삼되,
        불확실하거나 오래된 정보는 Search/Maps로 검증 후 반영.
        2) 한국 이용자 맥락을 고려:
        - 대중교통·이동시간·혼잡도·포토스팟·비용/예약 여부 등 실용 정보 포함
        3) 정보 충돌 시: 최신 도구 결과 > 후기 > 일반 상식 순으로 신뢰
        4) 모든 수치 단위는 'km, 분, 원'처럼 명확히 표기
        5) 반드시 JSON만 출력. 코드블록/설명 문장/선행 텍스트 금지.
        """

        # ------------------------------
        # 2) Context + User Inputs
        # ------------------------------
        CONTEXT_AND_INPUTS = """
        [사용자 질의]
        - destination: {destination}
        - season: {season}
        - companion: {companion}
        - TravelConcept: {travel_concept}
        - isRoute: {is_route}
        - onlyLoc: {only_loc}  # (isRoute=true일 때만 의미 있음)

        [RAG 상위 5개 후기]
        {retrieved_chunks}

        [해석 지침]
        - 후기에서 '장소명/경험 포인트/주의사항/포토스팟/계절 팁'을 최대한 추출
        - 중복·유사 추천은 차별화 포인트를 명시
        - 불확실/구버전 정보는 도구로 검증 또는 "unknown" 처리
        """

        # ------------------------------
        # 3) Mode-specific Instructions
        # ------------------------------
        ROUTE_MODE_INSTRUCTIONS = """
        [경로 추천 모드 (isRoute=true)]
        - Google Maps로 장소 간 이동 거리(km)/시간(분)을 산출하고,
        이동수단 옵션(대중교통/도보/차량)을 제시
        - 하루 총 이동 시간이 과도하지 않도록 순서를 최적화
        - onlyLoc=true  → 맛집/카페 제외(관광/액티비티/문화시설 중심)
        - onlyLoc=false → 맛집/카페 포함(식사/카페 휴식 동선 고려)
        - 불가피하게 거리가 멀면 대안(동일 컨셉의 인근 장소) 1~2개 제안
        """

        LOCATION_MODE_INSTRUCTIONS = """
        [장소 추천 모드 (isRoute=false)]
        - 코스 없이 장소 목록만 제시(카테고리: 관광/액티비티/맛집/카페/쇼핑 등)
        - 각 장소별: 한줄 핵심 설명 + 왜 추천하는지(후기 근거) + 계절/동반자 적합성
        - 운영/가격/예약 필요 여부는 최신 검증(가능 시), 불확실하면 "unknown"
        """

        # ------------------------------
        # 4) Output Schema (JSON only)
        # ------------------------------
        OUTPUT_SCHEMA = r"""
        다음 JSON 스키마에 '정확히' 맞춰 출력하세요. (추가/누락/형태변경 금지)

        isRoute=false (장소 추천):
        {
        "recommendation_type": "location",
        "summary": {
            "destination": "string",
            "season_tip": "string",
            "companion_tip": "string",
            "concept_tip": "string"
        },
        "categorized_places": [
            {
            "category": "관광지|액티비티|맛집|카페|쇼핑|기타",
            "items": [
                {
                "name": "string",
                "one_liner": "string",
                "address": "string | unknown",
                "why_recommended": "string",       // RAG 근거 핵심
                "best_time": "string | unknown",   // 계절/시간대
                "booking": "필요|선택|없음|unknown",
                "estimated_cost": "string | unknown",
                "external_verified": true|false    // 도구로 검증했는지
                }
            ]
            }
        ],
        "practical_info": {
            "transportation": "string | unknown",
            "budget_estimate": "string | unknown",
            "local_tips": ["string", "..."]
        },
        "source_attribution": {
            "blogs": [{"title":"string","url":"string"}],
            "external": [{"type":"search|maps","what":"string"}]
        },
        "confidence": 0.0
        }

        isRoute=true (코스 추천):
        {
        "recommendation_type": "route",
        "constraints": {
            "onlyLoc": true|false
        },
        "daily_itinerary": [
            {
            "day": 1,
            "day_summary": "string",
            "stops": [
                {
                "name": "string",
                "address": "string | unknown",
                "activity": "string",               // 무엇을 하는가
                "travel_mode_from_prev": "도보|대중교통|차량|N/A",
                "distance_from_prev_km": "number | null",
                "duration_from_prev_min": "number | null",
                "why_order_here": "string",         // 동선/혼잡/계절 고려
                "meal_or_cafe": true|false          // onlyLoc=true면 항상 false
                }
            ],
            "total_move_min": "number | null"
            }
        ],
        "practical_info": {
            "transportation": "string | unknown",
            "budget_estimate": "string | unknown",
            "booking_list": ["string", "..."]       // 예약 필요 장소 목록
        },
        "source_attribution": {
            "blogs": [{"title":"string","url":"string"}],
            "external": [{"type":"maps","what":"legs(distance/duration)"}]
        },
        "confidence": 0.0
        }
        """
        # 2) 보관 (다른 메서드에서 재사용)
        self._route_instructions = ROUTE_MODE_INSTRUCTIONS
        self._location_instructions = LOCATION_MODE_INSTRUCTIONS

        from langchain_core.prompts import ChatPromptTemplate

        self.prompt = ChatPromptTemplate.from_messages([
            ("system", TRAVEL_SYSTEM_PROMPT),
            ("human", CONTEXT_AND_INPUTS),
            ("human", "{mode_instructions}"),
            ("human", OUTPUT_SCHEMA),
            ("human", "위 지침과 스키마를 따르되, 오직 유효한 JSON만 출력하세요.")
        ])

        self.chain = self.prompt | self.llm

    # 클래스 내부에 추가
    def _build_prompt_inputs(self, user_query: dict, retrieved_docs: list) -> dict:
        """
        retrieved_docs: dict 리스트(표준화된 문서). 각 원소에
        - "page_content": str
        - "metadata": {"title","source"|"source_url","date","similarity_score"...}
        """
        # 상위 5개만 보기 좋게 요약
        chunks = []
        for i, d in enumerate(retrieved_docs[:5], start=1):
            md = d.get("metadata", {})
            title = md.get("title", f"블로그 후기 {i}")
            url   = md.get("source_url") or md.get("source") or "unknown"
            date  = md.get("date", "unknown")
            score = md.get("similarity_score", "N/A")
            excerpt = (d.get("page_content") or "").strip()
            chunks.append(
                f"- [{i}] {title} ({date}, score:{score})\n  URL: {url}\n  내용요약: {excerpt[:600]}..."
            )
        retrieved_chunks = "\n".join(chunks) if chunks else "결과 없음"

        # 분기 지시
        is_route = bool(user_query.get("isRoute", False))
        only_loc = user_query.get("onlyLoc", "")
        mode_instructions = self._route_instructions if is_route else self._location_instructions

        return {
            "destination":     user_query.get("destination", ""),
            "season":          user_query.get("season", ""),
            "companion":       user_query.get("companion", ""),
            "travel_concept":  user_query.get("TravelConcept", ""),
            "is_route":        str(is_route).lower(),   # "true"/"false"
            "only_loc":        str(only_loc),           # "" | "true" | "false"
            "retrieved_chunks": retrieved_chunks,
            "mode_instructions": mode_instructions
        }

    

    def _parse_json_safely(self, text: str):
        """LangChain JsonOutputParser를 사용하여 모델 응답에서 JSON을 안전하게 추출"""
        parser = JsonOutputParser()
        
        try:
            return parser.parse(text)
        except OutputParserException as e:
            logging.warning(f"JsonOutputParser failed: {str(e)}")
            logging.debug(f"Failed text content: {text[:200]}...")
            
            # Fallback: 직접 JSON 파싱 시도
            try:
                return json.loads(text)
            except json.JSONDecodeError as json_err:
                logging.warning(f"Direct JSON parsing also failed: {json_err}")
                logging.debug(f"JSON error at position {json_err.pos}: {json_err.msg}")
                
                # 마지막 시도: 중괄호 범위 추출
                try:
                    start = text.find("{")
                    end = text.rfind("}")
                    if start != -1 and end != -1 and end > start:
                        extracted = text[start:end+1]
                        result = json.loads(extracted)
                        logging.info(f"Successfully parsed JSON from extracted range [{start}:{end+1}]")
                        return result
                    else:
                        logging.error("No valid JSON braces found in text")
                except json.JSONDecodeError as final_err:
                    logging.error(f"Final fallback parsing failed: {final_err}")
                    logging.debug(f"Extracted text was: {extracted[:100]}...")
                except UnboundLocalError:
                    logging.error("Failed to extract text between braces")
            
            except Exception as unexpected_err:
                logging.error(f"Unexpected error during direct JSON parsing: {type(unexpected_err).__name__}: {unexpected_err}")
        
        except Exception as unexpected_langchain_err:
            logging.error(f"Unexpected LangChain parser error: {type(unexpected_langchain_err).__name__}: {unexpected_langchain_err}")
            logging.debug(f"Input text: {text[:200]}...")
        
        # 모든 파싱 시도 실패
        logging.error("All JSON parsing attempts failed")
        logging.debug(f"Full text content: {text}")
        return None

    def convert_to_standard_format(self, retriever_results: List[Any]) -> List[Dict[str, Any]]:
        """검색 결과를 표준 형식으로 변환 (Document/dict 모두 지원)"""
        standard_results: List[Dict[str, Any]] = []

        for doc in retriever_results:
            # LangChain Document
            if hasattr(doc, "page_content"):
                standard_results.append({
                    "page_content": getattr(doc, "page_content", "") or "",
                    "metadata": getattr(doc, "metadata", {}) or {},
                })
                continue

            # dict 형태
            if isinstance(doc, dict):
                page = doc.get("page_content") or doc.get("content") or doc.get("text") or ""
                md = doc.get("metadata") or {}
                if not isinstance(md, dict):
                    md = {"_raw_metadata": md}
                standard_results.append({"page_content": page, "metadata": md})
                continue

            # 그 외 타입(문자열 등)도 안전 처리
            standard_results.append({"page_content": str(doc), "metadata": {}})

        return standard_results
    
    def format_docs_for_prompt(self, docs: List[Dict[str, Any]]) -> str:
        """문서를 프롬프트용으로 포맷팅"""
        formatted_docs = []
        
        for i, doc in enumerate(docs, 1):
            doc_text = f"""
    문서 {i}:
    제목: {doc['metadata']['title']}
    출처: {doc['metadata']['source']}
    내용: {doc['page_content'][:500]}...
    ---
    """
            formatted_docs.append(doc_text.strip())
        
        return "\n\n".join(formatted_docs)
    
    def load_retriever_results(self, filename: str = "retriever_result.json") -> Dict[str, Any]:
        """저장된 검색 결과 파일을 로드"""
        try:
            with open(filename, 'r', encoding='utf-8') as f:
                data = json.load(f)
            
            print(f"검색 결과 파일 로드 완료: {filename}")
            return data
            
        except FileNotFoundError:
            print(f"검색 결과 파일을 찾을 수 없습니다: {filename}")
            raise FileNotFoundError(f"File not found: {filename}")
        except json.JSONDecodeError:
            print(f"JSON 파싱 오류: {filename}")
            raise ValueError(f"Invalid JSON format: {filename}")
    
    def plan_from_file(self, filename: str = "retriever_result.json",
                   is_route: bool = False,
                   override_query: Optional[Dict[str, Any]] = None,
                   only_loc: str = "") -> Dict[str, Any]:
        data = self.load_retriever_results(filename)
        standard_docs = data.get("documents", [])
        original_query = data.get("query", {})

        # 쿼리 병합
        query = {**original_query, **(override_query or {})}
        query["isRoute"] = is_route
        query["onlyLoc"] = only_loc

        # 프롬프트 변수 구성
        prompt_vars = self._build_prompt_inputs(query, standard_docs)

        # LLM 호출
        try:
            response = self.chain.invoke(prompt_vars)
            plan_json = self._parse_json_safely(response.content)
            if plan_json is None:
                return {"success": False, "raw_response": response.content,
                        "retrieved_docs": standard_docs, "search_query": query,
                        "source_file": filename}
            return {"success": True, "plan": plan_json,
                    "retrieved_docs": standard_docs, "search_query": query,
                    "source_file": filename}
        except Exception as e:
            return {"success": False, "error": str(e),
                    "retrieved_docs": standard_docs, "search_query": query,
                    "source_file": filename}
        
    def search_and_plan(
        self,
        destination: str,
        season: str,
        companion: str,
        concept: str,
        is_route: bool,
        k: int = 5,
        only_loc: str = ""    # ← 추가: "", "true", "false" 중 하나
    ) -> Dict[str, Any]:
        # 1) 검색
        query = {
            "destination": destination,
            "season": season,
            "companion": companion,
            "TravelConcept": concept,
            "isRoute": is_route,
            "onlyLoc": only_loc,
        }
        retriever_results = self.retriever.get_top_documents(to_retriever_query(query), k=k)

        # 2) 표준화
        standard_docs = self.convert_to_standard_format(retriever_results)

        # 3) 프롬프트 변수 구성
        prompt_vars = self._build_prompt_inputs(query, standard_docs)

        # 4) 호출 및 파싱
        try:
            response = self.chain.invoke(prompt_vars)
            plan_json = self._parse_json_safely(response.content)
            if plan_json is None:
                return {"success": False, "raw_response": response.content,
                        "retrieved_docs": standard_docs, "search_query": query}
            return {"success": True, "plan": plan_json,
                    "retrieved_docs": standard_docs, "search_query": query}
        except Exception as e:
            return {"success": False, "error": str(e),
                    "retrieved_docs": standard_docs, "search_query": query}


def save_result_to_files(result: Dict[str, Any], base_filename: str = "travel_result"):
    """결과를 현재 디렉토리에 파일로 저장"""
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    
    # 1. retriever 문서들 저장
    retriever_docs = result.get("retrieved_docs", [])
    if retriever_docs:
        retriever_data = {
            "timestamp": datetime.now().isoformat(),
            "query": result.get("search_query", {}),
            "results_count": len(retriever_docs),
            "documents": retriever_docs,
        }
        
        retriever_filename = f"{base_filename}_retriever_{timestamp}.json"
        with open(retriever_filename, "w", encoding="utf-8") as f:
            json.dump(retriever_data, f, ensure_ascii=False, indent=2)
        print(f"[저장] Retriever 문서들 -> {retriever_filename}")
    
    # 2. 전체 결과 저장
    result_filename = f"{base_filename}_full_{timestamp}.json"
    with open(result_filename, "w", encoding="utf-8") as f:
        json.dump(result, f, ensure_ascii=False, indent=2)
    print(f"[저장] 전체 결과 -> {result_filename}")
    
    return retriever_filename, result_filename


def main():

    
    parser = argparse.ArgumentParser(description='Generate Jeju travel plan using LLM')
    
    parser.add_argument('--query-file', required=True, help='JSON file with travel query and configuration')
    
    args = parser.parse_args()

    # query 파일 로딩 (필수)
    try:
        with open(args.query_file, "r", encoding="utf-8") as f:
            config = json.load(f)
        print(f"✅ 설정 파일 로드: {args.query_file}")
    except FileNotFoundError:
        print(f"❌ 설정 파일을 찾을 수 없습니다: {args.query_file}")
        return 1
    except json.JSONDecodeError as e:
        print(f"❌ JSON 파싱 오류: {e}")
        return 1

    # 설정 추출
    mode = config.get("mode", "search")  # search 또는 file
    env = config.get("env", "test")
    input_file = config.get("input_file", "retriever_result.json")  # file 모드용
    only_loc = config.get("onlyLoc", "")

    # 여행 조건 추출
    destination = config.get("destination", "제주도")
    season = config.get("season", "")
    companion = config.get("companion", "")
    concept = config.get("TravelConcept", "")
    is_route = config.get("isRoute", False)
    k = config.get("k", 5)

    try:
        # 여행 계획기 초기화
        if mode == 'search':
            planner = JejuTravelPlanner(env=env)
        elif mode == 'file':
            # 파일 모드에서는 LLM만 초기화
            planner = JejuTravelPlanner.__new__(JejuTravelPlanner)
            planner._setup_llm()
            planner._setup_chain()
        else:
            print(f"❌ 지원하지 않는 모드: {mode} (search 또는 file만 가능)")
            return 1

        # 여행 계획 생성
        if mode == 'search':
            result = planner.search_and_plan(
                destination=destination,
                season=season,
                companion=companion,
                concept=concept,
                is_route=is_route,
                k=k,
                only_loc=only_loc,
            )

        else:  # file mode
            query = {
                "destination": destination,
                "season": season,
                "companion": companion,
                "TravelConcept": concept
            }
            
            result = planner.plan_from_file(
                filename=input_file,
                is_route=is_route,
                override_query=query,
                only_loc=only_loc,
            )

        # 결과를 파일로 저장
        try:
            save_result_to_files(result)
        except Exception as e:
            print(f"[저장 오류] {e}")

        # 결과 상태만 간단히 출력
        if result["success"]:
            print("✅ 여행 계획 생성 성공")
            if "plan" in result:
                plan = result["plan"]
                print(f"📋 계획 타입: {plan.get('recommendation_type', 'unknown')}")
                print(f"📝 요약: {plan.get('summary_description', '')[:100]}...")
        else:
            print("❌ 여행 계획 생성 실패")
            if "error" in result:
                print(f"🚫 오류: {result['error']}")

        return 0 if result["success"] else 1

    except Exception as e:
        print(f"❌ 실행 실패: {e}")
        import traceback
        traceback.print_exc()
        return 1


if __name__ == "__main__":
    main()