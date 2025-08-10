import { Container, Row, Col, Button } from 'react-bootstrap';
import Paginated from '../components/Paginated';
import axios from '../axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

function Board() {
    const [datass, setData] = useState([]);
    const navigate = useNavigate();

    let mem_id = window.sessionStorage.getItem('mem_id');
    let seq = window.sessionStorage.getItem('mem_seq');

    // useEffect(() => {
    //     axios.get("/board")
    //         .then((res) => {
    //             console.log("게시판 데이터", res.data.board);
    //             setData(res.data.board);
    //         })
    //         .catch(() => {
    //             console.log("데이터 가져오기 실패");
    //         });
    // }, []);

    useEffect(() => {
        // ✅ 여행 관련 하드코딩 데이터 (작성자 다르게 설정)
        const mockData = [
            { board_seq: 1, board_title: '제주도 3박 4일 여행 코스 추천', board_at: '2025-08-01T12:00:00', board_views: 320, writer: '여행러버' },
            { board_seq: 2, board_title: '부산 여행 꿀팁 총정리', board_at: '2025-08-02T09:30:00', board_views: 280, writer: '부산토박이' },
            { board_seq: 3, board_title: '강릉 바다뷰 카페 BEST 5', board_at: '2025-08-03T14:20:00', board_views: 210, writer: '카페헌터' },
            { board_seq: 4, board_title: '서울 근교 당일치기 여행지 추천', board_at: '2025-08-04T10:15:00', board_views: 350, writer: '나들이왕' },
            { board_seq: 5, board_title: '전주 한옥마을 맛집 리스트', board_at: '2025-08-05T16:45:00', board_views: 295, writer: '맛집러' },
            { board_seq: 6, board_title: '속초 여행 가볼 만한 곳', board_at: '2025-08-06T18:00:00', board_views: 330, writer: '속초마니아' },
            { board_seq: 7, board_title: '경주 역사 여행 코스', board_at: '2025-08-07T13:40:00', board_views: 190, writer: '역사탐방' },
            { board_seq: 8, board_title: '여수 밤바다 여행 후기', board_at: '2025-08-08T15:50:00', board_views: 260, writer: '야경러버' },
            { board_seq: 9, board_title: '제천 힐링 여행 코스 추천', board_at: '2025-08-09T09:10:00', board_views: 180, writer: '힐링러버' },
            { board_seq: 10, board_title: '울릉도, 독도 여행 준비 팁', board_at: '2025-08-10T20:20:00', board_views: 220, writer: '바다탐험가' },
        ];

        setData(mockData);
    }, []);

    const handlePostClick = async (board_seq) => {
        try {
            // await axios.post(`/board/review/${board_seq}`);
            navigate(`/board/${board_seq}`);
        } catch (error) {
            console.error('조회수 증가 실패', error);
        }
    };

    return (
        <>
            <Row className="mt-5"></Row>
            <Container className="my-5">
                <Row className="my-3">
                    <Col className="d-flex justify-content-left">
                        <h3>게시판</h3>
                    </Col>
                </Row>
                <Row className="mt-3 mt-md-0">
                    <Col xs={12} className="d-flex justify-content-end">
                        <Button id="write-button" variant="primary" onClick={() => navigate('/writePost')}>
                            글쓰기
                        </Button>
                    </Col>
                </Row>
                <Row className="my-5">
                    <Col>
                        <Paginated
                            data={datass.map((board, cnt) => ({
                                index: cnt + 1,
                                board_seq: board.board_seq,
                                id: board.writer,
                                time: board.board_at.substring(0, 10),
                                board_title: board.board_title,
                                view: board.board_views,
                            }))}
                            columns={[
                                { accessor: 'index', Header: '순서' },
                                {
                                    accessor: 'board_title',
                                    Header: '제목',
                                    width: '70%',
                                    Cell: ({ row }) => <span onClick={() => handlePostClick(row.original.board_seq)}>{row.values.board_title}</span>,
                                },
                                { accessor: 'id', Header: '작성자' },
                                { accessor: 'time', Header: '날짜' }, // 포매팅된 날짜 표시
                                { accessor: 'view', Header: '조회' },
                            ]}
                        />
                    </Col>
                </Row>
            </Container>
        </>
    );
}

export default Board;
