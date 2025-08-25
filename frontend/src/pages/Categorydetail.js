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
    // URL 경로에서 ID 값을 가져옵니다 (예: /category/97 -> id는 97)
    const { store_idx } = useParams();
    // 백엔드에서 받아온 여행지 상세 정보를 저장할 상태
    const [spot, setSpot] = useState(null);
    // 데이터 로딩 상태
    const [loading, setLoading] = useState(true);

    // 댓글 관련 상태 (추후 DB 연동 필요)
    const [comments, setComments] = useState([]);

    // 페이지가 로딩될 때 실행되는 로직
    useEffect(() => {
        const detailUrl = `/api/category/${store_idx}`;
        const viewUrl = `/api/category/${store_idx}/view`;

        // 1. 상세 정보 조회 API 호출 (GET 요청)
        axios
            .get(detailUrl)
            .then((response) => {
                setSpot(response.data);
            })
            .catch((error) => {
                console.error('상세 정보 로딩 실패:', error);
            })
            .finally(() => {
                setLoading(false);
            });

        // 2. 조회수 증가 API 호출 (PUT 요청)
        axios.put(`${viewUrl}/view`).catch((error) => console.error('조회수 증가 요청 실패:', error));
    }, [store_idx]); // id 값이 바뀔 때마다 이 effect가 다시 실행됩니다.

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
                    <Col style={{ color: 'gray' }}>
                        {spot.region1Name} &gt; {spot.region2Name}
                    </Col>
                </Row>

                {/* 요약 설명 */}
                <Row className="mt-3 mb-4">
                    <Col style={{ paddingBottom: '4px' }}>
                        <span style={{ borderBottom: '2px solid #6DD2FF', paddingBottom: '2px', fontWeight: '500' }}>{spot.shortDesc}</span>
                    </Col>
                </Row>

                {/* 이미지 캐러셀 (이미지 데이터는 spot.imageUrls 같은 필드에서 받아와야 함) */}
                <Row className="my-5 d-flex justify-content-center">
                    <Col>
                        <Carousel3 images={spot.imageUrls} />
                    </Col>
                </Row>

                {/* 상세정보 */}
                <Row className="t2 mb-4 pt-5" id="detail">
                    <Col style={{ fontSize: '1.8rem', borderBottom: '2px solid #6DD2FF', paddingBottom: '4px' }}>상세정보</Col>
                </Row>
                <Row>
                    <Col style={{ lineHeight: '1.8' }}>
                        {/* DB의 detailDesc 필드 사용 */}
                        {spot.detailDesc}
                    </Col>
                </Row>

                {/* 지도 (DB의 lat, lon 필드 사용) */}
                <Row>
                    <Col>
                        <Map lat={spot.lat} lon={spot.lon} />
                    </Col>
                </Row>

                {/* 표 정보 (DB의 address, fee 등 필드 사용) */}
                <Row>
                    <Col>
                        <InfoSection info={spot} />
                    </Col>
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
