import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { Outlet } from 'react-router-dom';

const Aicho = () => {
    return (
        <>
            <Row className="mt-5 pt-4"></Row>
            <Container
                className="my-2 d-flex flex-column align-items-center justify-content-center"
                style={{ minHeight: '70vh' }} // 화면 높이 70% 정도 확보
            >
                <Row>
                    <Col style={{ fontSize: '40px', textAlign: 'center' }}>AI추천</Col>
                </Row>
                <Row className="w-100">
                    <Col className="d-flex justify-content-center align-items-center">
                        <Outlet />
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default Aicho;
