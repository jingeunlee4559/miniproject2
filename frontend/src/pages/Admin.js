import axios from '../axios';
import React, { useCallback, useEffect, useState } from 'react';
import { Alert, Button, Col, Container, Pagination, Row, Table } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Paginated from '../components/Paginated';
import GenderChart from '../components/GenderChart';
import AgeChart from '../components/AgeChart';
import Swal from 'sweetalert2';
// import Navs from '../components/Nav';

const ITEMS_PER_PAGE = 6; // 한 페이지에 표시할 아이템 수 변경 (총 6개, 각 열에 3개씩)

const Admin = () => {
    const navigate = useNavigate();

    const [error, setError] = useState('');
    const [members, setMembers] = useState([]);
    const [currentMemberPage, setCurrentMemberPage] = useState(1);
    const [boards, setBoards] = useState([]);
    const [currentBoardPage, setCurrentBoardPage] = useState(1);

    const navigateToBoard = (boardSeq) => {
        navigate(`/board/${boardSeq}`);
    };

    // 각 게시글의 댓글 상태
    const [comments, setComments] = useState({});

    // 선택된 게시글의 댓글을 불러오는 함수
    
    const fetchComments = async (boardSeq) => {
        try {
            const response = await axios.get(`/api/boards/${boardSeq}/comments`);
            setComments({
                ...comments,
                [boardSeq]: response.data.comments,
            });
        } catch (error) {
            console.error('There was an error fetching the comments:', error);
            setError('댓글을 불러오는 중 오류가 발생했습니다.');
        }
    };
    

    const toggleComments = (boardSeq) => {
        if (comments[boardSeq]) {
            setComments({ ...comments, [boardSeq]: undefined });
        } else {
            fetchComments(boardSeq);
        }
    };

    const fetchMembers = useCallback(async () => {
        try {
            const response = await axios.get(`/api/members`);
            console.log(response.data);
            setMembers(response.data);
        } catch (error) {
            setError('회원 데이터를 불러오는 중 오류가 발생했습니다.');
        }
    }, []);
    
    const fetchBoards = useCallback(async () => {
        try {
            const response = await axios.get('/api/board/all');
            setBoards(response.data);
        } catch (error) {
            setError('게시글 데이터를 불러오는 중 오류가 발생했습니다.');
        }
    }, []);

    useEffect(() => {
        fetchMembers();
        fetchBoards();
    }, [fetchMembers, fetchBoards]);

    const suspendMember = async (memberId) => {
        try {
            await axios.put(`/api/members/${memberId}/suspend`);
            fetchMembers();
        } catch (error) {
            setError('회원 영구정지 실패');
        }
    };

    const unsuspendMember = async (memberId) => {
        try {
            await axios.put(`/api/members/${memberId}/unsuspend`);
            fetchMembers();
        } catch (error) {
            setError('회원 정지해제 실패');
        }
    };

    const deleteBoard = async (boardId) => {
        try {
            await axios.delete(`/api/deletePost/${boardId}`);
            fetchBoards();
        } catch (error) {
            setError('게시글 삭제 실패');
        }
    };

    return (
        <>
            <Container className="mt-4  pt-5">
                <Row className="mt-4">
                    <Col>
                        <h1>관리자 페이지</h1>
                    </Col>
                </Row>
                <Row className="mt-4 pt-5">
                    <Col>
                        <h2>데이터 차트</h2>
                    </Col>
                </Row>
                <Row className="mt-4">
                    <Col md={6}>
                        <h2>성별</h2>
                        <div className="card p-3" style={{ height: '500px', minHeight: '500px' }}>
                            <GenderChart />
                        </div>
                    </Col>
                    <Col md={6}>
                        <h2>나이</h2>
                        <div className="card p-3" style={{ height: '500px', minHeight: '500px' }}>
                            <AgeChart />
                        </div>
                    </Col>
                </Row>
                {error && <Alert variant="danger">{error}</Alert>}
                <Row className="mt-4 pt-5">
                    <Col>
                        <h2>회원 관리</h2>
                    </Col>
                </Row>
                <Paginated
                    data={members.slice((currentMemberPage - 1) * ITEMS_PER_PAGE, currentMemberPage * ITEMS_PER_PAGE).map((member) => ({
                        id: member.mem_id,
                        status: member.mem_role === 'ADMIN' ? '관리자' : '일반 회원',
                        mem_status: member.mem_status, // 'ACTIVE', 'SUSPENDED', 'WITHDRAWN'
                        displayStatus: member.mem_status === 'ACTIVE' ? '활성화' : member.mem_status === 'SUSPENDED' ? '정지' : member.mem_status === 'WITHDRAWN' ? '탈퇴' : '알 수 없음',
                    }))}
                    columns={[
                        { accessor: 'id', Header: 'ID' },
                        { accessor: 'status', Header: '역할' },
                        { accessor: 'displayStatus', Header: '상태' },
                        {
                            accessor: 'actions',
                            Header: '관리',
                            Cell: ({ row }) => {
                                const { id, mem_status } = row.original;

                                if (mem_status === 'WITHDRAWN') return null; // 탈퇴 회원은 관리 불가

                                if (mem_status === 'ACTIVE') {
                                    return (
                                        <Button size="sm" variant="danger" onClick={() => suspendMember(id)}>
                                            정지
                                        </Button>
                                    );
                                }

                                if (mem_status === 'SUSPENDED') {
                                    return (
                                        <Button size="sm" variant="success" onClick={() => unsuspendMember(id)}>
                                            해제
                                        </Button>
                                    );
                                }

                                return null;
                            },
                        },
                    ]}
                />

                <Row className="mt-4 pt-5">
                    <Col>
                        <h2>게시글 관리</h2>
                    </Col>
                </Row>
                <Row>
                    <Col xs={12}>
                        <Paginated
                            data={boards.slice((currentBoardPage - 1) * ITEMS_PER_PAGE, currentBoardPage * ITEMS_PER_PAGE).map((board, cnt) => ({
                                index: (currentBoardPage - 1) * ITEMS_PER_PAGE + cnt + 1, // 전체 순번
                                board_seq: board.board_seq,
                                id: board.writer || '관리자', // 작성자 없으면 기본값
                                board_title: board.board_title,
                            }))}
                            columns={[
                                { accessor: 'index', Header: '번호' },
                                {
                                    accessor: 'board_title',
                                    Header: '제목',
                                    width: '60%',
                                    Cell: ({ row }) => (
                                        <span style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }} onClick={() => navigateToBoard(row.original.board_seq)}>
                                            {row.values.board_title}
                                        </span>
                                    ),
                                },
                                { accessor: 'id', Header: '작성자' },
                                {
                                    accessor: 'actions',
                                    Header: '관리',
                                    Cell: ({ row }) => (
                                        <Button size="sm" variant="danger" onClick={() => deleteBoard(row.original.board_seq)}>
                                            삭제
                                        </Button>
                                    ),
                                },
                            ]}
                        />
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default Admin;
