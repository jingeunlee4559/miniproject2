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
    const [comments, setComments] = useState([]);

    const addComment = async (text) => {
        try {
            const newComment = {
                board_seq: board_seq,
                comment_content: text,
            }
            const response = await axios.post(`/api/boards/${board_seq}/comments`, newComment);
            setComments([response.data, ...comments]);
        } catch (error){
            console.error("댓글 등록 중 오류 발생:", error);
        }
    };

    useEffect(() => {
      const fetchBoardDetail = async () => {
        try {
          const response = await axios.get(`/api/board/${board_seq}`);
          setBoardDetail(response.data);
          setEditedTitle(response.data.board_title);
          setEditedContent(response.data.board_content);
          if (response.data.imageUrl) {
            setPreviewImage(`/images/${response.data.imageUrl}`);
          }
        } catch (error) {
          console.error("게시글 상세 정보를 가져오는 도중 오류 발생:", error);
        }
      };

      fetchBoardDetail();
    }, [board_seq]);

     // 2. 댓글 목록 조회를 위한 새로운 useEffect를 추가합니다.
     useEffect(() => {
         // 댓글 데이터를 가져오는 비동기 함수를 선언합니다.
         const fetchComments = async () => {
             try {
                 // board_seq를 이용해 해당 게시글의 댓글 목록을 요청합니다.
                 const response = await axios.get(`/api/boards/${board_seq}/comments`);
                 // 서버로부터 받은 댓글 목록 데이터로 state를 업데이트합니다.
                 setComments(response.data);
             } catch (error) {
                 console.error("댓글 목록을 가져오는 중 오류 발생:", error);
             }
         };
         
         fetchComments();
     }, [board_seq]); // 3. 의존성 배열에 board_seq를 넣습니다.

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
        const response = await axios.put(`/api/board/${board_seq}`, formData, {
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
          img: response.data.imageUrl || boardDetail.imageUrl
        });
        // 이미지가 변경된 경우, 미리보기 이미지를 업데이트
        if (response.data.imageUrl) {
          setPreviewImage(`/images/${response.data.imageUrl}?${new Date().getTime()}`);
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
                        {boardDetail?.editable && (
                            <Button onClick={handleEdit} variant='warning' className="btn me-2">
                                수정
                            </Button>
                        )}
                            {/* <Button variant="warning" className="btn me-2"></Button> */}
                        {boardDetail?.deletable && (
                            <Button onClick={deletepost} variant="danger" className="btn">
                                삭제
                            </Button>
                        )}
                            
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
                        {/* <Button variant="success" className="mt-3"> */}
                        <Button onClick={handleSave} variant="success" className="mt-3">
                            저장
                        </Button>
                    </div>
                ) : (
                    <>
                        <div className="detail-content">
                            {/* <h3 className="detail-title">{boardDetail?.title}</h3> */}
                            <h3 className="detail-title">{boardDetail?.board_title}</h3>
                            <p className="detail-info">
                                작성자: {boardDetail?.mem_id} | 날짜: {boardDetail?.created_at.substring(0, 10)} | 조회수: {boardDetail?.board_views}
                            </p>
                            <hr />
                            <p className="detail-text">{boardDetail?.board_content}</p>
                            {boardDetail?.imageUrl && <img src={previewImage} alt="Board Detail" style={{ maxWidth: '100%' }} />}
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
