import React, { useEffect, useState } from 'react';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import { Button } from 'react-bootstrap';
import axios from "../../axios";


const Upmodal = ({ show, handleClose, start, end, titles, mem_id, locations, cal_Idx }) => {
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endDate, setEndDate] = useState('');
  const [endTime, setEndTime] = useState('');
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [color, setColor] = useState('#0000FF'); // 기본 색상: 파란색

  useEffect(() => {
    if (start && end) {
      const startDateObj = new Date(start); // start를 Date 객체로 변환
      const endDateObj = new Date(end);     // end를 Date 객체로 변환

      setStartDate(startDateObj.toISOString().split('T')[0]);
      setStartTime(startDateObj.toTimeString().split(' ')[0].substring(0, 5));
      setEndDate(endDateObj.toISOString().split('T')[0]);
      setEndTime(endDateObj.toTimeString().split(' ')[0].substring(0, 5));
      setTitle(titles);
      setLocation(locations);
    }
  }, [start, end, titles, locations]);

  const handleStartDateChange = (e) => {
    setStartDate(e.target.value);
  };

  const handleEndDateChange = (e) => {
    setEndDate(e.target.value);
  };

  const handleSave = () => {
    const updatedEvent = {
      title,
      start: `${startDate}T${startTime}`,
      end: `${endDate}T${endTime}`,
      location,
      color,
      mem_id,
      cal_idx: cal_Idx
    };

    axios.post('/Calender/Update', updatedEvent)
      .then(response => {
        console.log(response.data);
        handleClose(updatedEvent);
      })
      .catch(error => {
        console.error('업데이트 실패:', error);
      });
  };

  return (
    <Modal show={show} onHide={() => handleClose(null)}>
      <Modal.Header closeButton style={{ backgroundColor: '#F89DFF' }}>
        <Modal.Title>일정 수정</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Control
          type="text"
          placeholder="일정 내용"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className='my-3'
        />
        <Form.Control
          type="text"
          placeholder="장소"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className='my-3'
        />
        시작일자
        <Form.Control
          type='date'
          value={startDate}
          onChange={handleStartDateChange}
          className='my-3'
        />
        시작 시간
        <Form.Control
          type='time'
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          className='my-3'
        />
        종료일자
        <Form.Control
          type='date'
          value={endDate}
          onChange={handleEndDateChange}
          className='my-3'
        />
        종료 시간
        <Form.Control
          type='time'
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          className='my-3'
        />
        색상 선택
        <Form.Control
          type='color'
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className='my-3'
        />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => handleClose(null)}>
          닫기
        </Button>
        <Button variant="primary" onClick={handleSave}>
          저장
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default Upmodal;
