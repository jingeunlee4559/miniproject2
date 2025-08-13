import React, { useState } from 'react';
import { ListGroup, Row, Col, Button } from 'react-bootstrap';
import '../css/Comment.css';

const CommentList = ({ comments }) => {
    const [showAll, setShowAll] = useState(false);

    // 댓글 표시 개수 제어
    const visibleComments = showAll ? comments : comments.slice(0, 3);

    if (comments.length === 0) {
        return (
            <div style={{ textAlign: 'center', padding: '30px 0', color: '#888' }}>
                💬 아직 댓글이 없습니다.
                <br />첫 댓글을 작성해 주세요!
            </div>
        );
    }

    return (
        <>
            <ListGroup variant="flush" className="comment-list">
                {visibleComments.map((comment, index) => (
                    <ListGroup.Item key={index} className="comment-item">
                        <Row className="align-items-center">
                            <Col xs="auto" className="comment-author">
                                {comment.name}
                            </Col>
                            <Col className="comment-text">{comment.text}</Col>
                            <Col xs="auto" className="comment-date">
                                {comment.date}
                            </Col>
                        </Row>
                    </ListGroup.Item>
                ))}
            </ListGroup>

            {/* 댓글이 3개 초과일 경우에만 더보기 버튼 */}
            {comments.length > 3 && (
                <div className="text-center mt-3">
                    <Button size="sm" onClick={() => setShowAll(!showAll)} className="btnadd">
                        {showAll ? '댓글 접기 ▲' : '댓글 더보기 ▼'}
                    </Button>
                </div>
            )}
        </>
    );
};

export default CommentList;
