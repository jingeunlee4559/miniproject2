import { Container, Row, Col, Button, Card, Nav } from 'react-bootstrap';
import 'aos/dist/aos.css';
import React, { useCallback, useEffect, useState } from 'react';
import AOS from 'aos';
import axios from '../axios';
import { Link, useNavigate } from 'react-router-dom';

import '../css/Main.css';
import TopTravelList from '../components/TopTravelList';
import PersonalizedTravelList from '../components/PersonalizedTravelList';

function Home() {
    const navigate = useNavigate();
    const navigateTo = useCallback((path) => navigate(path), [navigate]);
    const [activeTab, setActiveTab] = useState('age');

    useEffect(() => {
        AOS.init();
    }, []);
    const travelData = {
        popular: [
            {
                store_idx: 1,
                img: '/img/travel1234.png',
                title: '오무아무아',
                location: '충청북도 단양군',
                age: '30대',
                gender: '여성',
            },
            {
                store_idx: 2,
                img: '/img/travel1234.png',
                title: '해운대',
                location: '부산광역시',
                age: '20대',
                gender: '남성',
            },
            {
                store_idx: 3,
                img: '/img/travel1234.png',
                title: '경주 불국사',
                location: '경상북도 경주시',
                age: '40대',
                gender: '남성',
            },
            {
                store_idx: 4,
                img: '/img/travel1234.png',
                title: '에버랜드',
                location: '경기도 용인시',
                age: '50대 이상',
                gender: '여성',
            },
        ],

        age: [
            {
                store_idx: 1,
                img: '/img/travel1234.png',
                title: '오무아무아',
                location: '충청북도 단양군',
                age: '30대',
                gender: '남성',
            },
            {
                store_idx: 5,
                img: '/img/travel1234.png',
                title: '거창 항노화',
                location: '경상남도 거창군',
                age: '30대',
                gender: '여성',
            },
            {
                store_idx: 6,
                img: '/img/travel1234.png',
                title: '대야산',
                location: '경상북도 문경시',
                age: '10대',
                gender: '남성',
            },
            {
                store_idx: 4,
                img: '/img/travel1234.png',
                title: '에버랜드',
                location: '경기도 용인시',
                age: '50대 이상',
                gender: '여성',
            },
        ],

        gender: [
            {
                store_idx: 2,
                img: '/img/travel1234.png',
                title: '해운대',
                location: '부산광역시',
                age: '20대',
                gender: '여성',
            },
            {
                store_idx: 7,
                img: '/img/travel1234.png',
                title: '남산타워',
                location: '서울특별시',
                age: '40대',
                gender: '남성',
            },
            {
                store_idx: 8,
                img: '/img/travel1234.png',
                title: '성산일출봉',
                location: '제주도',
                age: '20대',
                gender: '여성',
            },
            {
                store_idx: 6,
                img: '/img/travel1234.png',
                title: '대야산',
                location: '경상북도 문경시',
                age: '10대',
                gender: '남성',
            },
        ],

        review: [
            {
                store_idx: 3,
                img: '/img/travel1234.png',
                title: '경주 불국사',
                location: '경상북도 경주시',
                age: '40대',
                gender: '남성',
            },
            {
                store_idx: 9,
                img: '/img/travel1234.png',
                title: '전주 한옥마을',
                location: '전라북도 전주시',
                age: '30대',
                gender: '여성',
            },
            {
                store_idx: 6,
                img: '/img/travel1234.png',
                title: '대야산',
                location: '경상북도 문경시',
                age: '10대',
                gender: '남성',
            },
            {
                store_idx: 6,
                img: '/img/travel1234.png',
                title: '대야산',
                location: '경상북도 문경시',
                age: '10대',
                gender: '남성',
            },
        ],

        all: [
            {
                store_idx: 1,
                img: '/img/travel1234.png',
                title: '오무아무아',
                location: '충청북도 단양군',
                age: '30대',
                gender: '여성', // popular 배열 기준 또는 age 배열과 다를 경우 우선 popular 우선 적용 가능
            },
            {
                store_idx: 2,
                img: '/img/travel1234.png',
                title: '해운대',
                location: '부산광역시',
                age: '20대',
                gender: '남성', // popular 배열 기준
            },
            {
                store_idx: 3,
                img: '/img/travel1234.png',
                title: '경주 불국사',
                location: '경상북도 경주시',
                age: '40대',
                gender: '남성',
            },
            {
                store_idx: 4,
                img: '/img/travel1234.png',
                title: '에버랜드',
                location: '경기도 용인시',
                age: '50대 이상',
                gender: '여성',
            },
            {
                store_idx: 5,
                img: '/img/travel1234.png',
                title: '거창 항노화',
                location: '경상남도 거창군',
                age: '30대',
                gender: '여성',
            },
            {
                store_idx: 6,
                img: '/img/travel1234.png',
                title: '대야산',
                location: '경상북도 문경시',
                age: '10대',
                gender: '남성',
            },
            {
                store_idx: 7,
                img: '/img/travel1234.png',
                title: '남산타워',
                location: '서울특별시',
                age: '40대',
                gender: '남성',
            },
            {
                store_idx: 8,
                img: '/img/travel1234.png',
                title: '성산일출봉',
                location: '제주도',
                age: '20대',
                gender: '여성',
            },
            {
                store_idx: 9,
                img: '/img/travel1234.png',
                title: '전주 한옥마을',
                location: '전라북도 전주시',
                age: '30대',
                gender: '여성',
            },
        ],
    };

    return (
        <>
            <Container fluid className="p-0">
                <Row noGutters>
                    <Col>
                        <div className="video-container">
                            <video className="video-content" muted autoPlay loop>
                                <source src="/videos/travel.mp4" type="video/mp4" />
                            </video>
                            <div className="video-overlay">
                                <h1>소중한 오늘, 잊지 못할 내일을 위한 첫걸음</h1>
                                <p>여행이 주는 감동을 함께 그려가요.</p>
                                <Button onClick={() => navigateTo('/Aichoice')}>시작하기</Button>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Container>

            <Container className="mt-5 pt-5">
                <Row className="text-center mb-3 pt-5">
                    <h2 className="fw-bold">🔥 지금 가장 인기 있는 여행지 TOP4</h2>
                </Row>
                <TopTravelList travelData={travelData.popular} />

                <PersonalizedTravelList travelData={travelData} activeTab={activeTab} setActiveTab={setActiveTab} />
            </Container>

            <Container className="mt-4">
                <Row className="my-2 no-gutters">
                    <Col lg={12} md={12} sm={12} className="t2 text-center">
                        <h2>기능소개</h2>
                    </Col>
                </Row>
                <Row className="d-flex align-items-center justify-content-center" data-aos="fade-left" data-aos-offset="300" data-aos-easing="ease-in-sine">
                    <Col xs={12} md={6} lg={6} className="my-3 d-flex justify-content-center align-items-center login-form-container">
                        <img src="img/travel1234.png" alt="Description" className="img-fluid" />
                    </Col>
                    <Col xs={12} md={6} lg={6} className="my-3 d-flex flex-column align-items-center justify-content-center mkt">
                        <h1 className="text-center">AI추천</h1>
                        <p className="text-center">맞춤형 AI 추천으로 취향의 맞는 여행지를 찾으세요!</p>
                    </Col>
                </Row>
                <Row className="d-flex align-items-center justify-content-center" data-aos="fade-right" data-aos-offset="300" data-aos-easing="ease-in-sine">
                    <Col xs={12} md={6} lg={6} className="my-3 d-flex flex-column align-items-center justify-content-center mkt">
                        <h1 className="text-center">캘린더</h1>
                        <p className="text-center">직관적인 캘린더에서 일정 관리, 장소와 시간의 색상 구분으로 일정을 명확하게 확인하세요.</p>
                    </Col>
                    <Col xs={12} md={6} lg={6} className="my-3 d-flex justify-content-center align-items-center login-form-container">
                        <img src="img/cal.png" alt="Description" className="img-fluid" />
                    </Col>
                </Row>
            </Container>
        </>
    );
}

export default Home;
