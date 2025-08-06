import React, { useCallback, useEffect, useState } from "react";
import { Col, Container, Image, Nav, Navbar, Row } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import "../css/Nav.css";
import axios from "../axios";

function Navs() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
    const [expanded, setExpanded] = useState(false);

  const navigateTo = useCallback((path) => {
    navigate(path);
    setExpanded(false);}, [navigate]);

  let mem_id = sessionStorage.getItem('mem_id');

  useEffect(() => {
    if(mem_id === null){
      console.log('isLogin ?? :: ', isLoggedIn);
    } else {
      console.log('isLogin ?? :: ', isLoggedIn);
      setIsLoggedIn(true);
    }

    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    if (location.pathname === '/') {
      window.addEventListener('scroll', handleScroll);
      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
    } else {
      setIsScrolled(true); // 메인 페이지가 아니면 기본적으로 배경색이 있는 상태로 설정
    }
  }, [location.pathname, mem_id, isLoggedIn]);
 

  const logout = async () => {
    try {
      await axios.post('/api/logout');
      sessionStorage.clear(); 
      setIsLoggedIn(false); 
      window.location.href = "../"
    } catch (error) {
      console.error('로그아웃 실패:', error);
    }
  };

  return (
    <>
      <Navbar expand="lg" className={`custom-navbar ${isScrolled ? 'scrolled' : ''}`}  expanded={expanded} >
        <Container style={{ maxWidth: "80%" }}> {/* Changed maxWidth to 100% */}
          <Navbar.Brand onClick={() => navigateTo("/")}>
            <img
              src="img/WDP_b.png"
              alt="로고"
              className="navbar-logo"
            />
          </Navbar.Brand>
          <Navbar.Toggle
            aria-controls="basic-navbar-nav"
            onClick={() => setExpanded(expanded ? false : true)} // ✅ 토글 동작
          />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto justify-content-center">
              <Nav.Link onClick={() => navigateTo("/")}>홈</Nav.Link>
              <Nav.Link onClick={() => navigateTo("/Board")}>게시판</Nav.Link>
              <Nav.Link onClick={() => navigateTo("/Category")}>카테고리</Nav.Link>
              <Nav.Link onClick={() => navigateTo("/Aichoice")}>Ai추천</Nav.Link>
            </Nav>
            <Nav className="align-items-center">
              {isLoggedIn ? (
                <>
                  <Nav.Link onClick={() => navigateTo("/Mypage")}>
                    마이페이지{" "}
                  </Nav.Link>
                  <Nav.Link onClick={logout}>로그아웃</Nav.Link>
                  {/* <img
                    // src={profileImageUrl}
                    roundedCircle
                    className="navbar-logo mx-2 d-lg-inline d-none"
                    // onClick={handleProfileClick}
                  /> */}
                </>
              ) : (
                <>
                  <Nav.Link onClick={() => navigateTo("/Login")}>로그인</Nav.Link>
                  <Nav.Link onClick={() => navigateTo("/Register")}>
                    회원가입
                  </Nav.Link>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
}

export default Navs;
