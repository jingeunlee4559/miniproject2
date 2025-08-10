import React from 'react';
import { Container, Row, Col, ListGroup } from 'react-bootstrap';

const InfoSection = () => {
    const leftItems = [
        { label: '문의 및 안내', value: '0507-1427-0259' },
        { label: '주소', value: '광주광역시 동구 중산사길 177' },
        { label: '휴일', value: '연중무휴' },
        { label: '체험 프로그램', value: '템플스테이' },
        { label: '입장료', value: '무료' },
    ];

    const rightItems = [
        {
            label: '홈페이지',
            value: (
                <a href="https://jeungsimsa.org" target="_blank" rel="noopener noreferrer">
                    https://jeungsimsa.org
                </a>
            ),
        },
        { label: '이용시간', value: '04:30~17:00' },
        { label: '주차', value: '가능' },
        { label: '이용가능시설', value: '템플관 / 산책로 / 등산로 / 화장실 / 음수대 등' },
    ];

    return (
        <Container fluid className="my-4">
            <Row>
                <Col md={6}>
                    <ListGroup variant="flush">
                        {leftItems.map((item, idx) => (
                            <ListGroup.Item key={idx} className="d-flex justify-content-between">
                                <strong>{item.label}</strong>
                                <span>{item.value}</span>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                </Col>
                <Col md={6}>
                    <ListGroup variant="flush">
                        {rightItems.map((item, idx) => (
                            <ListGroup.Item key={idx} className="d-flex justify-content-between">
                                <strong>{item.label}</strong>
                                <span>{item.value}</span>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                </Col>
            </Row>
        </Container>
    );
};

export default InfoSection;
