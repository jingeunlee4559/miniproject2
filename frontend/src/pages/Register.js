import { faCalendar, faCommentDots, faEnvelope, faLock, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from '../axios';
import React, { useState } from 'react';
import { Button, Col, Container, Form, InputGroup, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import '../css/Login.css';
import Swal from 'sweetalert2';

function Register() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        mem_id: '',
        mem_pw: '',
        confirm_pw: '',
        mem_name: '',
        mem_birth: '',
        mem_phone: '',
        mem_email: '',
    });

    const [isIdValid, setIsIdValid] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleInputChange = async (e) => {
        const { name, value } = e.target;

        if (name === 'mem_phone') {
            setFormData({ ...formData, mem_phone: formatPhoneNumber(value) });
        } else {
            setFormData({ ...formData, [name]: value });
        }

        if (name === 'mem_id') {
            const validId = validateId(value);
            setIsIdValid(validId);
            if (validId) {
                const response = await axios.get(`/api/register/checkId?mem_id=${value}`);
                setIsIdValid(response.data);
                setErrorMessage(response.data ? '사용 가능한 아이디입니다.' : '이미 사용중인 아이디입니다.');
            } else {
                setErrorMessage('아이디는 영문과 숫자만 포함하며, 최소 8자 이상이어야 합니다.');
            }
        }

        // if (name === "confirm_pw") {
        //   const matching = isPasswordMatching(formData.mem_pw, value);
        //   setErrorMessage(matching ? "" : "비밀번호가 일치하지 않습니다.");
        // }
    };

    function validateId(id) {
        const re = /^[A-Za-z0-9]{8,}$/;
        return re.test(id);
    }

    function isPasswordMatching(password, confirmPassword) {
        return password === confirmPassword;
    }

    const handleBlur = (e) => {
        const { name, value } = e.target;
        if (name === 'mem_id' && value.length < 8) {
            Swal.fire({
                icon: 'warning',
                text: '아이디는 8글자 이상이어야 합니다.',
                confirmButtonText: '확인',
            });
            setIsIdValid(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!isIdValid) {
            Swal.fire({
                icon: 'error',
                text: '아이디 중복 확인을 해주세요.',
                confirmButtonText: '확인',
            });
            return;
        }
        if (formData.mem_pw !== formData.confirm_pw) {
            Swal.fire({
                icon: 'error',
                text: '비밀번호가 일치하지 않습니다..',
                confirmButtonText: '확인',
            });
            return;
        }

        if (!formData.mem_pw || !formData.mem_pw.trim()) {
            Swal.fire({
                icon: 'error',
                text: '비밀번호를 입력해주세요',
                confirmButtonText: '확인',
            });
            return;
        }

        if (!formData.confirm_pw.trim()) {
            Swal.fire({
                icon: 'error',
                text: '비밀번호 확인을 입력해주세요',
                confirmButtonText: '확인',
            });
            return;
        }
        if (!formData.mem_email.trim()) {
            Swal.fire({
                icon: 'error',
                text: '이메일을 입력해주세요.',
                confirmButtonText: '확인',
            });
            return;
        }
        if (!formData.mem_phone.trim()) {
            Swal.fire({
                icon: 'error',
                text: '전화번호를 입력해주세요.',
                confirmButtonText: '확인',
            });
            return;
        }

        if (!formData.mem_name.trim()) {
            Swal.fire({
                icon: 'error',
                text: '닉네임을 입력해주세요.',
                confirmButtonText: '확인',
            });
            return;
        }

        const userData = {
            mem_id: formData.mem_id,
            mem_pw: formData.mem_pw,
            mem_name: formData.mem_name,
            mem_birth: formData.mem_birth,
            mem_phone: formData.mem_phone,
            mem_email: formData.mem_email,
        };

        try {
            await axios.post('/api/register', userData);
            Swal.fire({ icon: 'success', text: '회원가입이 완료되었습니다!', confirmButtonText: '로그인으로 이동' }).then(() => navigate('/login'));
        } catch (error) {
            Swal.fire({ icon: 'error', text: '회원가입에 실패했습니다.', confirmButtonText: '확인' });
        }
    };

    function formatPhoneNumber(phoneNumber) {
        const cleaned = phoneNumber.replace(/\D/g, '');
        if (cleaned.length < 4) return cleaned;
        const match = cleaned.match(/(\d{3})(\d{4})(\d{4})/);
        return match ? `${match[1]}-${match[2]}-${match[3]}` : phoneNumber;
    }

    return (
        <>
            <Row className="mt-5"></Row>
            <div className="register-pag my-5">
                <Container className="my-5">
                    <Row className="justify-content-md-center">
                        <Col md={6} className="login-form-container">
                            <div className="text-center mb-2">
                                <img src="/img/wdp_log2.png" alt="Read Fit 로고" className="login-logo" />
                            </div>
                            <h2 className="text-center mb-1">회원가입</h2>
                            <Form onSubmit={handleSubmit}>
                                <InputGroup className="mb-3">
                                    <InputGroup.Text>
                                        <FontAwesomeIcon icon={faUser} />
                                    </InputGroup.Text>
                                    <Form.Control type="text" placeholder="아이디" name="mem_id" value={formData.mem_id} onChange={handleInputChange} onBlur={handleBlur} />
                                </InputGroup>
                                <Form.Text className={isIdValid ? 'text-success' : 'text-danger'}>{errorMessage}</Form.Text>

                                <InputGroup className="mb-3">
                                    <InputGroup.Text>
                                        <FontAwesomeIcon icon={faLock} />
                                    </InputGroup.Text>
                                    <Form.Control type="password" placeholder="비밀번호" name="mem_pw" value={formData.mem_pw} onChange={handleInputChange} />
                                </InputGroup>

                                <InputGroup className="mb-3">
                                    <InputGroup.Text>
                                        <FontAwesomeIcon icon={faLock} />
                                    </InputGroup.Text>
                                    <Form.Control type="password" placeholder="비밀번호 확인" name="confirm_pw" value={formData.confirm_pw} onChange={handleInputChange} />
                                </InputGroup>
                                <Form.Text className={formData.mem_pw && formData.confirm_pw ? (isPasswordMatching(formData.mem_pw, formData.confirm_pw) ? 'text-success' : 'text-danger') : ''}>
                                    {formData.mem_pw && formData.confirm_pw ? (isPasswordMatching(formData.mem_pw, formData.confirm_pw) ? '비밀번호가 일치합니다.' : '비밀번호가 불일치합니다.') : ''}
                                </Form.Text>

                                <InputGroup className="mb-3">
                                    <InputGroup.Text>
                                        <FontAwesomeIcon icon={faEnvelope} />
                                    </InputGroup.Text>
                                    <Form.Control type="email" placeholder="이메일" name="mem_email" value={formData.mem_email} onChange={handleInputChange} />
                                </InputGroup>

                                <InputGroup className="mb-3">
                                    <InputGroup.Text>
                                        <FontAwesomeIcon icon={faCommentDots} />
                                    </InputGroup.Text>
                                    <Form.Control type="text" placeholder="이름" name="mem_name" value={formData.mem_name} onChange={handleInputChange} />
                                </InputGroup>
                                <InputGroup className="mb-3">
                                    <InputGroup.Text>
                                        <FontAwesomeIcon icon={faCalendar} />
                                    </InputGroup.Text>
                                    <Form.Control type="date" name="mem_birth" value={formData.mem_birth} onChange={handleInputChange} />
                                </InputGroup>

                                <InputGroup className="mb-3">
                                    <InputGroup.Text>
                                        <FontAwesomeIcon icon={faCommentDots} />
                                    </InputGroup.Text>
                                    <Form.Control type="text" placeholder="전화번호 (010-xxxx-xxxx)" name="mem_phone" value={formData.mem_phone} onChange={handleInputChange} maxLength="13" />
                                </InputGroup>

                                <Button variant="success" type="submit" className="login-button mb-3">
                                    회원가입
                                </Button>
                            </Form>
                        </Col>
                    </Row>
                </Container>
            </div>
        </>
    );
}

export default Register;
