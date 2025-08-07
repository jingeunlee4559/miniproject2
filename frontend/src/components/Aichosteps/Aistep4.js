import React, { useCallback, useContext, useState, useEffect } from "react";
import { Col, Container, Row, Button, Card, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "../../axios";
import { Appdata } from '../../App';
import "../../css/Aichost.css";

// 가격을 콤마로 포맷팅하는 함수
const formatPrice = (price) => {
  const number = parseInt(price, 10);
  return new Intl.NumberFormat().format(number);
};

// InfoCard 컴포넌트
const InfoCard = ({ title, item }) => (
  <Card className="mb-4 shadow-sm">
    <Card.Header style={{ backgroundColor: '#DAC4FB' }}>
      <h5 style={{ fontWeight: 'bold' }}>{title}</h5>
    </Card.Header>
    <Row noGutters>
      <Col md={12} lg={12} xl={6}>
        <Card.Img src={item.img} alt={item.name} />
      </Col>
      <Col md={12} lg={12} xl={6}>
        <Card.Body>
          <Card.Text className="mb-1 text-align-center">상호명 : {item.name}</Card.Text>
          {item.sit && <Card.Text className="mb-1 text-align-center">좌석수 : {item.sit}석</Card.Text>}
          <Card.Text className="mb-1 text-align-center">가격 : {formatPrice(item.price)}원</Card.Text>
          <Card.Text className="mb-1 text-align-center">예약 가능 날짜 : {item.date}</Card.Text>
        </Card.Body>
      </Col>
    </Row>
  </Card>
);

// Aistep4 컴포넌트
const Aistep4 = () => {
  let mem_id = window.sessionStorage.getItem('mem_id');

  const data = useContext(Appdata);
  console.log(data, "6단계 확인");

  const navigate = useNavigate();
  const navigateTo = useCallback((path) => navigate(path), [navigate]);

  const [mainItem, setMainItem] = useState(null);
  const [studioItem, setStudioItem] = useState(null);
  const [dressItem, setDressItem] = useState(null);
  const [makeupItem, setMakeupItem] = useState(null);
  const [totalPrice, setTotalPrice] = useState('0'); // 상태 추가

  // 데이터 가져와서 상태 업데이트
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8500/data');
        console.log('서버 응답:', response.data);

        if (response.data['wedding-hall']) {
          setMainItem(response.data['wedding-hall'].mainItem);
        }
        if (response.data['studio']) {
          setStudioItem(response.data['studio'].mainItem);
        }
        if (response.data['dress']) {
          setDressItem(response.data['dress'].mainItem);
        }
        if (response.data['makeup']) {
          setMakeupItem(response.data['makeup'].mainItem);
        }

        // 총 가격 계산 및 설정
        const total = calculateTotal(response.data);
        setTotalPrice(total);

      } catch (error) {
        console.error('데이터 가져오기 오류:', error);
      }
    };

    fetchData();
  }, []);

  const calculateTotal = (data) => {
    const parsePrice = (price) => parseInt(price, 10);

    const total = [
      data['wedding-hall']?.mainItem,
      data['studio']?.mainItem,
      data['dress']?.mainItem,
      data['makeup']?.mainItem
    ]
      .filter(item => item !== null && item !== undefined)
      .map(item => parsePrice(item.price))
      .reduce((sum, price) => sum + price, 0);

    return formatPrice(total);
  };

  const handleBack = () => {
    navigateTo(-1);
  };

  const handleSave = async () => {
    try {
      const saveData = {
        mem_id,
        weddingHall: {
          name: mainItem.name,
          price: mainItem.price,
          sit: mainItem.sit,
          img: mainItem.img,
          date: mainItem.date,
        },
        studio: {
          name: studioItem.name,
          price: studioItem.price,
          sit: studioItem.sit,
          img: studioItem.img,
          date: studioItem.date,
        },
        dress: {
          name: dressItem.name,
          price: dressItem.price,
          sit: dressItem.sit,
          img: dressItem.img,
          date: dressItem.date,
        },
        makeup: {
          name: makeupItem.name,
          price: makeupItem.price,
          sit: makeupItem.sit,
          img: makeupItem.img,
          date: makeupItem.date,
        },
        totalPrice,
      };

      const response = await axios.post('/Myinfo/s/save', saveData);
      console.log('저장 응답:', response.data);
      alert('추천 결과가 저장되었습니다.');
      navigateTo('/mypage');
    } catch (error) {
      console.error('저장 오류:', error);
      alert('추천 결과 저장에 실패했습니다.');
    }
  };

  if (!mainItem || !studioItem || !dressItem || !makeupItem) {
    return (
      <Container className="text-center my-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  return (
    <Container className="my-2">
      <Row className="justify-content-center">
        <Col md={8} sm={10} xs={12}>
          <Card className="m-auto p-4 shadow-lg aichoice-card">
            <Row>
              <Col className="text-center">
                <h2 className="text-purple">결과</h2>
              </Col>
            </Row>
            <Row className="mt-3">
              <Col md={12}>
                <InfoCard title="웨딩홀" item={mainItem} />
              </Col>
            </Row>
            <hr />
            <Row className="mt-2">
              <Col md={12}>
                <InfoCard title="스튜디오" item={studioItem} />
              </Col>
            </Row>
            <hr />
            <Row className="mt-2">
              <Col md={12}>
                <InfoCard title="드레스" item={dressItem} />
              </Col>
            </Row>
            <hr />
            <Row className="mt-2">
              <Col md={12}>
                <InfoCard title="메이크업" item={makeupItem} />
              </Col>
            </Row>
            <Row className="text-center my-3">
              <Col>
                <Button className="me-4 btns">총합: {totalPrice}원</Button>
              </Col>
            </Row>
            <Row className="text-center mt-3">
              <Col>
                <Button onClick={handleBack} className="me-2 btns">취소</Button>
                <Button onClick={handleSave} className="btns">저장</Button>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Aistep4;