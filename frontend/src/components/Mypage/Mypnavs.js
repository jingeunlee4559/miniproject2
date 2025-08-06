import React, { useCallback } from 'react'
import { Nav } from 'react-bootstrap'
import "../../css/Mypnavs.css"
import { useNavigate } from 'react-router-dom';

const Mypnavs = () => {

  const navigate = useNavigate();
  const navigateTo = useCallback((path) => navigate(path), [navigate]);

    return (
        <Nav justify variant="tabs"  className='custom-snavbarmy' >
          <Nav.Item>
            <Nav.Link className='navlinkmy' onClick={() => navigateTo("/Mypage")}>내정보</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link className='navlinkmy' onClick={() => navigateTo("/Mypage/schedule")}>일정</Nav.Link>
          </Nav.Item>
        </Nav>
      );
    }

export default Mypnavs