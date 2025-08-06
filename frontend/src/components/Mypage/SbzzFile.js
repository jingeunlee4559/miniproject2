import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Pagination } from 'react-bootstrap';
import axios from "../../axios";
import "../../css/SbzzFile.css"; // 추가적인 CSS 파일 임포트

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
  const [reData, setReData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 2; // 페이지당 항목 수를 2로 설정

  let mem_id = window.sessionStorage.getItem('mem_id');

  useEffect(() => {
    axios
      .post(`/Myinfo/s/search/${mem_id}`)
      .then((res) => {
        console.log(res.data, 'dfsdfds');
        console.log(res.data.result, 'dsfsdfsdfsd');

        // 좌석 수가 없는 항목을 0으로 설정
        const dataWithGuestCount = res.data.result.map(item => ({
          ...item,
          guest_count: item.guest_count || 0
        }));

        setReData(dataWithGuestCount); // Assuming `res.data.result` contains the array of data
      })
      .catch((error) => {
        console.error("fetching 에러입니다:", error);
      });
  }, [mem_id]);

  // 페이지 변경 핸들러
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // 현재 페이지의 데이터 계산
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = reData.slice(indexOfFirstItem, indexOfLastItem);

  // 페이지네이션 아이템 계산
  const totalPages = Math.ceil(reData.length / itemsPerPage);

  // 페이지네이션 항목 생성
  const renderPaginationItems = () => {
    const paginationItems = [];
    const maxPagesToShow = 3;
    const ellipsis = <Pagination.Ellipsis key="ellipsis" disabled />;

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - 1 && i <= currentPage + 1)
      ) {
        paginationItems.push(
          <Pagination.Item
            key={i}
            active={i === currentPage}
            onClick={() => handlePageChange(i)}
          >
            {i}
          </Pagination.Item>
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
        {currentItems.map((item, index) => (
          <Col xs={12} sm={6} md={6} lg={6} className="mb-4" key={index}>
            <Card className="shadow-sm h-100">
              <Card.Img variant="top" src={item.prod_img} alt={item.prod_name} className="card-img-top-small" />
              <Card.Body>
                <Card.Title className="card-title-small">{item.prod_name}</Card.Title>
                {item.guest_count > 0 && <Card.Text className="card-text-small">좌석수: {item.guest_count}석</Card.Text>}
                <Card.Text className="card-text-small">가격: {formatPrice(item.prod_price)}원</Card.Text>
                <Card.Text className="card-text-small">예약 가능 날짜: {formatDate(item.date)}</Card.Text>
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
}

export default SbzzFile;
