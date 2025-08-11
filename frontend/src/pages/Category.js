import React, { useEffect, useState } from 'react';
import { Col, Container, Row, Button, ButtonGroup } from 'react-bootstrap';
import Cnav from '../components/Cnav';
import Ccard from '../components/Ccard';
import Search from '../components/Search';
// import axios from "../axios";

const Category = () => {
    const hardcodedCategorys = [
        // 광주광역시
        {
            store_idx: 1,
            category_p_name: '광주광역시',
            category_name: '동구',
            store_name: '광주 동구 여행지1',
            store_info: '광주광역시 동구에 위치한 여행지1',
            store_img: '/img/travel1234.png',
            positive: 85,
            total_reviews: 120,
        },
        {
            store_idx: 2,
            category_p_name: '광주광역시',
            category_name: '서구',
            store_name: '광주 서구 여행지2',
            store_info: '광주광역시 서구에 위치한 여행지2',
            store_img: '/img/travel1234.png',
            positive: 92,
            total_reviews: 105,
        },
        {
            store_idx: 3,
            category_p_name: '광주광역시',
            category_name: '남구',
            store_name: '광주 남구 여행지3',
            store_info: '광주광역시 남구에 위치한 여행지3',
            store_img: '/img/travel1234.png',
            positive: 86,
            total_reviews: 90,
        },
        {
            store_idx: 4,
            category_p_name: '광주광역시',
            category_name: '북구',
            store_name: '광주 북구 여행지4',
            store_info: '광주광역시 북구에 위치한 여행지4',
            store_img: '/img/travel1234.png',
            positive: 88,
            total_reviews: 100,
        },
        {
            store_idx: 5,
            category_p_name: '광주광역시',
            category_name: '광산구',
            store_name: '광주 광산구 여행지5',
            store_info: '광주광역시 광산구에 위치한 여행지5',
            store_img: '/img/travel1234.png',
            positive: 90,
            total_reviews: 110,
        },

        // 전라남도
        {
            store_idx: 6,
            category_p_name: '전라남도',
            category_name: '목포시',
            store_name: '전남 목포시 여행지1',
            store_info: '전라남도 목포시에 위치한 여행지1',
            store_img: '/img/travel1234.png',
            positive: 87,
            total_reviews: 95,
        },
        {
            store_idx: 7,
            category_p_name: '전라남도',
            category_name: '여수시',
            store_name: '전남 여수시 여행지2',
            store_info: '전라남도 여수시에 위치한 여행지2',
            store_img: '/img/travel1234.png',
            positive: 93,
            total_reviews: 150,
        },
        {
            store_idx: 8,
            category_p_name: '전라남도',
            category_name: '순천시',
            store_name: '전남 순천시 여행지3',
            store_info: '전라남도 순천시에 위치한 여행지3',
            store_img: '/img/travel1234.png',
            positive: 91,
            total_reviews: 140,
        },
        {
            store_idx: 9,
            category_p_name: '전라남도',
            category_name: '광양시',
            store_name: '전남 광양시 여행지4',
            store_info: '전라남도 광양시에 위치한 여행지4',
            store_img: '/img/travel1234.png',
            positive: 89,
            total_reviews: 85,
        },
        {
            store_idx: 10,
            category_p_name: '전라남도',
            category_name: '담양군',
            store_name: '전남 담양군 여행지5',
            store_info: '전라남도 담양군에 위치한 여행지5',
            store_img: '/img/travel1234.png',
            positive: 94,
            total_reviews: 170,
        },
    ];

    const [categorys, setCategorys] = useState(hardcodedCategorys);
    // 초기값에서 category_name을 빈 문자열로 바꿉니다.
    const [selectedCategory, setSelectedCategory] = useState({
        category_idx: '',
        category_p_name: '',
        category_name: '',
    });

    // 카테고리 선택 시 페이지 리셋도 같이 해주면 UX 좋습니다.
    const [currentPage, setCurrentPage] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const itemsPerPage = 8;

    const handleCategorySelect = (sel) => {
        setSelectedCategory({
            category_idx: sel.category_idx,
            category_p_name: sel.category_p_name,
            category_name: sel.category_name,
        });
        setCurrentPage(0);
    };

    const filteredWeds = categorys.filter((we) => {
        // 1) 1차 필터: category_p_name이 있으면 정확 비교
        if (selectedCategory.category_p_name) {
            if (we.category_p_name !== selectedCategory.category_p_name) return false;
        }

        // 2) 2차 필터: category_name이 있으면 정확 비교
        if (selectedCategory.category_name) {
            if (we.category_name !== selectedCategory.category_name) return false;
        }

        // 3) 검색어 필터 (원래대로 store_name / store_info에서 검색)
        const storeName = we.store_name.replace(/\s+/g, '').toLowerCase();
        const storeInfo = we.store_info.replace(/\s+/g, '').toLowerCase();
        const query = searchQuery.replace(/\s+/g, '').toLowerCase();

        if (!query) return true; // 검색어 없으면 현재 카테고리 조건만으로 통과
        return storeName.includes(query) || storeInfo.includes(query);
    });

    const totalPages = Math.ceil(filteredWeds.length / itemsPerPage);

    const gotoPage = (page) => setCurrentPage(page);
    const previousPage = () => setCurrentPage((prev) => Math.max(prev - 1, 0));
    const nextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1));
    const paginatedWeds = filteredWeds.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

    const handleSearch = (query) => {
        setSearchQuery(query);
        setCurrentPage(0);
    };

    return (
        <Container className="my-5">
            <Row>
                <Col lg={6} md={12} sm={12} className="t2 my-5">
                    카테고리
                </Col>
            </Row>
            <Row>
                <Col>
                    <Cnav onCategorySelect={handleCategorySelect} />
                </Col>
            </Row>
            <Row className="my-5 no-gutters">
                <Col lg={12} md={12} sm={12} className="t2">
                    {/* 디스플레이용 이름은 비어있으면 '여행지'로 대체 */}
                    {selectedCategory.category_name || selectedCategory.category_p_name || '여행지'}
                </Col>
            </Row>

            <Row>
                {paginatedWeds.map((we, index) => (
                    <Ccard
                        key={index}
                        store_img={we.store_img}
                        store={we.store_name}
                        store_idx={we.store_idx}
                        store_info={we.store_info}
                        positivePercentage={we.positive}
                        negativePercentage={100 - we.positive}
                        reviewCount={we.total_reviews}
                    />
                ))}
            </Row>

            <div className="pagination-container d-flex justify-content-center align-items-center mt-3">
                <ButtonGroup>
                    <Button onClick={() => gotoPage(0)} disabled={currentPage === 0} variant="primary" size="sm">
                        {'<<'}
                    </Button>
                    <Button onClick={previousPage} disabled={currentPage === 0} variant="primary" size="sm">
                        이전
                    </Button>
                    {Array.from({ length: totalPages }, (_, i) => (
                        <Button
                            key={i}
                            onClick={() => gotoPage(i)}
                            variant="light"
                            size="sm"
                            style={{
                                backgroundColor: currentPage === i ? '#16A085' : 'lightgray',
                                color: currentPage === i ? 'white' : 'black',
                            }}
                        >
                            {i + 1}
                        </Button>
                    ))}
                    <Button onClick={nextPage} disabled={currentPage === totalPages - 1} variant="primary" size="sm">
                        다음
                    </Button>
                    <Button onClick={() => gotoPage(totalPages - 1)} disabled={currentPage === totalPages - 1} variant="primary" size="sm">
                        {'>>'}
                    </Button>
                </ButtonGroup>
            </div>
            <Search onSubmit={handleSearch} />
        </Container>
    );
};

export default Category;
