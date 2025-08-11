import React, { useCallback, useState, useContext } from 'react';
import { Col, Container, Row, Form, Button, Card } from 'react-bootstrap';
import '../../css/Aichost.css';
import { useNavigate } from 'react-router-dom';
import { Appdata } from '../../App';
import Swal from 'sweetalert2';

const Aistep2 = () => {
    const [dates, setDates] = useState('');
    const [moneys, setMoneys] = useState('');

    const navigate = useNavigate();
    const navigateTo = useCallback((path) => navigate(path), [navigate]);

    const data = useContext(Appdata);

    console.log(data.shareData.lref);

    const handleDateChange = (e) => {
        setDates(e.target.value);
    };

    const handleMoneyChange = (e) => {
        setMoneys(e.target.value);
    };

    function Back() {
        navigateTo(-1);
    }

    console.log(dates);
    console.log(moneys);

    function Next() {
        if (dates === '' || moneys === '') {
            Swal.fire({
                icon: 'warning',
                text: '모든 필드를 선택해주세요',
                confirmButtonText: '확인',
            });
            return;
        }

        let result = {
            lref: data.shareData.lref,
            sref: data.shareData.sref,
            dates: dates,
            moneys: moneys,
        };
        console.log('Form Data to be sent:', result); // 데이터를 전송하기 전에 출력

        data.setShare(result);
        navigateTo('/Aichoice/2/3');
    }

    return (
        <Container className="my-2">
            <Row className="justify-content-center">
                <Col md={6}>
                    <Card className="m-auto aichoice-card">
                        <Row>
                            <Col className="Qtitle">Q 02.</Col>
                        </Row>
                        <Row className="my-1">
                            <Col className="Qti2 text-center">여행을 원하는 희망날짜와 시간을 선택 해주세요</Col>
                        </Row>
                        <Row className="my-2">
                            <Col className="Qtit3 text-center">날짜를 선택 해주세요</Col>
                        </Row>

                        <Row>
                            <Col md={11} sm={10} xs={10} className="m-auto">
                                <Form.Control type="date" className="my-2" value={dates} onChange={handleDateChange} />
                            </Col>
                        </Row>

                        <Row className="my-2">
                            <Col className="Qtit3 text-center">예상 금액을 선택 해주세요</Col>
                        </Row>

                        <Row>
                            <Col md={11} sm={10} xs={10} className="m-auto">
                                <Form.Select value={moneys} onChange={handleMoneyChange}>
                                    <option value="">선택하세요</option>
                                    <option value="10만원 이하">10만원 이하</option>
                                    <option value="10만원 ~ 30만원">10만원 ~ 30만원</option>
                                    <option value="30만원 ~ 50만원">30만원 ~ 50만원</option>
                                    <option value="50만원 이상">50만원 이상</option>
                                </Form.Select>
                            </Col>
                        </Row>

                        <Row>
                            <Col className="mt-3 text-center">
                                <Button onClick={Back} className="me-2 btnsfail">
                                    취소
                                </Button>
                                <Button onClick={Next} className="btns">
                                    다음
                                </Button>
                            </Col>
                        </Row>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default Aistep2;
