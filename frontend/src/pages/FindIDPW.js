import React, { useState } from 'react';
import { Button, Col, Container, Form, Row, Modal } from 'react-bootstrap';
import Swal from 'sweetalert2';
import axios from '../axios'; // axios 인스턴스가 설정된 경로
import '../css/FindIDPW.css';

const FindIDPW = () => {
    const [username, setUsername] = useState('');
    const [userphoneForId, setUserPhoneForId] = useState('');
    const [userphoneForPw, setUserPhoneForPw] = useState('');
    const [userid, setUserId] = useState('');
    const [findIdResult, setFindIdResult] = useState('');
    const [findPwResult, setFindPwResult] = useState('');
    const [modalShow, setModalShow] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleFindId = async (e) => {
        e.preventDefault();
        if (!username.trim() || !userphoneForId.trim()) {
            Swal.fire({
                icon: 'warning',
                text: '이름과 휴대전화 모두 입력해주세요.',
                confirmButtonText: '확인',
            });
            return;
        }

        try {
            const response = await axios.post('/findId', {
                mem_name: username,
                mem_phone: userphoneForId,
            });
            setFindIdResult(`아이디 찾기 성공: ${response.data.mem_id}`);
        } catch (error) {
            console.error('Error:', error);
            setFindIdResult('이름 / 휴대전화 정보를 다시 확인하여 입력해주세요.');
        }
    };

    const handleFindPw = async (e) => {
        e.preventDefault();
        if (!userid.trim() || !userphoneForPw.trim()) {
            Swal.fire({
                icon: 'warning',
                text: '아이디와 휴대전화 모두 입력해주세요.',
                confirmButtonText: '확인',
            });
            return;
        }

        try {
            const response = await axios.post('/findPw', {
                mem_id: userid,
                mem_phone: userphoneForPw,
            });
            setModalShow(true);
            console.log('비밀번호 찾기 응답:', response.data);
        } catch (error) {
            console.error('Error:', error);
            Swal.fire({
                icon: 'error',
                text: '아이디 / 휴대전화 정보를 다시 확인하여 입력해주세요.',
                confirmButtonText: '확인',
            });
        }
    };

    const handlePasswordReset = async () => {
        if (newPassword !== confirmPassword) {
            Swal.fire({
                icon: 'warning',
                text: '비밀번호가 일치하지 않습니다.',
                confirmButtonText: '확인',
            });
            return;
        }

        try {
            const response = await axios.post('/changePw', {
                mem_id: userid,
                mem_phone: userphoneForPw,
                new_password: newPassword,
            });

            if (response.status === 200) {
                Swal.fire({
                    title: '비밀번호 변경 성공',
                    text: '비밀번호가 성공적으로 변경되었습니다.',
                    icon: 'success',
                    confirmButtonText: '확인',
                });
                setModalShow(false);
            } else {
                Swal.fire({
                    icon: 'error',
                    text: '비밀번호 변경에 실패했습니다.',
                    confirmButtonText: '확인',
                });
            }
        } catch (error) {
            console.error('Error:', error);
            Swal.fire({
                icon: 'error',
                text: '비밀번호 변경에 실패했습니다.',
                confirmButtonText: '확인',
            });
        }
    };

    return (
        <div className="find-id-pw mt-4 pt-5">
            <Container className="my-custom-content py-5">
                <Row className="justify-content-center">
                    <Col lg={6} md={8} sm={10} xs={12} className="text-center">
                        <img src="/img/wdp_log2.png" alt="Read Fit 로고" className="login-logo mb-1" />
                        <Form onSubmit={handleFindId} className="mb-5 p-4 bg-white rounded shadow">
                            <h2 className="mb-3">아이디 찾기</h2>
                            <Form.Control type="text" placeholder="이름" className="input-field mb-2" value={username} onChange={(e) => setUsername(e.target.value)} />
                            <Form.Control type="text" placeholder="휴대전화" className="input-field mb-3" value={userphoneForId} onChange={(e) => setUserPhoneForId(e.target.value)} />
                            <Button className="w-100" variant="success" type="submit">
                                아이디 찾기
                            </Button>
                            {findIdResult && <div>{findIdResult}</div>}
                        </Form>
                        <Form onSubmit={handleFindPw} className="p-4 bg-white rounded shadow">
                            <h2 className="mb-3">비밀번호 찾기</h2>
                            <Form.Control type="text" placeholder="아이디" className="input-field mb-2" value={userid} onChange={(e) => setUserId(e.target.value)} />
                            <Form.Control type="text" placeholder="휴대전화" className="input-field mb-3" value={userphoneForPw} onChange={(e) => setUserPhoneForPw(e.target.value)} />
                            <Button className="w-100" variant="success" type="submit">
                                비밀번호 찾기
                            </Button>
                            {findPwResult && <div>{findPwResult}</div>}
                        </Form>
                    </Col>
                </Row>
            </Container>

            {/* 비밀번호 변경 모달 */}
            <Modal show={modalShow} onHide={() => setModalShow(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>비밀번호 변경</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formNewPassword">
                            <Form.Label>새 비밀번호</Form.Label>
                            <Form.Control type="password" placeholder="새 비밀번호" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                        </Form.Group>
                        <Form.Group controlId="formConfirmPassword">
                            <Form.Label>비밀번호 확인</Form.Label>
                            <Form.Control type="password" placeholder="비밀번호 확인" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                        </Form.Group>
                        <Button variant="primary" onClick={handlePasswordReset} className="mt-3">
                            비밀번호 변경
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default FindIDPW;
