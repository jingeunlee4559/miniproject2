import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Pagination } from 'react-bootstrap';
import axios from '../../axios';
import '../../css/SbzzFile.css'; // 추가적인 CSS 파일 임포트

// 가격을 콤마로 포맷팅하는 함수
const formatPrice = (price) => {
    const number = parseInt(price, 10);
    return new Intl.NumberFormat().format(number);
};

// 날짜를 YYYY-MM-DD 형식으로 포맷팅하는 함수
const formatDate = (dateString) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(dateString).toLocaleDateString('ko-KR', options);
};

const SbzzFile = () => {
    const [travelData, setTravelData] = useState([
        {
            id: 1,
            travel_img: 'img/travel1234.png',
            travel_name: '제주도 한라산',
            travel_address: '제주특별자치도 제주시 한라산로 123',
            date: '2025-09-10',
        },
        {
            id: 2,
            travel_img: 'img/travel1234.png',
            travel_name: '부산 해운대',
            travel_address: '부산광역시 해운대구 해운대해변로 456',
            date: '2025-09-15',
        },
        {
            id: 3,
            travel_img: 'img/travel1234.png',
            travel_name: '강릉 경포대',
            travel_address: '강원특별자치도 강릉시 경포로 789',
            date: '2025-09-20',
        },
    ]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 2; // 페이지당 항목 수를 2로 설정

    // let mem_id = window.sessionStorage.getItem('mem_id');

    // useEffect(() => {
    //   axios
    //     .post(`api/Myinfo/s/search/${mem_id}`)
    //     .then((res) => {
    //       console.log(res.data, 'dfsdfds');
    //       console.log(res.data.result, 'dsfsdfsdfsd');

    //       // 좌석 수가 없는 항목을 0으로 설정
    //       const dataWithGuestCount = res.data.result.map(item => ({
    //         ...item,
    //         guest_count: item.guest_count || 0
    //       }));

    //       setReData(dataWithGuestCount); // Assuming `res.data.result` contains the array of data
    //     })
    //     .catch((error) => {
    //       console.error("fetching 에러입니다:", error);
    //     });
    // }, [mem_id]);

    // 페이지 변경 핸들러
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // 현재 페이지의 데이터 계산
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = travelData.slice(indexOfFirstItem, indexOfLastItem);

    // 페이지네이션 아이템 계산
    const totalPages = Math.ceil(travelData.length / itemsPerPage);

    // 페이지네이션 항목 생성
    const renderPaginationItems = () => {
        const paginationItems = [];
        const maxPagesToShow = 3;
        const ellipsis = <Pagination.Ellipsis key="ellipsis" disabled />;

        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
                paginationItems.push(
                    <Pagination.Item key={i} active={i === currentPage} onClick={() => handlePageChange(i)}>
                        {i}
                    </Pagination.Item>,
                );
            } else if (i === currentPage - 2 || i === currentPage + 2) {
                paginationItems.push(ellipsis);
            }
        }
        return paginationItems;
    };

    return (
        <Container className="my-5">
            <Row className="justify-content-center">
                {currentItems.map((item) => (
                    <Col xs={12} sm={6} md={6} lg={6} className="mb-4" key={item.id}>
                        <Card className="shadow-sm h-100">
                            <Card.Img variant="top" src={item.travel_img} alt={item.travel_name} className="card-img-top-small" />
                            <Card.Body>
                                <Card.Title className="card-title-small">{item.travel_name}</Card.Title>
                                <Card.Text className="card-text-small">주소: {item.travel_address}</Card.Text>
                                <Card.Text className="card-text-small">날짜: {formatDate(item.date)}</Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
            <Row className="justify-content-center">
                <Pagination>{renderPaginationItems()}</Pagination>
            </Row>
        </Container>
    );
};

export default SbzzFile;
