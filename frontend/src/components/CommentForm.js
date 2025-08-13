import React, { useState } from 'react';
import { Form, Button, Card, FormControl } from 'react-bootstrap';
import '../css/Comment.css';

const CommentForm = ({ onSubmit }) => {
    const [commentText, setCommentText] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!commentText.trim()) return;
        onSubmit(commentText);
        setCommentText('');
    };

    return (
        <Card className="comment-form-card shadow-sm">
            <Card.Body>
                <Form className="my-3 d-flex" onSubmit={handleSubmit} style={{ width: '100%' }}>
                    <FormControl
                        as="textarea"
                        placeholder="댓글을 입력해주세요"
                        className="flex-grow-1 mr-2"
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        style={{ resize: 'none' }}
                    />
                    <Button type="submit" id="submitCommentButton">
                        등록
                    </Button>
                </Form>
            </Card.Body>
        </Card>
    );
};

export default CommentForm;
