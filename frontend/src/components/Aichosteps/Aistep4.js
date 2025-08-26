import React, { useCallback, useContext, useState, useEffect } from 'react';
import { Col, Container, Row, Button, Card, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from '../../axios';
import { Appdata } from '../../App';
import '../../css/Aichost.css';
import Maps from '../Maps';
import TravelSlide from './TravelSlide';

// 가격을 콤마로 포맷팅하는 함수
// const formatPrice = (price) => {
//     const number = parseInt(price, 10);
//     return new Intl.NumberFormat().format(number);
// };

// InfoCard 컴포넌트
const InfoCard = ({ title, item }) => (
    <Card className="mb-4 shadow-sm">
        <Card.Header style={{ backgroundColor: '#adeed9' }}>
            <h5 style={{ fontWeight: 'bold' }}>{item.name}</h5>
        </Card.Header>
        <Row noGutters>
            <Col md={12} lg={12} xl={6}>
                <Card.Img src={item.img} alt={item.name} />
            </Col>
            <Col md={12} lg={12} xl={6} className="d-flex flex-column justify-content-center text-center">
                <Card.Body>
                    <Card.Text className="mb-1"> {item.description}</Card.Text>
                    <Card.Text className="mb-1">주소 : {item.addreess}</Card.Text>
                    <Card.Text className="mb-1">휴무 : {item.day}</Card.Text>

                    <Card.Text className="mb-1">이용시간 : {item.time}</Card.Text>
                </Card.Body>
            </Col>
        </Row>
    </Card>
);

// Aistep4 컴포넌트
const Aistep4 = () => {
    const datas = useContext(Appdata);
    const choiceone = 1;
    let mem_id = window.sessionStorage.getItem('mem_id');
    const [travelItems, setTravelItems] = useState([
        {
            name: '제주도 한라산 여행',
            addreess: '여기는 주소',
            img: '/img/travel1234.png',
            description: '제주도에서 즐기는 한라산 트래킹과 자연 체험',
            day: '일요일 휴무',
            time: '09:00~18:00',
        },
        {
            name: '부산 해운대 여행',
            addreess: '여기는 주소',
            img: '/img/travel1234.png',
            description: '해운대 바다와 부산 시내 관광 코스',
            day: '일요일 휴무',
            time: '09:00~18:00',
        },
        {
            name: '강릉 주문진 여행',
            addreess: '여기는 주소',
            img: '/img/travel1234.png',
            description: '강릉 주문진에서 즐기는 해변과 맛집 투어',
            day: '일요일 휴무',
            time: '09:00~18:00',
        },
    ]);
    const [loading, setLoading] = useState(true);
    const data = useContext(Appdata);
    console.log(data, '6단계 확인');

    const navigate = useNavigate();
    const navigateTo = useCallback((path) => navigate(path), [navigate]);

    // useEffect(() => {
    //     const fetchData = async () => {
    //         try {
    //             const response = await axios.get('http://localhost:8500/travel'); // 여행지 데이터
    //             console.log('서버 응답:', response.data);

    //             // 여행지 3개만 가져오기
    //             const items = response.data.slice(0, 3);
    //             setTravelItems(items);
    //         } catch (error) {
    //             console.error('데이터 가져오기 오류:', error);
    //         } finally {
    //             setLoading(false);
    //         }
    //     };
    //     fetchData();
    // }, []);

    const handleBack = () => {
        navigateTo(-1);
    };

    const handleSave = async () => {
        try {
            const mem_id = window.sessionStorage.getItem('mem_id');

            // travelItems 배열이 이미 상태로 존재한다고 가정
            const saveData = {
                mem_id,
                travel: travelItems.map((item) => ({
                    name: item.name,
                    price: item.price,
                    img: item.img,
                    description: item.description,
                })),
            };

            const response = await axios.post('/Myinfo/s/saveTravel', saveData);
            console.log('저장 응답:', response.data);
            alert('여행지 추천 결과가 저장되었습니다.');
            navigateTo('/mypage');
        } catch (error) {
            console.error('저장 오류:', error);
            alert('추천 결과 저장에 실패했습니다.');
        }
    };

    // if (loading) {
    //     return (
    //         <Container className="text-center my-5">
    //             <Spinner animation="border" role="status">
    //                 <span className="visually-hidden">Loading...</span>
    //             </Spinner>
    //         </Container>
    //     );
    // }

    return (
        <Container className="my-3">
            {choiceone !== 0 ? (
                <>
                    <Row>
                        <Col>
                            <Maps />
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <TravelSlide />
                        </Col>
                    </Row>
                </>
            ) : (
                <>
                    <Row className="justify-content-center">
                        <Col md={8} sm={10} xs={12}>
                            {travelItems.map((item, idx) => (
                                <InfoCard key={idx} title={`여행지 ${idx + 1}`} item={item} />
                            ))}
                        </Col>
                    </Row>
                </>
            )}
            <Row className="text-center mt-4">
                <Col>
                    <Button onClick={handleBack} className="me-2 btnsfail">
                        취소
                    </Button>
                    <Button onClick={handleSave} className="btns">
                        저장
                    </Button>
                </Col>
            </Row>
        </Container>
    );
};

export default Aistep4;
