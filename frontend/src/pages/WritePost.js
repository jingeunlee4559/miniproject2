import React, { useState, useRef } from 'react';
import { Button, Col, Container, Row } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import axios from '../axios';
import '../css/WritePost.css';
import { useNavigate } from 'react-router-dom';

const WritePost = () => {
    const [groomUploaded, setGroomUploaded] = useState(false);
    const [boardImg, setBoardImg] = useState(null);
    const navigate = useNavigate();
    const bTitle = useRef();
    const bContent = useRef();
    const bImg = useRef();

    // sessionStorage에서 mem_id 가져오기
    const mem_id = window.sessionStorage.getItem('mem_id');

    const handleGroomUpload = (event) => {
        setGroomUploaded(true);
        setBoardImg(event.target.files[0]); // Update state with the selected file
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const formData = new FormData();
        formData.append('board_title', bTitle.current.value);
        formData.append('board_content', bContent.current.value);
        formData.append('mem_id', mem_id); // mem_id 추가
        if (boardImg) {
            formData.append('board_img', boardImg);
        }

        try {
            const response = await axios.post('/api/board/create', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log('Response:', response.data);
            navigate('/Board'); // 페이지 이동
        } catch (error) {
            console.error('Error uploading file:', error);
        }
    };

    return (
        <>
            <Row className="mt-5"></Row>
            <Container className="my-5">
                <Row>
                    <Col style={{ fontSize: '25px', fontWeight: 'bold' }}>게시판 작성</Col>
                </Row>
                <Row>
                    <Col className="t2">제목</Col>
                </Row>
                <Row className="mt-3">
                    <Col>
                        <Form.Control type="text" placeholder="제목" ref={bTitle} />
                    </Col>
                </Row>

                <Row className="mt-3">
                    <Col className="t2">내용</Col>
                </Row>
                <Row className="mt-3">
                    <Col>
                        <Form.Control as="textarea" placeholder="내용" ref={bContent} style={{ height: '500px' }} />
                    </Col>
                </Row>
                <Row>
                    <Col className="t2">첨부파일</Col>
                </Row>
                <Row className="my-5">
                    <Col className="m-auto text-center">
                        <div className={`image-upload-boxs ${groomUploaded ? 'uploaded' : ''}`}>
                            <label htmlFor="groom-upload" className="custom-file-uploads">
                                {groomUploaded ? '이미지가 업로드 되었습니다' : '이미지를 올려주세요'}
                            </label>
                            <input id="groom-upload" type="file" ref={bImg} onChange={handleGroomUpload} />
                        </div>
                    </Col>
                </Row>

                <Row>
                    <Col className="my-5">
                        <Button className="me-4" style={{ backgroundColor: '#7fa0ec', color: 'black', border: '#7fa0ec' }}>
                            취소
                        </Button>
                        <Button className="me-4" style={{ backgroundColor: '#7fa0ec', color: 'black', border: '#7fa0ec' }} onClick={handleSubmit}>
                            작성
                        </Button>
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default WritePost;
