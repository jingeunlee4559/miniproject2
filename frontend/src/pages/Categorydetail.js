import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Col, Container, Row, Spinner } from 'react-bootstrap';
import axios from 'axios';
import Carousel3 from '../components/Carousel3'; // 이미지 캐러셀
import Map from '../components/Map'; // 지도
import InfoSection from '../components/InfoSection'; // 상세정보 테이블
import CommentForm from '../components/CommentForm'; // 댓글 입력 폼
import CommentList from '../components/CommentList'; // 댓글 목록

function Categorydetail() {
    // URL 경로에서 ID 값을 가져옵니다 (예: /category/97 -> store_idx는 97)
    const { store_idx } = useParams();
    // 백엔드에서 받아온 여행지 상세 정보를 저장할 상태
    const [spot, setSpot] = useState(null);
    // 데이터 로딩 상태
    const [loading, setLoading] = useState(true);

    // 댓글 관련 상태 (추후 DB 연동 필요)
    const [comments, setComments] = useState([]);

    // 페이지가 로딩될 때 실행되는 로직
    useEffect(() => {
        const detailUrl = `http://localhost:8090/api/category/${store_idx}`;
        const viewUrl = `http://localhost:8090/api/category/${store_idx}/view`;

        console.log('API 호출 URL:', detailUrl);
        console.log('조회수 증가 URL:', viewUrl);

        // 1. 상세 정보 조회 API 호출 (GET 요청)
        axios
            .get(detailUrl)
            .then((response) => {
                console.log('상세 정보 응답:', response.data);
                setSpot(response.data);
            })
            .catch((error) => {
                console.error('상세 정보 로딩 실패:', error);
                console.error('에러 상세:', error.response);
            })
            .finally(() => {
                setLoading(false);
            });

        // 2. 조회수 증가 API 호출 (PUT 요청) - URL 수정
        axios.put(viewUrl).catch((error) => console.error('조회수 증가 요청 실패:', error));
        console.log('상세 정보 응답:', spot);
    }, [store_idx]); // store_idx 값이 바뀔 때마다 이 effect가 다시 실행됩니다.

    // 로딩 중일 때 보여줄 화면
    if (loading) {
        return (
            <Container className="d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
                <Spinner animation="border" />
                <span className="ms-2">상세 정보를 불러오는 중입니다...</span>
            </Container>
        );
    }

    // 데이터를 찾지 못했을 때 보여줄 화면
    if (!spot) {
        return (
            <Container>
                <p className="text-center my-5">해당 여행지 정보를 찾을 수 없습니다.</p>
            </Container>
        );
    }

    return (
        <>
            <Row className="mt-5" />
            <Container className="mt-5">
                {/* 제목 */}
                <Row id="home">
                    <Col style={{ fontSize: '3rem', fontWeight: 'bold' }}>{spot.name}</Col>
                </Row>

                {/* 위치 정보 */}
                <Row>
                    <Col style={{ color: 'gray' }}>{spot.region1Name && spot.region2Name ? `${spot.region1Name} > ${spot.region2Name}` : spot.address}</Col>
                </Row>

                {/* 조회수 */}
                <Row className="mt-2">
                    <Col style={{ color: '#888', fontSize: '0.9rem' }}>👁️ 조회수: {spot.viewCount || 0}</Col>
                </Row>

                {/* 요약 설명 */}
                <Row className="mt-3 mb-4">
                    <Col style={{ paddingBottom: '4px' }}>
                        <span style={{ borderBottom: '2px solid #6DD2FF', paddingBottom: '2px', fontWeight: '500' }}>{spot.shortDesc || '여행지 소개'}</span>
                    </Col>
                </Row>

                {/* 이미지 캐러셀 */}
                <Row className="my-5 d-flex justify-content-center">
                    <Col>
                        {spot.imageUrls && spot.imageUrls.length > 0 ? (
                            <Carousel3 images={spot.imageUrls} />
                        ) : (
                            <div
                                style={{
                                    width: '100%',
                                    height: '400px',
                                    backgroundColor: '#f8f9fa',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    borderRadius: '8px',
                                }}
                            >
                                <span style={{ color: '#6c757d' }}>이미지가 없습니다</span>
                            </div>
                        )}
                    </Col>
                </Row>

                {/* 상세정보 */}
                <Row className="t2 mb-4 pt-5" id="detail">
                    <Col style={{ fontSize: '1.8rem', borderBottom: '2px solid #6DD2FF', paddingBottom: '4px' }}>상세정보</Col>
                </Row>
                <Row>
                    <Col style={{ lineHeight: '1.8', fontSize: '1rem', fontFamily: '"Pretendard", sans-serif' }}>{spot.detailDesc || spot.shortDesc || '상세 정보가 없습니다.'}</Col>
                </Row>

                {/* 지도 */}
                {spot.lat && spot.lon && (
                    <Row>
                        <Col>
                            <Map lat={spot.lat} lon={spot.lon} />
                        </Col>
                    </Row>
                )}

                {/* 표 정보 */}
                <Row>
                    <Col>{spot && <InfoSection info={spot} />}</Col>
                </Row>

                {/* 댓글 */}
                <Row className="t2 mb-4 pt-5" id="comments">
                    <Col style={{ fontSize: '1.8rem', borderBottom: '2px solid #6DD2FF', paddingBottom: '4px' }}>
                        댓글 <span style={{ color: '#6DD2FF' }}>({comments.length}개)</span>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <CommentForm />
                    </Col>
                </Row>
                <Row>
                    <CommentList comments={comments} />
                </Row>
            </Container>
        </>
    );
}

export default Categorydetail;
