// PersonalizedTravelList.js
import React from 'react';
import { Row, Col, Card, Nav } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const PersonalizedTravelList = ({ travelData, activeTab, setActiveTab }) => {
    const navigate = useNavigate();

    return (
        <>
            <Row className="text-center mb-3 pt-5">
                <h2 className="fw-bold">당신에게 맞춘 여행지</h2>
                <p className="text-muted">데이터로 찾은, 당신이 사랑할만한 여행지.</p>
            </Row>

            <Row className="justify-content-center mb-4">
                <div
                    style={{
                        width: '100vw',
                        position: 'relative',
                        left: '50%',
                        right: '50%',
                        transform: 'translateX(-50%)',
                    }}
                >
                    <Nav className="custom-nav full-width-nav" activeKey={activeTab} onSelect={(k) => setActiveTab(k)}>
                        <Nav.Item className="nav-item-custom">
                            <Nav.Link className="m-link-nav" eventKey="age">
                                연령별
                            </Nav.Link>
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
                </div>
            </Row>

            <Row>
                {travelData[activeTab]?.map((item, index) => (
                    <Col key={index} xs={12} sm={6} md={3} className="mb-4">
                        <Card className="shadow-sm h-100 ai-card" onClick={() => navigate(`/Category/${item.store_idx}`)} style={{ cursor: 'pointer' }}>
                            <Card.Img variant="top" src={item.img} alt={item.title} style={{ height: '200px', objectFit: 'cover' }} />
                            <Card.Body>
                                <Card.Title className="fw-bold">{item.title}</Card.Title>
                                <Card.Text className="text-muted">{item.location}</Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </>
    );
};

export default PersonalizedTravelList;
