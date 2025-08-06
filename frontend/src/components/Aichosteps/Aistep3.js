import React, { useCallback, useState, useContext } from "react";
import { Col, Container, Row, Button, Card, Form } from "react-bootstrap";
import "../../css/Aichost.css";
import { useNavigate } from "react-router-dom";
import { Appdata } from '../../App';
import axios from "../../axios";
import Swal from 'sweetalert2';

const Aistep3 = () => {
  const [persons, setPersons] = useState('');
  const [pluspersons, setPlusPersons] = useState('');

  const navigate = useNavigate();
  const navigateTo = useCallback((path) => navigate(path), [navigate]);

  const data = useContext(Appdata);

  console.log(data, "4단계");

  function Back() {
    navigateTo(-1);
  }

  const handlePersonsChange = (e) => {
    setPersons(e.target.value);
  };

  const handlePlusPersonsChange = (e) => {
    setPlusPersons(e.target.value);
  };

  console.log(persons);
  console.log(pluspersons);

const Next = async () => {
  const mem_id = window.sessionStorage.getItem('mem_id');
  if (!mem_id) {
      Swal.fire({
          icon: 'warning',
          text: '로그인 후 이용해주세요',
          confirmButtonText: '확인'
      });
      return;
  }

  if (persons === '' || pluspersons === '') {
      Swal.fire({
          icon: 'warning',
          text: '모든 필드를 입력해주세요',
          confirmButtonText: '확인'
      });
      return;
  }

  const formData = new FormData();
  formData.append('lref', data.shareData.lref);
  // formData.append('sref', data.shareData.sref);
  formData.append('dates', data.shareData.dates);
  formData.append('times', data.shareData.times);
  formData.append('moneys', data.shareData.moneys);
  formData.append('persons', persons);
  formData.append('pluspersons', pluspersons);

  try {
      const response = await axios.post('http://localhost:8500/upload', formData);

      if (response.status === 200) {
          let finalData = {
              lref: data.shareData.lref,
              sref: data.shareData.sref,
              dates: data.shareData.dates,
              times: data.shareData.times,
              moneys: data.shareData.moneys,
              persons: persons,
              pluspersons: pluspersons,
          };

          data.setShare(finalData);
          navigateTo("/Aichoice/2/3/4");
      } else {
          console.error('파일 업로드 실패');
      }
  } catch (error) {
      console.error('파일 업로드 중 오류 발생:', error);
  }
};

  return (
    <Container className="my-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="m-auto">
            <Row>
              <Col className="Qtitle">Q 03.</Col>
            </Row>
            <Row className="my-2">
              <Col className="Qti2">
               누구와 함께 떠나는 여행인가요?
              </Col>
            </Row>
            <Row className="my-3">
              <Col className="Qtit3">예상 인원수를 알려주세요</Col>
            </Row>

            <Row>
              <Col md={11} sm={10} xs={10} className="m-auto">
                <Form.Select value={persons} onChange={handlePersonsChange}>
                  <option value="">선택하세요</option>
                  <option value='200'>200명 이하</option>
                  <option value='250'>200명 ~ 250명</option>
                  <option value='300'>250명 ~ 300명</option>
                  <option value='350'>300명 ~ 350명</option>
                  <option value='400'>350명 이상</option>
                </Form.Select>
              </Col>
            </Row>

            <Row className="my-5">
              <Col>
                <Row className="my-2">
                  <Col className="Qtit3">어떤 스타일의 여행을 원하시나요?</Col>
                </Row>

                <Row>
                  <Col md={11} sm={10} xs={10} className="m-auto">
                    <Form.Select value={pluspersons} onChange={handlePlusPersonsChange}>
                      <option value="">선택하세요</option>
                      <option>YES</option>
                      <option>NO</option>
                    </Form.Select>
                  </Col>
                </Row>
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

export default Aistep3;