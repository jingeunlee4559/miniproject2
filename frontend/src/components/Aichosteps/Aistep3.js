import React, { useCallback, useState, useContext } from 'react';
import { Col, Container, Row, Button, Card, Form } from 'react-bootstrap';
import '../../css/Aichost.css';
import { useNavigate } from 'react-router-dom';
import { Appdata } from '../../App';
import axios from '../../axios';
import Swal from 'sweetalert2';

const Aistep3 = () => {
    const [companion, setTravelType] = useState('');
    const [TravelConcept, setTravelStyle] = useState('');

    const navigate = useNavigate();
    const navigateTo = useCallback((path) => navigate(path), [navigate]);

    const data = useContext(Appdata);

    function Back() {
        navigateTo(-1);
    }

    const Next = async () => {
        const mem_id = window.sessionStorage.getItem('mem_id');

        // if (!mem_id) {
        //        console.log(formData, 'dsfdsfdsfds');
        //     Swal.fire({
        //         icon: 'warning',
        //         text: '로그인 후 이용해주세요',
        //         confirmButtonText: '확인',
        //     });
        //     return;
        // }

        if (companion === '' || TravelConcept === '') {
            Swal.fire({
                icon: 'warning',
                text: '모든 필드를 입력해주세요',
                confirmButtonText: '확인',
            });
            return;
        }

        const formData = new FormData();
        formData.append('destination', data.shareData.lref);
        formData.append('season', data.shareData.sref);
        formData.append('isRoute', data.shareData.q2Choice);
        formData.append('onlyLoc', data.shareData.q2SubChoice);
        formData.append('companion', companion);
        formData.append('TravelConcept', TravelConcept);
        console.log(formData, 'dsfdsfdsfds');

        let finalData = {
            destination: data.shareData.lref,
            season: data.shareData.sref,
            isRoute: data.shareData.q2Choice,
            onlyLoc: data.shareData.q2SubChoice,
            companion: companion,
            TravelConcept: TravelConcept,
        };

        data.setShare(finalData);
        navigateTo('/Aichoice/2/3/4');

        // try {
        //     console.log(formData, 'dsfdsfdsfds');
        //     const response = await axios.post('http://localhost:8500/upload', formData);

        //     if (response.status === 200) {
        //         let finalData = {
        //             destination: data.shareData.lref,
        //             season: data.shareData.sref,
        //             isRoute: data.shareData.dates,
        //             onlyLoc: data.shareData.moneys,
        //             companion: companion,
        //             TravelConcept: TravelConcept,
        //         };

        //         data.setShare(finalData);
        //         navigateTo('/Aichoice/2/3/4');
        //     } else {
        //         console.error('파일 업로드 실패');
        //     }
        // } catch (error) {
        //     console.error('파일 업로드 중 오류 발생:', error);
        // }
    };

    return (
        <Container className="my-2">
            <Row className="justify-content-center">
                <Col md={6}>
                    <Card className="m-auto aichoice-card">
                        <Row>
                            <Col className="Qtitle">Q 03.</Col>
                        </Row>

                        {/* 여행 유형 */}
                        <Row className="my-1">
                            <Col className="Qti2 text-center">누구와 함께 떠나는 여행인가요?</Col>
                        </Row>
                        <Row className="my-2">
                            <Col md={11} sm={10} xs={10} className="m-auto">
                                <Form.Select value={companion} onChange={(e) => setTravelType(e.target.value)}>
                                    <option value="">선택하세요</option>
                                    <option value="solo">혼자 여행</option>
                                    <option value="couple">커플 여행</option>
                                    <option value="male2">남 2인 여행</option>
                                    <option value="female2">여 2인 여행</option>
                                    <option value="family">가족 여행</option>
                                </Form.Select>
                            </Col>
                        </Row>

                        {/* 여행 스타일 */}
                        <Row className="my-3">
                            <Col>
                                <Row className="my-2">
                                    <Col className="Qtit3 text-center">어떤 스타일의 여행을 원하시나요?</Col>
                                </Row>
                                <Row>
                                    <Col md={11} sm={10} xs={10} className="m-auto">
                                        <Form.Select value={TravelConcept} onChange={(e) => setTravelStyle(e.target.value)}>
                                            <option value="">선택하세요</option>
                                            <option value="healing">힐링과 휴식</option>
                                            <option value="mood">분위기 있는</option>
                                            <option value="activity">액티비티 중심</option>
                                        </Form.Select>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>

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

export default Aistep3;
