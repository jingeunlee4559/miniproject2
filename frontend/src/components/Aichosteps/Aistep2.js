import React, { useCallback, useState, useContext } from 'react';
import { Col, Container, Row, Form, Button, Card } from 'react-bootstrap';
import '../../css/Aichost.css';
import { useNavigate } from 'react-router-dom';
import { Appdata } from '../../App';
import Swal from 'sweetalert2';

const Aistep2 = () => {
    const [q2Choice, setQ2Choice] = useState(''); // 여행지 | 코스
    const [q2SubChoice, setQ2SubChoice] = useState(''); // 코스 세부 선택

    const navigate = useNavigate();
    const navigateTo = useCallback((path) => navigate(path), [navigate]);

    const data = useContext(Appdata);

    function Back() {
        navigateTo(-1);
    }

    function Next() {
        if (q2Choice === '' || (q2Choice === 'course' && q2SubChoice === '')) {
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
            q2Choice: q2Choice,
            q2SubChoice: q2SubChoice,
        };
        console.log('Form Data to be sent:', result);

        data.setShare(result);
        navigateTo('/Aichoice/2/3');
    }

    return (
        <Container className="my-2">
            <Row className="justify-content-center">
                <Col md={6}>
                    <Card className="m-auto aichoice-card">
                        {/* Q2 */}
                        <Row>
                            <Col className="Qtitle">Q 02.</Col>
                        </Row>
                        <Row className="my-1">
                            <Col className="Qti2 text-center">어떤 추천을 원하시나요?</Col>
                        </Row>

                        {/* 여행지 / 코스 선택 */}
                        <Row className="my-2">
                            <Col md={11} sm={10} xs={10} className="m-auto">
                                <Form.Select value={q2Choice} onChange={(e) => setQ2Choice(e.target.value === 'true')}>
                                    <option value="">선택하세요</option>
                                    <option value="true">여행지 추천</option>
                                    <option value="false">코스 추천</option>
                                </Form.Select>
                            </Col>
                        </Row>

                        {/* 코스 세부 선택 (코스 선택 시만 보이도록) */}
                        {q2Choice === false && (
                            <Row className="my-2">
                                <Col md={11} sm={10} xs={10} className="m-auto">
                                    <Form.Select value={q2SubChoice} onChange={(e) => setQ2SubChoice(e.target.value)}>
                                        <option value="">세부 선택</option>
                                        <option value="course_travel">여행지만 가지고 코스</option>
                                        <option value="course_all">여행지 + 맛집 포함 코스</option>
                                    </Form.Select>
                                </Col>
                            </Row>
                        )}

                        {/* 버튼 */}
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
