import React, { useCallback } from 'react';
import { Nav } from 'react-bootstrap';
import '../../css/Mypnavs.css';
import { useNavigate, useLocation } from 'react-router-dom';

const Mypnavs = () => {
    const navigate = useNavigate();
    const location = useLocation(); // 현재 URL 경로 가져오기

    const navigateTo = useCallback(
        (path) => {
            navigate(path);
        },
        [navigate],
    );

    return (
        <Nav
            justify
            variant="tabs"
            className="custom-snavbarmy"
            activeKey={location.pathname} // 현재 경로에 맞추어 활성 탭 자동 설정
        >
            <Nav.Item>
                <Nav.Link eventKey="/Mypage" onClick={() => navigateTo('/Mypage')} className="navlinkmy">
                    내정보
                </Nav.Link>
            </Nav.Item>
            <Nav.Item>
                <Nav.Link eventKey="/Mypage/schedule" onClick={() => navigateTo('/Mypage/schedule')} className="navlinkmy">
                    일정
                </Nav.Link>
            </Nav.Item>
        </Nav>
    );
};

export default Mypnavs;
