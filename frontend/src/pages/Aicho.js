import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { Outlet } from 'react-router-dom';

const Aicho = () => {
    return (
        <>
            <Row className="mt-5 pt-4"></Row>
            <Container className="my-2">
                <Row>
                    <Col style={{ fontSize: '40px' }}>AI추천</Col>
                </Row>
                <Outlet />
            </Container>
        </>
    );
};

export default Aicho;
