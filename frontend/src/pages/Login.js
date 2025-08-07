import { faLock, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useCallback, useState } from "react";
import { Button, Col, Container, Form, InputGroup, Nav, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "../css/Login.css"; // CSS 파일의 실제 경로로 확인하세요.
import Swal from 'sweetalert2';
import axios from "../axios";


function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    try {
      console.log(username);
      console.log(password);
      console.log("로그인 버튼이 클릭되었습니다.");

      axios.post("/api/login", { mem_id: username, mem_pw: password })
        .then((response) => {
          const data = response.data;
          console.log("로그인페이지 데이터",data);

          if (data.mem_id) {
            // 로그인 성공 시 처리
            window.sessionStorage.setItem("mem_id", data.mem_id);
            window.sessionStorage.setItem("mem_name", data.mem_name);
            window.sessionStorage.setItem("session", data.session);
            

            Swal.fire({
              icon: 'success',
              title: '로그인 성공!',
              text: `${data.mem_name}님 반갑습니다!`,
              confirmButtonText: '확인'
            }).then((result) => {
              if (result.isConfirmed) {
                window.location.href = "../"; // 메인 페이지로 리다이렉트
              }
            });
          } else {
            // 로그인 실패를 나타내는 알림 표시
            Swal.fire({
              icon: 'error',
              text: '아이디 또는 비밀번호를 잘못 입력했습니다.',
              confirmButtonText: '확인'
            });
          }
        })
        .catch((error) => {
          console.error("Error", error);
          Swal.fire({
            icon: 'error',
            text: '아이디 또는 비밀번호를 잘못 입력했습니다.....',
            confirmButtonText: '확인'
          });
        });

    } catch (error) {
      console.error("Error:", error);
      Swal.fire({
        icon: 'error',
        text: '알 수 없는 오류가 발생했습니다.',
        confirmButtonText: '확인'
      });
    }
  };

  const navigateTo = useCallback((path) => navigate(path), [navigate]);

  return (
    <>
    <Row className="mt-4">
    </Row>
    <div className="mt-5">
      <div id="content" className="my-custom-content">
        <Container>
          <Row className="justify-content-md-center">
            <Col lg={8} md={12} sm={12} className="login-form-container">
              <div className="text-center mt-2">
                <img
                  src="/img/wdp_log2.png"
                  alt="Read Fit 로고"
                  className="login-logo"
                />
              </div>

              <Form onSubmit={handleLogin}>
                <InputGroup className="mb-3 w-75">
                  <InputGroup.Text>
                    <FontAwesomeIcon icon={faUser} />
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    placeholder="아이디"
                    className="input-field"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </InputGroup>

                <InputGroup className="mb-3 w-75">
                  <InputGroup.Text>
                    <FontAwesomeIcon icon={faLock} />
                  </InputGroup.Text>
                  <Form.Control
                    type="password"
                    placeholder="비밀번호"
                    className="input-field"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </InputGroup>

                <Button
                  variant="success"
                  type="submit"
                  className="login-button mb-3"
                >
                  로그인
                </Button>
        
              </Form>
              <div className="text-center mt-4">
                <Nav className="me-auto justify-content-center">
                  <Nav.Link
                    onClick={() => navigateTo("/FindIDPW")}
                    className="nlink"
                  >
                    아이디/비밀번호 찾기
                  </Nav.Link>

                  <Nav.Link
                    onClick={() => navigateTo("/Register")}
                    className="nlink"
                  >
                    회원가입
                  </Nav.Link>
                </Nav>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
    </>
  );
}

export default Login;