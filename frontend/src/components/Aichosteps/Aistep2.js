import React, { useCallback, useState, useContext } from "react";
import { Col, Container, Row, Form, Button, Card } from "react-bootstrap";
import "../../css/Aichost.css";
import { useNavigate } from "react-router-dom";
import { Appdata } from '../../App';
import Swal from 'sweetalert2';

const Aistep2 = () => {
  const [dates, setDates] = useState('');
  const [times, setTimes] = useState('');
  const [moneys, setMoneys] = useState('');

  const navigate = useNavigate();
  const navigateTo = useCallback((path) => navigate(path), [navigate]);

  const data = useContext(Appdata);

  console.log(data.shareData.lref);

  const handleDateChange = (e) => {
    setDates(e.target.value);
  };

  const handleTimeChange = (e) => {
    setTimes(e.target.value);
  };

  const handleMoneyChange = (e) => {
    setMoneys(e.target.value);
  };

  function Back() {
    navigateTo(-1);
  }

  console.log(times);
  console.log(dates);
  console.log(moneys);

  function Next() {
    if (dates === '' || times === '' || moneys === '') {
      Swal.fire({
        icon: 'warning',
        text: '모든 필드를 선택해주세요',
        confirmButtonText: '확인'
      });
      return;
    }

    let result = {
      lref: data.shareData.lref,
      sref: data.shareData.sref,
      dates: dates,
      times: times,
      moneys: moneys
    };
    console.log("Form Data to be sent:", result); // 데이터를 전송하기 전에 출력

    data.setShare(result);
    navigateTo("/Aichoice/2/3");
  }

  return (
    <Container className="my-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <Card className="m-auto">
            <Row>
              <Col className="Qtitle">Q 02.</Col>
            </Row>
            <Row className="my-2">
              <Col className="Qti2">
                여행을 원하는 희망날짜와 시간을 선택 해주세요
              </Col>
            </Row>
            <Row className="my-3">
              <Col className="Qtit3">날짜를 선택 해주세요</Col>
            </Row>

            <Row>
              <Col md={11} sm={10} xs={10} className="m-auto">
                <Form.Control type="date" className="my-3" value={dates} onChange={handleDateChange} />
              </Col>
            </Row>
            <Row className="my-3">
              <Col className="Qtit3">시간을 선택 해주세요</Col>
            </Row>

            <Row>
              <Col md={11} sm={10} xs={10} className="m-auto">
                <Form.Control type="time" className="my-3" value={times} onChange={handleTimeChange} />
              </Col>
            </Row>
            <Row className="my-3">
              <Col className="Qtit3">예상 금액을 선택 해주세요</Col>
            </Row>

            <Row>
              <Col md={11} sm={10} xs={10} className="m-auto">
                <Form.Select value={moneys} onChange={handleMoneyChange}>
                  <option value="">선택하세요</option>
                  <option value="600만원 이하">600만원 이하</option>
                  <option value="600만원 ~ 800만원">600만원 ~ 800만원</option>
                  <option value="800만원 ~ 1000만원">800만원 ~ 1000만원</option>
                  <option value="1000만원 이상">1000만원 이상</option>
                </Form.Select>
              </Col>
            </Row>

            <Row>
            <Col className='mt-5 text-center'>
                <Button  onClick={Back} className="me-2 btns">취소</Button>
                <Button  onClick={Next} className="btns">다음</Button>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Aistep2;