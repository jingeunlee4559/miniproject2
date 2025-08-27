#!/usr/bin/env python3

import os
import json
from typing import List, Dict, Any, Optional
from langchain_chroma import Chroma

class JejuTravelRetriever:
    """
    의존성 주입: 이미 생성된 Chroma vectorstore 인스턴스만 받음.
    """
    def __init__(self, vectorstore: Chroma):
        self.vs = vectorstore
        if hasattr(self.vs, "as_retriever"):
            try:
                self.retriever = self.vs.as_retriever(search_kwargs={"k": 5})
            except Exception:
                self.retriever = None
        else:
            self.retriever = None
    
    def build_query_text(self, query_json: Dict[str, Any]) -> str:
        destination = query_json.get("destination", "")
        season = query_json.get("season", "")
        companion = query_json.get("companion", "")
        travel_concept = query_json.get("TravelConcept", "")
        
        # 자연어 매핑
        season_map = {
            "봄": "봄",
            "여름": "여름", 
            "가을": "가을",
            "겨울": "겨울"
        }
        
        companion_map = {
            "혼자여행": "혼자",
            "커플여행": "연인",
            "가족여행": "가족",
            "우정여행": "친구"
        }
        
        concept_map = {
            "액티비티": "액티비티 체험",
            "힐링": "힐링 휴양",
            "문화": "문화 관광",
            "자연": "자연 경관"
        }
        
        # 자연어 문장 생성
        season_text = season_map.get(season, season)
        companion_text = companion_map.get(companion, companion)
        concept_text = concept_map.get(travel_concept, travel_concept)
        
        # 템플릿 기반 쿼리 생성
        if all([destination, season_text, companion_text, concept_text]):
            query_text = f"{destination} {season_text}에 {companion_text}과 여행하기 좋은 {concept_text} 중심 관련 글"
        else:
            # 일부 정보가 없는 경우 유연하게 처리
            parts = []
            if destination:
                parts.append(destination)
            if season_text:
                parts.append(f"{season_text} 여행")
            if companion_text:
                parts.append(f"{companion_text} 여행")
            if concept_text:
                parts.append(concept_text)
            query_text = " ".join(parts)
        
        return query_text
    
    def retrieve_documents(self, query_json: Dict[str, Any], 
                          k: int = 5,
                          show_scores: bool = True) -> List[Dict[str, Any]]:
        """
        JSON 쿼리를 기반으로 관련 문서 검색
        
        Args:
            query_json: 검색할 쿼리 JSON
            k: 반환할 문서 개수
            show_scores: 유사도 점수 표시 여부
            
        Returns:
            검색된 문서들의 리스트
        """
        # JSON을 자연어 쿼리로 변환
        query_text = self.build_query_text(query_json)
        print(f"Generated query: {query_text}")
        
        # 유사도 검색 수행
        results_with_scores = self.vectorstore.similarity_search_with_score(
            query_text, k=k
        )
        
        # 결과 포맷팅
        results = []
        for doc, score in results_with_scores:
            result = {
                "content": doc.page_content,
                "metadata": doc.metadata,
                "title": doc.metadata.get("title", ""),
                "url": doc.metadata.get("url", ""),
                "chunk_id": doc.metadata.get("chunk_id", ""),
                "parent_doc_id": doc.metadata.get("parent_doc_id", ""),
                "section_index": doc.metadata.get("section_index", 0),
                "chunk_index": doc.metadata.get("chunk_index", 0),
                "similarity_score": score if show_scores else None
            }
            results.append(result)
        
        return results
    
    def retrieve_documents_multi_query(self, query_json: Dict[str, Any], 
                                       k: int = 5,
                                       show_scores: bool = True) -> List[Dict[str, Any]]:
        """
        다중 쿼리 검색으로 더 정확한 결과 반환
        
        Args:
            query_json: 검색할 쿼리 JSON
            k: 반환할 문서 개수
            show_scores: 유사도 점수 표시 여부
            
        Returns:
            검색된 문서들의 리스트
        """
        all_results = []
        seen_chunk_ids = set()
        
        destination = query_json.get("destination", "")
        season = query_json.get("season", "")
        companion = query_json.get("companion", "")
        travel_concept = query_json.get("TravelConcept", "")
        
        # 키워드 조합 생성
        search_queries = []

        # 계절 + 동반자 조합
        if season and companion:
            season_companion_map = {
            # 🍁 가을
            ("가을", "우정여행"): [
                "가을 친구 여행", "가을 친구끼리", "9월 10월 11월 친구", "가을철 우정여행",
                "가을 우정 여행지", "가을 친구 추천", "가을 놀러가기 좋은 곳", "단풍 친구 여행", "가을 추억 여행"
            ],
            ("가을", "커플여행"): [
                "가을 커플 여행", "가을 연인", "9월 10월 커플", "가을 데이트 여행", "연인 단풍 여행",
                "가을 둘이서", "단풍놀이 커플", "로맨틱한 가을 여행", "커플 가을 감성 여행", "가을 감성 코스"
            ],
            ("가을", "가족여행"): [
                "가을 가족 여행", "가을 아이", "9월 10월 가족", "가족과 단풍 구경", "가을철 가족여행지",
                "가을 부모님 여행", "가을 가족 나들이", "단풍 시즌 가족 여행", "가을 초등학생 여행", "가을 유아 동반 여행"
            ],
            ("가을", "혼자여행"): [
                "가을 혼자 여행", "가을 솔로", "9월 10월 혼행", "가을 혼자 떠나는 여행", "가을 나홀로 여행",
                "단풍 혼자 보기", "가을 감성 혼행", "가을 혼자 힐링", "혼자 가는 가을 명소", "가을 혼밥 여행"
            ],

            # 🌸 봄
            ("봄", "우정여행"): [
                "봄 친구 여행", "벚꽃 우정 여행", "3월 4월 5월 친구", "봄철 우정 여행지",
                "봄 소풍 친구랑", "봄꽃놀이 친구", "친구랑 벚꽃", "따뜻한 봄 친구 여행", "봄 우정 사진여행"
            ],
            ("봄", "커플여행"): [
                "봄 커플 여행", "벚꽃 데이트", "3월 4월 5월 연인", "봄 연인 추천 여행", "따뜻한 커플 봄여행",
                "봄 데이트 여행지", "커플 벚꽃명소", "봄 감성 커플", "봄 로맨틱 여행", "봄철 연인 여행"
            ],
            ("봄", "가족여행"): [
                "봄 가족 여행", "3월 4월 5월 가족", "봄철 가족", "봄 나들이 가족", "봄꽃 가족 여행",
                "벚꽃 가족여행", "봄 가족 나들이 코스", "봄 유치원 가족여행", "어린이날 여행", "봄 주말 가족 나들이"
            ],
            ("봄", "혼자여행"): [
                "봄 혼자 여행", "봄 혼자", "봄 감성 나홀로", "벚꽃 혼자보기", "혼자 떠나는 봄 여행",
                "혼자 벚꽃길 걷기", "봄 힐링 혼행", "봄 감성", "봄철 솔로여행", "봄 혼밥 여행"
            ],

            # ☀️ 여름
            ("여름", "우정여행"): [
                "여름 친구 여행", "6월 7월 8월 친구", "여름철 우정여행", "여름 바다 친구", "친구끼리 워터파크",
                "여름 계곡 친구여행", "여름 우정 여행지", "여름 불멍 친구", "여름 MT 느낌 여행", "찜통 더위 친구랑"
            ],
            ("여름", "커플여행"): [
                "여름 커플 여행", "여름 데이트", "여름 연인 추천", "7월 커플 바캉스", "여름 바다 커플",
                "커플 계곡 여행", "여름 감성 데이트", "여름 커플 맛집", "무더위 피서 커플", "여름철 커플 코스"
            ],
            ("여름", "가족여행"): [
                "여름 가족 여행", "방학 가족 여행", "여름철 가족여행지", "아이들과 계곡", "7월 8월 가족 여행",
                "여름 바다 가족", "물놀이 가족여행", "가족 피서지", "여름 가족 나들이", "여름 엄마 아빠와 여행"
            ],
            ("여름", "혼자여행"): [
                "여름 혼자 여행", "여름 혼행", "혼자 여름 바다", "혼자 계곡 힐링", "여름 나홀로 여행지",
                "여름 혼자 물놀이", "여름 혼자 감성여행", "여름 혼자 더위 피하기", "혼자 여행 여름 추천", "여름 혼밥 여행"
            ],

            # ❄️ 겨울
            ("겨울", "우정여행"): [
                "겨울 친구 여행", "12월 1월 2월 친구", "겨울철 우정 여행", "눈 오는 날 친구랑", "스키장 친구들",
                "겨울 친구 불멍", "겨울 방학 친구 여행", "따뜻한 우정여행", "겨울 감성 친구", "겨울 MT 느낌"
            ],
            ("겨울", "커플여행"): [
                "겨울 커플 여행", "12월 1월 2월 연인", "겨울철 커플", "겨울 커플 데이트", "눈 오는 커플 여행",
                "겨울 눈꽃 여행", "스키장 커플", "연말 커플 여행", "겨울 감성 데이트", "크리스마스 커플 여행"
            ],
            ("겨울", "가족여행"): [
                "겨울 가족 여행", "겨울 방학 가족", "겨울철 가족 여행지", "눈 오는 날 가족 나들이", "온천 가족여행",
                "겨울 스키장 가족", "겨울 아이들과 여행", "겨울 눈썰매 가족", "12월 1월 가족 추천", "겨울 따뜻한 가족여행"
            ],
            ("겨울", "혼자여행"): [
                "겨울 혼자 여행", "겨울 혼행", "겨울 나홀로 힐링", "눈 내리는 날 혼자", "겨울 온천 혼자",
                "혼자 떠나는 겨울", "겨울 감성 혼행", "연말 혼자 정리 여행", "겨울 혼밥 코스"
            ],
        }
            key = (season, companion)
            if key in season_companion_map:
                search_queries.extend(season_companion_map[key])
        
        # 계절 + 컨셉 조합
        if season and travel_concept:
            season_concept_map = {
                ("가을", "액티비티"): ["가을 액티비티", "가을 체험", "9월 10월 활동"],
                ("가을", "힐링"): ["가을 힐링", "가을 휴식", "9월 10월 휴양"],
                ("가을", "문화"): ["가을 문화", "가을 박물관", "9월 10월 문화관광"],
                ("가을", "자연"): ["가을 자연", "가을 경관", "단풍 억새"],
                ("여름", "액티비티"): ["여름 액티비티", "여름 해수욕", "6월 7월 8월 체험"],
                ("봄", "자연"): ["봄 자연", "봄 벚꽃", "3월 4월 5월 경관"]
            }
            key = (season, travel_concept)
            if key in season_concept_map:
                search_queries.extend(season_concept_map[key])
        
        # 동반자 + 컨셉 조합
        if companion and travel_concept:
            companion_concept_map = {
                ("우정여행", "액티비티"): ["친구 액티비티", "친구 체험", "우정여행 활동"],
                ("커플여행", "힐링"): ["커플 힐링", "연인 휴양", "로맨틱 휴식"],
                ("가족여행", "문화"): ["가족 문화", "가족 박물관", "아이 문화관광"],
                ("혼자여행", "자연"): ["혼자 자연", "솔로 경관", "혼행 풍경"]
            }
            key = (companion, travel_concept)
            if key in companion_concept_map:
                search_queries.extend(companion_concept_map[key])
        
        # 전체 조합 쿼리
        if season and companion and travel_concept:
            season_text = {"가을": "가을", "여름": "여름", "봄": "봄", "겨울": "겨울"}.get(season, season)
            companion_text = {"우정여행": "친구", "커플여행": "커플", "가족여행": "가족", "혼자여행": "혼자"}.get(companion, companion)
            concept_text = {"액티비티": "액티비티", "힐링": "힐링", "문화": "문화", "자연": "자연"}.get(travel_concept, travel_concept)
            
            search_queries.extend([
                f"{season_text} {companion_text} {concept_text}",
                f"{season_text} {companion_text} 여행 {concept_text}",
                f"{companion_text} {season_text} {concept_text} 추천"
            ])
        
        # 각 키워드로 검색 수행
        for query in search_queries:
            try:
                full_query = f"{destination} {query}" if destination else query
                results_with_scores = self.vectorstore.similarity_search_with_score(full_query, k=k*2)
                
                for doc, score in results_with_scores:
                    chunk_id = doc.metadata.get("chunk_id", "")
                    if chunk_id and chunk_id not in seen_chunk_ids:
                        seen_chunk_ids.add(chunk_id)
                        
                        # 키워드 매칭 점수 계산
                        content_lower = doc.page_content.lower()
                        title_lower = doc.metadata.get("title", "").lower()
                        
                        match_score = 0
                        query_words = query.lower().split()
                        for word in query_words:
                            if word in content_lower or word in title_lower:
                                match_score += 1
                        
                        match_ratio = match_score / len(query_words) if query_words else 0
                        
                        result = {
                            "content": doc.page_content,
                            "metadata": doc.metadata,
                            "title": doc.metadata.get("title", ""),
                            "url": doc.metadata.get("url", ""),
                            "chunk_id": chunk_id,
                            "parent_doc_id": doc.metadata.get("parent_doc_id", ""),
                            "section_index": doc.metadata.get("section_index", 0),
                            "chunk_index": doc.metadata.get("chunk_index", 0),
                            "matched_keyword": query,
                            "similarity_score": score if show_scores else None,
                            "keyword_match_ratio": match_ratio,
                            "keyword_match_count": match_score
                        }
                        all_results.append(result)
            except Exception as e:
                print(f"Search error for '{query}': {e}")
                continue
        
        # 키워드 매칭 비율과 유사도 점수로 정렬
        all_results.sort(key=lambda x: (-x['keyword_match_ratio'], x['similarity_score']))
        
        return all_results[:k]
    
    def get_top_documents(self, query_json: Dict[str, Any], k: int = 5) -> List[Dict[str, Any]]:
        """
        기본검색, 다중검색, 확장검색을 통합하여 최상위 문서 반환
        
        Args:
            query_json: 검색할 쿼리 JSON
            k: 반환할 문서 개수
            
        Returns:
            page_content와 metadata를 포함하는 딕셔너리 리스트
        """
        all_results = []
        seen_chunk_ids = set()
        
        print("Basic search...")
        basic_results = self.retrieve_documents(query_json, k=k*3, show_scores=True)
        for result in basic_results:
            chunk_id = result.get('chunk_id', '')
            if chunk_id and chunk_id not in seen_chunk_ids:
                seen_chunk_ids.add(chunk_id)
                all_results.append({
                    'result': result,
                    'search_type': 'basic',
                    'score': result.get('similarity_score', 999)
                })
        
        print("Multi-keyword search...")
        multi_results = self.retrieve_documents_multi_query(query_json, k=k*3, show_scores=True)
        for result in multi_results:
            chunk_id = result.get('chunk_id', '')
            if chunk_id and chunk_id not in seen_chunk_ids:
                seen_chunk_ids.add(chunk_id)
                all_results.append({
                    'result': result,
                    'search_type': 'multi',
                    'score': result.get('similarity_score', 999)
                })
        
        print("Extended search...")
        extended_results = self.retrieve_documents(query_json, k=k*4, show_scores=True)
        for result in extended_results:
            chunk_id = result.get('chunk_id', '')
            if chunk_id and chunk_id not in seen_chunk_ids:
                seen_chunk_ids.add(chunk_id)
                all_results.append({
                    'result': result,
                    'search_type': 'extended',
                    'score': result.get('similarity_score', 999)
                })
        
        # 유사도 점수로 정렬
        all_results.sort(key=lambda x: x['score'])
        
        # 상위 k개 선택하여 형식 변환
        top_results = []
        for i, item in enumerate(all_results[:k]):
            result = item['result']
            
            formatted_result = {
                "page_content": result['content'],
                "metadata": {
                    "source": result.get('url', ''),
                    "title": result.get('title', ''),
                    "source_type": result['metadata'].get('source_type', 'unknown'),
                    "chunk_id": result.get('chunk_id', ''),
                    "similarity_score": result.get('similarity_score'),
                    "search_method": item['search_type'],
                    "rank": i + 1,
                    "original_metadata": result['metadata']
                }
            }
            top_results.append(formatted_result)
        
        print(f"Retrieved {len(top_results)} documents")
        return top_results

    def get_collection_stats(self) -> Dict[str, Any]:
        """
        컬렉션 통계 정보 반환
        """
        try:
            count = self.vectorstore._collection.count()
            return {
                "total_documents": count,
                "collection_name": self.collection_name,
                "status": "active"
            }
        except Exception as e:
            return {
                "error": str(e),
                "collection_name": self.collection_name,
                "status": "error"
            }