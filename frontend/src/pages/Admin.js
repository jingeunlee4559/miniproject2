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
    /*
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
    */
    const fetchComments = (boardSeq) => {
        // 하드코딩 댓글 데이터
        const hardcodedComments = [
            { id: 1, text: '첫 번째 댓글' },
            { id: 2, text: '두 번째 댓글' },
        ];
        setComments({
            ...comments,
            [boardSeq]: hardcodedComments,
        });
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
    // const fetchMembers = useCallback(() => {
    //     // 하드코딩된 회원 데이터
    //     const hardcodedMembers = [
    //         { mem_id: 'admin', mem_role: 0 },
    //         { mem_id: 'user1', mem_role: 1 },
    //         { mem_id: 'user2', mem_role: 1 },
    //         { mem_id: 'bannedUser', mem_role: 2 },
    //         { mem_id: 'user3', mem_role: 1 },
    //         { mem_id: 'user4', mem_role: 1 },
    //         { mem_id: 'user5', mem_role: 1 },
    //         { mem_id: 'user6', mem_role: 1 },
    //     ];
    //     setMembers(hardcodedMembers);
    // }, []);

    // const fetchBoards = useCallback(async () => {
    //     try {
    //         const response = await axios.get('/api/boards');
    //         setBoards(response.data.boardList);
    //     } catch (error) {
    //         setError('게시글 데이터를 불러오는 중 오류가 발생했습니다.');
    //     }
    // }, []);
    const fetchBoards = useCallback(() => {
        // 하드코딩된 게시글 데이터
        const hardcodedBoards = [
            { board_seq: 1, board_title: '첫 번째 게시글' },
            { board_seq: 2, board_title: '두 번째 게시글' },
            { board_seq: 3, board_title: '세 번째 게시글' },
            { board_seq: 4, board_title: '네 번째 게시글' },
            { board_seq: 5, board_title: '다섯 번째 게시글' },
            { board_seq: 6, board_title: '여섯 번째 게시글' },
            { board_seq: 7, board_title: '일곱 번째 게시글' },
        ];
        setBoards(hardcodedBoards);
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
    // const suspendMember = (memberId) => {
    //     Swal.fire({
    //         icon: 'warning',
    //         showCancelButton: true,
    //         text: `${memberId} 정지하겠습니까?`,
    //         confirmButtonText: '확인',
    //         cancelButtonText: '취소',
    //     });
    // };

    const unsuspendMember = async (memberId) => {
        try {
            await axios.put(`/api/members/${memberId}/unsuspend`);
            fetchMembers();
        } catch (error) {
            setError('회원 정지해제 실패');
        }
    };
    // const unsuspendMember = (memberId) => {
    //     Swal.fire({
    //         icon: 'warning',
    //         showCancelButton: true,
    //         text: `${memberId} 정지 해제 (하드코딩 모드)`,
    //         confirmButtonText: '확인',
    //         cancelButtonText: '취소',
    //     });
    // };

    // const deleteBoard = async (boardId) => {
    //     try {
    //         await axios.delete(`/api/deletePost/${boardId}`);
    //         fetchBoards();
    //     } catch (error) {
    //         setError('게시글 삭제 실패');
    //     }
    // };
    const deleteBoard = (boardId) => {
        Swal.fire({
            icon: 'warning',
            showCancelButton: true,
            text: `게시글 ${boardId} 정말 삭제하시겠습니까?)`,
            confirmButtonText: '확인',
            cancelButtonText: '취소',
        });
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
                        status: member.mem_role === 'ADMIN' ? '관리자' : member.mem_role === 'USER' ? '일반 회원' : '정지 회원',
                        mem_status: member.mem_status, // 버튼 조건 확인용
                    }))}
                    columns={[
                        { accessor: 'id', Header: 'ID' },
                        { accessor: 'status', Header: '상태' },
                        {
                            accessor: 'actions',
                            Header: '관리',
                            Cell: ({ row }) => {
                                const { id, mem_status } = row.original;

                                if (mem_status === 0) return null;

                                // 일반 회원 (1) -> 정지 버튼
                                if (mem_status === 'ACTIVE') {
                                    return (
                                        <Button size="sm" variant="danger" onClick={() => suspendMember(id)}>
                                            정지
                                        </Button>
                                    );
                                }

                                // 정지 회원  → 해제 버튼
                                if (mem_status !== 'ACTIVE') {
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
