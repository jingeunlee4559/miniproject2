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

    useEffect(() => {
        axios
            .get('/api/board/all')
            .then((res) => {
                console.log('게시판 데이터', res.data);
                setData(res.data);
            })
            .catch(() => {
                console.log('데이터 가져오기 실패');
            });
    }, []);

    const handlePostClick = async (board_seq) => {
        try {
            //await axios.get(`/api/board/${board_seq}`);
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
                        <h3>커뮤니티</h3>
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
                                id: board.mem_id,
                                time: board.created_at.substring(0, 10),
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
