import React, { useEffect, useState } from 'react';
import { Col, Container, Row, Button, ButtonGroup } from 'react-bootstrap';
import Cnav from '../components/Cnav';
import Ccard from '../components/Ccard';
import Search from '../components/Search';
import axios from 'axios';

const Category = () => {
    const [categories, setCategories] = useState([]); // 여행지 목록
    const [regions, setRegions] = useState([]); // 지역 정보
    const [selectedCategory, setSelectedCategory] = useState({
        region1Id: null,
        region2Id: null,
        region1Name: '',
        region2Name: '',
    });

    const [currentPage, setCurrentPage] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const itemsPerPage = 8;

    // 지역 정보 가져오기
    useEffect(() => {
        const fetchRegions = async () => {
            try {
                const response = await axios.get('http://localhost:8090/api/region');
                setRegions(response.data);
            } catch (error) {
                console.error('지역 정보를 가져오는데 실패했습니다:', error);
            }
        };
        fetchRegions();
    }, []);

    // 여행지 목록 가져오기
    useEffect(() => {
        const fetchCategories = async () => {
            setLoading(true);
            try {
                let url;
                const params = new URLSearchParams();

                // 검색어가 있고 공백이 아닐 때만 검색 API 사용
                if (searchQuery && searchQuery.trim().length > 0) {
                    url = 'http://localhost:8090/api/category/search';
                    params.append('keyword', searchQuery.trim());
                } else {
                    url = 'http://localhost:8090/api/category/all';
                }

                if (selectedCategory.region1Id) {
                    params.append('region1Id', selectedCategory.region1Id);
                }
                if (selectedCategory.region2Id) {
                    params.append('region2Id', selectedCategory.region2Id);
                }

                if (params.toString()) {
                    url += `?${params.toString()}`;
                }

                const response = await axios.get(url);
                setCategories(response.data);
            } catch (error) {
                console.error('여행지 정보를 가져오는데 실패했습니다:', error);
                setCategories([]);
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, [selectedCategory.region1Id, selectedCategory.region2Id, searchQuery]);

    // 카테고리 선택 핸들러
    const handleCategorySelect = (selection) => {
        setSelectedCategory({
            region1Id: selection.region1Id,
            region2Id: selection.region2Id,
            region1Name: selection.region1Name,
            region2Name: selection.region2Name,
        });
        setCurrentPage(0);
    };

    // 검색 필터링 (백엔드에서 처리하므로 프론트에서는 필터링 불필요)
    const filteredCategories = categories;

    // 페이징 처리
    const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);
    const paginatedCategories = filteredCategories.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

    // 페이지 네비게이션
    const gotoPage = (page) => setCurrentPage(page);
    const previousPage = () => setCurrentPage((prev) => Math.max(prev - 1, 0));
    const nextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1));

    // 검색 핸들러
    const handleSearch = (query) => {
        const trimmedQuery = query ? query.trim() : '';
        setSearchQuery(trimmedQuery);
        setCurrentPage(0);
    };

    // 조회수 증가
    const handleViewIncrement = async (id) => {
        try {
            await axios.put(`http://localhost:8090/api/category/${id}/view`);
        } catch (error) {
            console.error('조회수 업데이트 실패:', error);
        }
    };

    return (
        <Container className="my-5">
            <Row>
                <Col lg={6} md={12} sm={12} className="t2 my-5">
                    여행지
                </Col>
            </Row>

            <Row>
                <Col>
                    <Cnav regions={regions} onCategorySelect={handleCategorySelect} />
                </Col>
            </Row>

            <Row className="my-5 no-gutters">
                <Col lg={12} md={12} sm={12} className="t2">
                    {searchQuery
                        ? `"${searchQuery}" 검색 결과 ${selectedCategory.region2Name ? `in ${selectedCategory.region2Name}` : selectedCategory.region1Name ? `in ${selectedCategory.region1Name}` : ''}`
                        : selectedCategory.region2Name || selectedCategory.region1Name || '전체 여행지'}
                </Col>
            </Row>

            {loading ? (
                <Row>
                    <Col className="text-center">
                        <div>로딩 중...</div>
                    </Col>
                </Row>
            ) : (
                <Row>
                    {paginatedCategories.map((category) => (
                        <Ccard
                            key={category.id}
                            store_img={category.imageUrl}
                            store={category.name}
                            store_idx={category.id}
                            store_info={category.shortDesc}
                            address={category.address}
                            viewCount={category.viewCount}
                            onViewIncrement={() => handleViewIncrement(category.id)}
                            positivePercentage={85}
                            negativePercentage={15}
                        />
                    ))}
                    {paginatedCategories.length === 0 && !loading && (
                        <Col className="text-center">
                            <div>{searchQuery ? `"${searchQuery}"에 대한 검색 결과가 없습니다.` : '해당 조건에 맞는 여행지가 없습니다.'}</div>
                        </Col>
                    )}
                </Row>
            )}

            {totalPages > 1 && (
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
            )}

            <Search onSubmit={handleSearch} currentSearchQuery={searchQuery} />
        </Container>
    );
};

export default Category;
