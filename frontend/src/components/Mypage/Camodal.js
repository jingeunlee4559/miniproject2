import React, { useEffect, useState } from 'react';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import { Button } from 'react-bootstrap';
import axios from "../../axios";

const Camodal = ({ show, handleClose, date, mem_id }) => {
  const [startDate, setStartDate] = useState(date);
  const [startTime, setStartTime] = useState(''); 
  const [endDate, setEndDate] = useState(date);
  const [endTime, setEndTime] = useState(''); 
  const [title, setTitle] = useState(''); 
  const [location, setLocation] = useState(''); 
  const [color, setColor] = useState('#0000FF'); // 기본 색상: 파란색

  useEffect(() => {
    setStartDate(date);
    setEndDate(date);
    setStartTime('');
    setEndTime('');
    setTitle('');
    setLocation('');
  }, [date]);

  const handleStartDateChange = (e) => {
    setStartDate(e.target.value);
  };

  const handleEndDateChange = (e) => {
    setEndDate(e.target.value);
  };

  const handleSave = () => {
    // Construct the newEvent object
    const newEvent = {
      title,
      start: startDate ? `${startDate}T${startTime || '00:00'}` : '',
      end: endDate ? `${endDate}T${endTime || '23:59'}` : '',
      location,
      color,
      mem_id
    };
  
    // Send the newEvent object to the server using axios
    axios.post('/Calender/add', newEvent)
      .then(response => {
        console.log('새 이벤트가 성공적으로 추가되었습니다:', response.data);
        handleClose(response.data); // Close modal and possibly pass data back to parent component
      })
      .catch(error => {
        console.error('새 이벤트 추가 실패:', error);
        alert('새 이벤트 추가 중 오류가 발생했습니다.');
      });
  };

  return (
    <Modal show={show} onHide={() => handleClose(null)}>
      <Modal.Header closeButton style={{ backgroundColor: '#F89DFF' }}>
        <Modal.Title>일정 추가</Modal.Title>
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

export default Camodal;
