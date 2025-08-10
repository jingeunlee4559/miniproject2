import React, { useEffect, useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import axios from '../axios';

function Boards() {
    const [msg, setMsg] = useState([]);

    useEffect(() => {
        axios
            .get('/api/all')
            .then((res) => setMsg(res.data))
            .catch((err) => console.error('Axios error:', err));
    }, []);
    console.log(msg);

    return (
        <Container>
            <Row>
                <Col>
                    <div>Board 페이지</div>
                </Col>
            </Row>
            <Row>
                <Col>
                    <ul>
                        {msg.map((member) => (
                            <li key={member.mem_id}>
                                이름: {member.mem_name} / 이메일: {member.mem_email}
                            </li>
                        ))}
                    </ul>
                </Col>
            </Row>
        </Container>
    );
}

export default Boards;
