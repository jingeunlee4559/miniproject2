import React, { useState, useEffect } from "react";
import { Container, Nav } from "react-bootstrap";
import axios from "../axios";
import "../css/Cnav.css";

const Cnav = ({ onCategorySelect }) => {
  // const [categories, setCategories] = useState([]);
  // useEffect(() => {
  //   axios
  //     .get("/Category")
  //     .then((response) => {
  //       console.log(response.data.Category);
  //       const categoryData = response.data.Category;
  //       const groupedCategories = categoryData.reduce((acc, cur) => {
  //         const key = cur.category_idx;

  //         acc[key] = {
  //           category_idx: key,
  //           category_name: cur.category_name,
  //           category_p_name: cur.category_p_name,
  //         };

  //         return acc;
  //       }, {});

  //       setCategories(Object.values(groupedCategories));
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching categories:", error);
  //     });
  // }, []);

  const handleCategoryClick = (category) => {
    if (typeof onCategorySelect === "function") {
      // onCategorySelect(category); // 선택한 카테고리를 부모 컴포넌트로 전달
      console.log(category);
    } else {
      console.warn("onCategorySelect is not defined or not a function");
    }
  };

  let categories=[
    {parentCategorySeq : '광주'},
    {parentCategorySeq : '서울'},
    {parentCategorySeq: '부산'},
    {parentCategorySeq : '대구'}
]

  return (
    <Container fluid className="mamenu2-containerm custom-nav-containerm">
      <Nav className="mamenu2m justify-content-center custom-navm">
        {categories.map((category, index) => (
          <Nav.Item key={index}>
            <Nav.Link
              eventKey={`link-${index}`}
              onClick={() => handleCategoryClick(category)}
              className="navlinkM"
            >
              {category.parentCategorySeq}
            </Nav.Link>
          </Nav.Item>
        ))}
      </Nav>
    </Container>
  );
};
export default Cnav;
