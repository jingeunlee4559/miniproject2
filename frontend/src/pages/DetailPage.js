import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../axios';
import '../css/DetailPage.css'; // CSS 파일에서 스타일을 정의합니다.
import { Row, Button, Form, Col, Container } from 'react-bootstrap';
import Swal from 'sweetalert2';
import CommentForm from '../components/CommentForm';
import CommentList from '../components/CommentList';

const DetailPage = () => {
    const { board_seq } = useParams();
    const [boardDetail, setBoardDetail] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editedTitle, setEditedTitle] = useState('');
    const [editedContent, setEditedContent] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewImage, setPreviewImage] = useState('');
    const navigate = useNavigate();
    const seq = window.sessionStorage.getItem('mem_seq');
    const [comments, setComments] = useState([
        {
            name: '여행러버',
            text: '정말 힐링되는 여행지였어요 🌿',
            date: '2025-08-13',
            avatar: '/img/user1.png',
        },
        {
            name: '맛집탐험가',
            text: '근처 맛집 추천 부탁드려요 😋',
            date: '2025-08-12',
            avatar: '/img/user2.png',
        },
    ]);

    const addComment = (text) => {
        const newComment = {
            name: '익명',
            text,
            date: new Date().toISOString().split('T')[0],
            avatar: '/img/default-avatar.png',
        };
        setComments([newComment, ...comments]);
    };

    const mockData = [
        {
            board_seq: 1,
            board_title: '제주도 3박 4일 여행 코스 추천',
            board_at: '2025-08-01T12:00:00',
            board_views: 320,
            writer: '여행러버',
            content:
                '제주도 여행 3박 4일 추천 코스는...제주도 여행 3박 4일 추천 코스는...제주도 여행 3박 4일 추천 코스는...제주도 여행 3박 4일 추천 코스는...제주도 여행 3박 4일 추천 코스는...제주도 여행 3박 4일 추천 코스는...제주도 여행 3박 4일 추천 코스는...제주도 여행 3박 4일 추천 코스는...제주도 여행 3박 4일 추천 코스는...제주도 여행 3박 4일 추천 코스는...제주도 여행 3박 4일 추천 코스는...제주도 여행 3박 4일 추천 코스는...제주도 여행 3박 4일 추천 코스는...제주도 여행 3박 4일 추천 코스는...제주도 여행 3박 4일 추천 코스는...제주도 여행 3박 4일 추천 코스는...제주도 여행 3박 4일 추천 코스는...제주도 여행 3박 4일 추천 코스는...제주도 여행 3박 4일 추천 코스는...제주도 여행 3박 4일 추천 코스는...',
        },
        { board_seq: 2, board_title: '부산 여행 꿀팁 총정리', board_at: '2025-08-02T09:30:00', board_views: 280, writer: '부산토박이', content: '부산에서 꼭 가봐야 할 곳은...' },
        { board_seq: 3, board_title: '강릉 바다뷰 카페 BEST 5', board_at: '2025-08-03T14:20:00', board_views: 210, writer: '카페헌터', content: '강릉 바다뷰 카페 추천 리스트...' },
        { board_seq: 4, board_title: '서울 근교 당일치기 여행지 추천', board_at: '2025-08-04T10:15:00', board_views: 350, writer: '나들이왕', content: '서울 근교에서 당일치기로 가볼 만한 곳은...' },
        { board_seq: 5, board_title: '전주 한옥마을 맛집 리스트', board_at: '2025-08-05T16:45:00', board_views: 295, writer: '맛집러', content: '전주 한옥마을에서 꼭 가야 하는 맛집은...' },
        { board_seq: 6, board_title: '속초 여행 가볼 만한 곳', board_at: '2025-08-06T18:00:00', board_views: 330, writer: '속초마니아', content: '속초 여행에서 빼놓을 수 없는 명소...' },
        { board_seq: 7, board_title: '경주 역사 여행 코스', board_at: '2025-08-07T13:40:00', board_views: 190, writer: '역사탐방', content: '경주에서 역사 여행을 즐기려면...' },
        { board_seq: 8, board_title: '여수 밤바다 여행 후기', board_at: '2025-08-08T15:50:00', board_views: 260, writer: '야경러버', content: '여수 밤바다 여행은 정말 낭만적입니다...' },
        { board_seq: 9, board_title: '제천 힐링 여행 코스 추천', board_at: '2025-08-09T09:10:00', board_views: 180, writer: '힐링러버', content: '제천에서 힐링할 수 있는 여행 코스는...' },
        {
            board_seq: 10,
            board_title: '울릉도, 독도 여행 준비 팁',
            board_at: '2025-08-10T20:20:00',
            board_views: 220,
            writer: '바다탐험가',
            content: '울릉도, 독도 여행 전 반드시 준비해야 할 것들...',
        },
    ];

    //const boardDetail = mockData.find((item) => item.board_seq === parseInt(board_seq));

    useEffect(() => {
      const fetchBoardDetail = async () => {
        try {
          const response = await axios.get(`/api/board/${board_seq}`);
          setBoardDetail(response.data);
          setEditedTitle(response.data.title);
          setEditedContent(response.data.content);
          if (response.data.img) {
            setPreviewImage(`http://localhost:8300${response.data.img}`);
          }
        } catch (error) {
          console.error("게시글 상세 정보를 가져오는 도중 오류 발생:", error);
        }
      };

      fetchBoardDetail();
    }, [board_seq]);

    const handleEdit = () => {
      setIsEditing(true);
    };

    const handleSave = async () => {
      const formData = new FormData();
      formData.append("board_title", editedTitle);
      formData.append("board_content", editedContent);
      if (selectedFile) {
        formData.append("board_img", selectedFile);
      }

      try {
        const response = await axios.put(`/board/update/${board_seq}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        setIsEditing(false);
        // 업데이트된 데이터를 상태에 반영
        setBoardDetail({
          ...boardDetail,
          title: editedTitle,
          content: editedContent,
          img: response.data.img || boardDetail.img
        });
        // 이미지가 변경된 경우, 미리보기 이미지를 업데이트
        if (response.data.img) {
          setPreviewImage(`http://localhost:8300${response.data.img}?${new Date().getTime()}`);
        }
        Swal.fire({
          icon: 'success',
          text: '수정 성공!',
          confirmButtonText: '확인'
        });
      } catch (error) {
        console.error("게시글 수정 도중 오류 발생:", error);
        Swal.fire({
          icon: 'error',
          text: '수정 도중 오류가 발생했습니다.',
          confirmButtonText: '확인'
        });
      }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const triggerFileInput = () => {
        document.getElementById('imageInput').click();
    };

    const handleRemoveImage = () => {
        setPreviewImage('');
        setSelectedFile(null);
    };

    function deletepost() {
        Swal.fire({
            icon: 'question',
            text: '정말 삭제하시겠습니까?',
            showCancelButton: true,
            confirmButtonText: '확인',
            cancelButtonText: '취소',
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axios.delete(`/api/board/${board_seq}`);
                    Swal.fire({
                        icon: 'success',
                        text: '삭제 성공!',
                        confirmButtonText: '확인',
                    }).then(() => {
                        navigate('/Board');
                    });
                } catch (error) {
                    console.error('게시글 삭제 도중 오류 발생:', error);
                    Swal.fire({
                        icon: 'error',
                        text: '삭제 도중 오류가 발생했습니다.',
                        confirmButtonText: '확인',
                    });
                }
            }
        });
    }

    return (
        <>
            <Row className="mt-5 pt-5"></Row>
            <Container className="detail-container pt-5 mt-5">
                {!isEditing && (
                    <Row className="button-group">
                        <Col>
                            <Button onClick={handleEdit} variant='warning' className="btn me-2">수정</Button>
                            {/* <Button variant="warning" className="btn me-2"></Button> */}
                            <Button onClick={deletepost} variant="danger" className="btn">
                                삭제
                            </Button>
                        </Col>
                    </Row>
                )}
                {isEditing ? (
                    <div className="detail-content">
                        <Form.Group controlId="formTitle" className="title">
                            <Form.Label>제목</Form.Label>
                            <Form.Control type="text" value={editedTitle} onChange={(e) => setEditedTitle(e.target.value)} placeholder="제목을 입력하세요" />
                        </Form.Group>
                        <Form.Group controlId="formContent" className="content">
                            <Form.Label>내용</Form.Label>
                            <Form.Control as="textarea" rows={10} value={editedContent} onChange={(e) => setEditedContent(e.target.value)} placeholder="내용을 입력하세요" />
                        </Form.Group>
                        <Form.Group controlId="formFile" className="file">
                            <Form.Label>이미지 파일</Form.Label>
                            <Button variant="primary" onClick={triggerFileInput} className="custom-select-button">
                                이미지 선택
                            </Button>
                            <input id="imageInput" type="file" className="hidden-file-input" style={{ display: 'none' }} onChange={handleFileChange} />
                            {previewImage && (
                                <div className="image-preview">
                                    <img src={previewImage} alt="미리보기" style={{ maxWidth: '100%', marginTop: '10px' }} />
                                    <Button variant="danger" onClick={handleRemoveImage} style={{ marginTop: '10px' }}>
                                        이미지 제거
                                    </Button>
                                </div>
                            )}
                        </Form.Group>
                        {/* <Button onClick={handleSave} variant="success" className="mt-3"> */}
                        <Button variant="success" className="mt-3">
                            저장
                        </Button>
                    </div>
                ) : (
                    <>
                        <div className="detail-content">
                            <h3 className="detail-title">{boardDetail?.title}</h3>
                            <h3 className="detail-title">{boardDetail?.board_title}</h3>
                            <p className="detail-info">
                                작성자: {boardDetail?.mem_id} | 날짜: {boardDetail?.board_at.substring(0, 10)} | 조회수: {boardDetail?.board_views}
                            </p>
                            <hr />
                            <p className="detail-text">{boardDetail?.board_content}</p>
                            {boardDetail?.img && <img src={previewImage} alt="Board Detail" style={{ maxWidth: '100%' }} />}
                        </div>
                        <Row className="t2 mb-4 pt-5" id="detail">
                            <Col xs="auto">
                                댓글 <span style={{ color: '#6DD2FF' }}>({comments.length}개)</span>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <CommentForm onSubmit={addComment} />
                            </Col>
                        </Row>
                        <Row>
                            <CommentList comments={comments} />
                        </Row>
                    </>
                )}
            </Container>
        </>
    );
};

export default DetailPage;
