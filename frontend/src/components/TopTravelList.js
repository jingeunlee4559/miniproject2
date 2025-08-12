import React from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const TopTravelList = ({ travelData }) => {
    const navigate = useNavigate();

    return (
        <Row>
            {travelData.slice(0, 4).map((item, index) => (
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
    );
};

export default TopTravelList;
