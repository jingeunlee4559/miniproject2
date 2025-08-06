import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Col, Container, Row, Form, Button, Card } from 'react-bootstrap';
import "../../css/Aichost.css";
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { Appdata } from '../../App';
import Swal from 'sweetalert2';
const Aistep1 = () => {
    const navigate = useNavigate();

    const [lref,setLref] = useState('')
    const [sref,setSref] = useState('')

  const navigateTo = useCallback((path) => navigate(path), [navigate]);
  const data = useContext(Appdata)

  let lrefs = useRef()
  let srefs = useRef()

  function Back(){
    navigateTo("/")
  }


  function Next(){
    setLref(lrefs.current.value)
    setSref(srefs.current.value)
    if (srefs.current.value == '') {
      Swal.fire({
        icon: 'warning',
        text: '모든 필드를 선택해주세요',
        confirmButtonText: '확인'
      });
      return;
    }

  }
  useEffect(()=>{
  if(lref!== ''&& sref !=='') {
    
    let result ={
        lref : lref,
        sref : sref
    }
    navigateTo("/Aichoice/2")
    data.setShare(result)
}
},[lref,sref])

  return (
    <Container className='my-5'>
      <Row className="justify-content-center">
        <Col md={6}>  
          <Card className='m-auto'>
            <Row> 
              <Col className='Qtitle'>
                Q 01.
              </Col>
            </Row>
            <Row className='my-2'>
              <Col className='Qti2'>
                여행을 원하는 지역을 선택 해주세요
              </Col>
            </Row>
            <Row className='my-3'>
              <Col className='Qtit3'>
                출발하는 지역을 선택해주세요
              </Col> 
            </Row>

            <Row>
              <Col md={11} sm={10} xs={10} className='m-auto'>
                <Form.Select>
                  <option ref={lrefs}>광주</option>
                </Form.Select>
              </Col>
            </Row>
            <Row className='my-3'>
              <Col  className='Qtit3'>
                가본 곳 중 제외하고 싶은 여행지가 있다면 알려주세요.
              </Col>
            </Row>

            <Row>
              <Col md={11} sm={10} xs={10} className='m-auto'>
                <Form.Select  ref={srefs}>
                  <option value="">선택하세요</option>
                  <option value="35.1329295, 126.902357">남구</option>
                  <option value="35.1519278, 126.8902034">서구</option>
                  <option value="35.1742068, 126.912188">북구</option>
                  <option value="35.1459525, 126.9231488">동구</option>
                  <option value="35.1395924, 126.7937701">광산구</option>
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
}

export default Aistep1;
