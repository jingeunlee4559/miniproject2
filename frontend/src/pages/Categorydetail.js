import React, { useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import Carousel3 from '../components/Carousel3';
import Map from '../components/Map';
import InfoSection from '../components/InfoSection';

function Categorydetail() {
    const [expanded, setExpanded] = useState(false);

    const toggleContent = () => setExpanded(!expanded);

    const fullText = `증심사는 광주지역의 대표적인 불교도량으로 무등산 서쪽 기슭에 자리 잡고 있다. 통일신라 때 고승 철감선사 도윤이 9세기 중엽에 세운 절로 고려 선종 때(1094년) 혜소국사가 고쳐 짓고 조선 세종 때 김방이 삼창하였는데 이때 오백나한의 불사가 이루어졌다고 한다. 이후 임진왜란 때 불타 없어진 것을 1609년(광해군 1)에 석경·수장·도광의 3대 선사가 4창했다고 한다. 그 후 신도들의 정성으로 몇 차례 보수가 이루어졌으나, 6 ·25 전쟁 때 많은 부분이 소실되었다가 1970년에야 대웅전을 비롯한 건물들이 복구되었다. 증심사의 유물로는 오백전과 비로전(사성전)에 봉안된 철조비로자나불 좌상(보물), 신라 말기의 석탑인 증심사 삼층석탑(지방유형문화재), 범종각, 각 층의 4면에 범자가 새겨진 범자칠층석탑 등 수많은 문화재가 있다. 특히 오백전은 무등산에 남아 있는 사찰 건물들 중 현재 가장 오래된 조선 초기(세종 25년)의 건물로 강진의 무위사 극락전과 계통을 같이 하는 정면 3간, 측면 3간의 단층 맞배지붕의 다심포 양식으로 그 희귀성이 돋보인다. 이에 1986년 11월 1일 광주문화재자료로 지정되어 있는 사찰이다. 다양한 템플스테이가 활발하게 운영되고 있으며 여러 가지 체험프로그램이 있다.`;

    const shortText = fullText.slice(0, 400) + '...'; // 처음 150자만 표시

    return (
        <>
            <Row className="mt-5" />
            <Container className="mt-5">
                {/* 제목 */}
                <Row id="home">
                    <Col style={{ fontSize: '3rem', fontWeight: 'bold' }}>증심사(광주)</Col>
                </Row>

                {/* 위치 정보 */}
                <Row>
                    <Col style={{ color: 'gray' }}>광주 동구</Col>
                </Row>

                {/* 요약 설명 (짧은 밑줄) */}
                <Row className="mt-3 mb-4">
                    <Col style={{ paddingBottom: '4px' }}>
                        <span
                            style={{
                                borderBottom: '2px solid #6DD2FF',
                                paddingBottom: '2px',
                                fontWeight: '500',
                                color: '#333',
                                whiteSpace: 'nowrap',
                            }}
                        >
                            철감선사 도윤이 창건한 사찰, 무등산의 대표적인 불교 도량
                        </span>
                    </Col>
                </Row>

                {/* 이미지 캐러셀 */}
                <Row className="my-5 d-flex justify-content-center">
                    <Col>
                        <Carousel3 />
                    </Col>
                </Row>

                {/* 상세정보 타이틀 */}
                <Row className="t2 mb-4" id="detail">
                    <Col
                        // xs="auto"
                        style={{
                            fontWeight: 'inherit',
                            fontSize: '1.8rem',
                            borderBottom: '2px solid #6DD2FF',
                            paddingBottom: '4px',
                        }}
                    >
                        상세정보
                    </Col>
                </Row>

                {/* 본문 내용 */}
                <Row>
                    <Col
                        style={{
                            lineHeight: '1.8',
                            fontSize: '1rem',
                            fontFamily: '"Pretendard", sans-serif',
                            display: expanded ? 'block' : '-webkit-box',
                            WebkitLineClamp: expanded ? 'none' : 3, // 줄 수 조절
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                        }}
                    >
                        {fullText}
                    </Col>
                </Row>

                {fullText.length > shortText.length && (
                    <Row className="mt-2">
                        <Col className="d-flex justify-content-end">
                            <span
                                onClick={toggleContent}
                                style={{
                                    color: '#007bff',
                                    cursor: 'pointer',
                                    fontWeight: '500',
                                }}
                            >
                                {expanded ? '내용 접기 ▲' : '내용 더보기 ▼'}
                            </span>
                        </Col>
                    </Row>
                )}

                <Row>
                    <Col>
                        <Map lat={35.128749} lon={126.9698984} />
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <InfoSection />
                    </Col>
                </Row>
            </Container>
        </>
    );
}

export default Categorydetail;
