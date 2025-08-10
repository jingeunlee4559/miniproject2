import React, { useEffect, useState } from "react";
import { Col, Container, Row, Button, ButtonGroup } from "react-bootstrap";
import Cnav from "../components/Cnav";
import Ccard from "../components/Ccard";
import Search from "../components/Search";
// import axios from "../axios";

const Category = () => {

  const hardcodedCategorys = [
    {
      store_idx: 1,
      store_name: "광주여행지",
      store_info: "광주여행지1",
      store_img: "/img/travel1234.png",
      positive: 85,
      total_reviews: 120,
    },
    {
      store_idx: 2,
      store_name: "부산 여행지",
      store_info: "부산 여행지2",
           store_img: "/img/travel1234.png",
      positive: 90,
      total_reviews: 95,
    },
    {
      store_idx: 3,
      store_name: "댁구 여행지1",
      store_info: "대구 여행지1",
      store_img: "/img/travel1234.png",
      positive: 88,
      total_reviews: 80,
    },
    {
      store_idx: 4,
      store_name: "광주 여행지2",
      store_info: "광주 여행지2",
            store_img: "/img/travel1234.png",
      positive: 92,
      total_reviews: 105,
    },
    {
      store_idx: 5,
      store_name: "대전 여행지2",
      store_info: "대전 여행지2",
            store_img: "/img/travel1234.png",
      positive: 87,
      total_reviews: 110,
    },
    {
      store_idx: 6,
      store_name: "서울 여행지2",
      store_info: "서울여행지2",
            store_img: "/img/travel1234.png",
      positive: 93,
      total_reviews: 150,
    },
    {
      store_idx: 7,
      store_name: "부산 여행지2",
      store_info: "부산여행지2",
       store_img: "/img/travel1234.png",
      positive: 89,
      total_reviews: 130,
    },
    {
      store_idx: 8,
      store_name: "대구 여행지3",
      store_info: "대구 여행지3",
       store_img: "/img/travel1234.png",
      positive: 91,
      total_reviews: 140,
    },
    {
      store_idx: 9,
      store_name: "광주 여행지4",
      store_info: "여행지4",
       store_img: "/img/travel1234.png",
      positive: 86,
      total_reviews: 90,
    },
    {
      store_idx: 10,
      store_name: "대전 여행지5",
      store_info: "여행지5",
       store_img: "/img/travel1234.png",
      positive: 94,
      total_reviews: 170,
    },
  ];

  const [categorys, setCategorys] = useState(hardcodedCategorys);
  const [selectedCategory, setSelectedCategory] = useState({
    category_idx: "",
    category_p_name: "",
    category_name: "여행지",
  });

  const handleCategorySelect = (selectedCategory) => {
    setSelectedCategory({
      category_idx: selectedCategory.category_idx,
      category_p_name: selectedCategory.category_p_name,
      category_name: selectedCategory.category_name,
    });
  };


  /*
  useEffect(() => {
    const fetchCa = async () => {
      let apiUrl = "/Category/all/wedding";

      if (selectedCategory.category_p_name) {
        apiUrl = `/Category/all/${selectedCategory.category_p_name}`;
        console.log(selectedCategory.category_p_name, "클릭 되서 나오니?");
      }

      try {
        const response = await axios.get(apiUrl);
        console.log(response.data, "API 응답");
        setCategorys(response.data.Categorys || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchCa();
  }, [selectedCategory.category_p_name]);
  */

  const [currentPage, setCurrentPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const itemsPerPage = 8;

  const filteredWeds = categorys.filter((we) => {
    const storeName = we.store_name.replace(/\s+/g, "").toLowerCase();
    const storeInfo = we.store_info.replace(/\s+/g, "").toLowerCase();
    const query = searchQuery.replace(/\s+/g, "").toLowerCase();
    return storeName.includes(query) || storeInfo.includes(query);
  });

  console.log(filteredWeds, "어떻게 되니??");

  const totalPages = Math.ceil(filteredWeds.length / itemsPerPage);

  const gotoPage = (page) => {
    setCurrentPage(page);
  };

  const previousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 0));
  };

  const nextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1));
  };

  const paginatedWeds = filteredWeds.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

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
          {selectedCategory.category_name}
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
          <Button
            onClick={() => gotoPage(0)}
            disabled={currentPage === 0}
            variant="primary"
            size="sm"
          >
            {"<<"}
          </Button>
          <Button
            onClick={previousPage}
            disabled={currentPage === 0}
            variant="primary"
            size="sm"
          >
            이전
          </Button>
          {Array.from({ length: totalPages }, (_, i) => (
            <Button
              key={i}
              onClick={() => gotoPage(i)}
              variant="light"
              size="sm"
              style={{
                backgroundColor: currentPage === i ? "#6DD2FF" : "lightgray",
                color: currentPage === i ? "black" : "black",
              }}
            >
              {i + 1}
            </Button>
          ))}
          <Button
            onClick={nextPage}
            disabled={currentPage === totalPages - 1}
            variant="primary"
            size="sm"
          >
            다음
          </Button>
          <Button
            onClick={() => gotoPage(totalPages - 1)}
            disabled={currentPage === totalPages - 1}
            variant="primary"
            size="sm"
          >
            {">>"}
          </Button>
        </ButtonGroup>
      </div>
      <Search onSubmit={handleSearch} />
    </Container>
  );
};

export default Category;
