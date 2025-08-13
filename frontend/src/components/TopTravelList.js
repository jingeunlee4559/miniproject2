import React from 'react';
import { Row, Col, Card, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import '../css/TopTravelList.css';

const TopTravelList = ({ travelData }) => {
    const navigate = useNavigate();

    // 순위 색상 지정 (1~4위)
    const rankColors = ['warning', 'secondary', 'info', 'dark'];

    return (
        <Row>
            {travelData.slice(0, 4).map((item, index) => (
                <Col key={index} xs={12} sm={6} md={3} className="mb-4">
                    <Card className="shadow-sm h-100 ai-card position-relative" onClick={() => navigate(`/Category/${item.store_idx}`)} style={{ cursor: 'pointer' }}>
                        {/* 순위 뱃지 */}
                        <Badge bg={rankColors[index]} className="position-absolute top-0 start-0 m-2 fs-6 px-2 py-1 rounded-pill shadow">
                            {index + 1}위
                        </Badge>

                        <Card.Img variant="top" src={item.img} alt={item.title} style={{ height: '200px', objectFit: 'cover' }} />
                        <Card.Body>
                            <Card.Title className="fw-bold">{item.title}</Card.Title>
                            <Card.Text className="text-muted">{item.location}</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
            ))}
        </Row>
    );
};

export default TopTravelList;
