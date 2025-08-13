// PersonalizedTravelList.js
import React, { useState } from 'react';
import { Row, Col, Card, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const AGE_OPTIONS = ['전체', '10대', '20대', '30대', '40대', '50대 이상'];
const GENDER_OPTIONS = ['전체', '남성', '여성'];

const PersonalizedTravelList = ({ travelData }) => {
    const navigate = useNavigate();

    // 선택 상태 관리
    const [age, setAge] = useState('전체');
    const [gender, setGender] = useState('전체');

    // 실제 데이터에는 age, gender 속성이 추가되어 있다고 가정
    // 아래는 예시 필터링 로직 (travelData.all에 전체 데이터 있다고 가정)
    const filteredList = (travelData.all || []).filter((item) => (age === '전체' || item.age === age) && (gender === '전체' || item.gender === gender));

    return (
        <>
            <Row className="text-center mb-3 pt-5">
                <h2 className="fw-bold">당신에게 맞춘 여행지</h2>
                <p className="text-muted">데이터로 찾은, 당신이 사랑할만한 여행지.</p>
            </Row>
            <Row className="justify-content-center mb-4">
                <Col md="auto">
                    <Form.Select value={age} onChange={(e) => setAge(e.target.value)} style={{ display: 'inline-block', width: 120, marginRight: 10 }} aria-label="연령 선택">
                        {AGE_OPTIONS.map((opt) => (
                            <option key={opt}>{opt}</option>
                        ))}
                    </Form.Select>
                    <Form.Select value={gender} onChange={(e) => setGender(e.target.value)} style={{ display: 'inline-block', width: 120 }} aria-label="성별 선택">
                        {GENDER_OPTIONS.map((opt) => (
                            <option key={opt}>{opt}</option>
                        ))}
                    </Form.Select>
                </Col>
            </Row>
            <Row>
                {filteredList.length > 0 ? (
                    filteredList.slice(0, 4).map((item, index) => (
                        <Col key={index} xs={12} sm={6} md={3} className="mb-4">
                            <Card className="shadow-sm h-100 ai-card" onClick={() => navigate(`/Category/${item.store_idx}`)} style={{ cursor: 'pointer' }}>
                                <Card.Img variant="top" src={item.img} alt={item.title} style={{ height: '200px', objectFit: 'cover' }} />
                                <Card.Body>
                                    <Card.Title className="fw-bold">{item.title}</Card.Title>
                                    <Card.Text className="text-muted">{item.location}</Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))
                ) : (
                    <Col className="text-center text-muted py-5">해당 조건의 여행지가 없습니다.</Col>
                )}
            </Row>
        </>
    );
};

export default PersonalizedTravelList;
