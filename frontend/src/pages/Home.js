import { Container, Row, Col, Button, Card, Nav } from "react-bootstrap";
import "aos/dist/aos.css";
import React, { useCallback, useEffect, useState } from "react";
import AOS from "aos";
import axios from "../axios";
import { Link, useNavigate } from "react-router-dom";

import "../css/Main.css";



function Home() {

  const navigate = useNavigate();
  const navigateTo = useCallback((path) => navigate(path), [navigate])
  const [activeTab, setActiveTab] = useState("age");

    
  useEffect(() => {
    AOS.init();
  }, []);

  const travelData = {
    age: [
      {
        img: "/img/travel1234.png",
        title: "오무아무아",
        location: "충청북도 단양군",
      },
      {
        img: "/img/travel1234.png",
        title: "거창 항노화",
        location: "경상남도 거창군",
      },
      {
        img: "/img/travel1234.png",
        title: "대야산",
        location: "경상북도 문경시",
      },
      {
        img: "/img/travel1234.png",
        title: "에버랜드",
        location: "경기도 용인시",
      },
    ],
    gender: [
      {
        img: "/img/travel1234.png",
        title: "해운대",
        location: "부산광역시",
      },
      {
        img: "/img/travel1234.png",
        title: "남산타워",
        location: "서울특별시",
      },
      {
        img: "/img/travel1234.png",
        title: "성산일출봉",
        location: "제주도",
      },
    ],
    review: [
      {
        img: "/img/travel1234.png",
        title: "경주 불국사",
        location: "경상북도 경주시",
      },
      {
        img: "/img/travel1234.png",
        title: "전주 한옥마을",
        location: "전라북도 전주시",
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
                <Button onClick={() => navigateTo("/Aichoice")}>
                  시작하기
                </Button>
              </div>
            </div>
          </Col>
        </Row>
      </Container>

        <Container className="mt-5">
        <Row className="text-center mb-3">
          <h2 className="fw-bold">여행 추천</h2>
          <p className="text-muted">
            당신의 성향,  마음에 쏙 들 여행지를 추천해 드릴게요.
          </p>
        </Row>

<Row className="justify-content-center mb-4">
  <Nav
    className="custom-nav full-width-nav"
    activeKey={activeTab}
    onSelect={(k) => setActiveTab(k)}
  >
    <Nav.Item className="nav-item-custom">
      <Nav.Link eventKey="age">연령별</Nav.Link>
    </Nav.Item>
    <div className="divider"></div>
    <Nav.Item className="nav-item-custom">
      <Nav.Link eventKey="gender">성별</Nav.Link>
    </Nav.Item>
    <div className="divider"></div>
    <Nav.Item className="nav-item-custom">
      <Nav.Link eventKey="review">리뷰별</Nav.Link>
    </Nav.Item>
  </Nav>
</Row>


        {/* 카드 리스트 */}
        <Row>
          {travelData[activeTab].map((item, index) => (
            <Col key={index} xs={12} sm={6} md={3} className="mb-4">
              <Card className="shadow-sm h-100 ai-card">
                <Card.Img
                  variant="top"
                  src={item.img}
                  alt={item.title}
                  style={{ height: "200px", objectFit: "cover" }}
                />
                <Card.Body>
                  <Card.Title className="fw-bold">{item.title}</Card.Title>
                  <Card.Text className="text-muted">{item.location}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        {/* 새로고침 버튼 */}
        <Row className="text-center mt-3">
          <Button variant="outline-primary" className="rounded-pill">
            오늘의 추천 새로고침
          </Button>
        </Row>
      </Container>

    <Container className="mt-4">
  <Row className="my-2 no-gutters">
    <Col lg={12} md={12} sm={12} className="t2 text-center">
      기능
    </Col>
  </Row>
  <Row className="d-flex align-items-center justify-content-center" data-aos="fade-left" data-aos-offset="300" data-aos-easing="ease-in-sine">
    <Col xs={12} md={6} lg={6} className="my-3 d-flex justify-content-center align-items-center login-form-container">
      <img src="img/aire.png" alt="Description" className="img-fluid" />
    </Col>
    <Col xs={12} md={6} lg={6} className="my-3 d-flex flex-column align-items-center justify-content-center mkt">
      <h1 className="text-center">AI웨딩플랜</h1>
      <p className="text-center">맞춤형 AI 추천으로 최적의 웨딩홀, 스튜디오, 드레스, 메이크업 업체를 제안받으세요.</p>
    </Col>
  </Row>
      <Row className="d-flex align-items-center justify-content-center"  data-aos="fade-right" data-aos-offset="300" data-aos-easing="ease-in-sine">
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
