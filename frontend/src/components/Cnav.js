import React, { useState } from 'react';
import '../css/Cnav.css';

const Cnav = ({ onCategorySelect }) => {
    const categories = [
        {
            category_p_name: '전라남도',
            color: '#FF9F43',
            sub: ['여수시', '광양시', '목포시', '순천시', '담양군'],
        },
        {
            category_p_name: '광주광역시',
            color: '#16A085',
            sub: ['남구', '동구', '북구', '광산구', '서구'],
        },
    ];

    const [openCategory, setOpenCategory] = useState(null);

    const handleCategoryClick = (name) => {
        // 1차 카테고리 클릭 시
        setOpenCategory(openCategory === name ? null : name);
        onCategorySelect({
            category_idx: null,
            category_p_name: name,
            category_name: '', // 1차 선택이므로 비움
        });
    };

    return (
        <div className="cnav-container">
            {/* 1차 카테고리 버튼 */}
            <div className="first-category-row">
                {categories.map((cat, idx) => (
                    <button
                        key={idx}
                        className={`first-category-btn ${openCategory === cat.category_p_name ? 'active' : ''}`}
                        style={{
                            backgroundColor: openCategory === cat.category_p_name ? cat.color : '#f1f1f1',
                            color: openCategory === cat.category_p_name ? 'white' : '#333',
                        }}
                        onClick={() => handleCategoryClick(cat.category_p_name)}
                    >
                        {cat.category_p_name}
                    </button>
                ))}
            </div>

            {/* 2차 카테고리 영역 */}
            {categories.map(
                (cat, idx) =>
                    openCategory === cat.category_p_name && (
                        <div key={idx} className="second-category-container">
                            {cat.sub.map((subName, i) => (
                                <div
                                    key={i}
                                    className="second-category-card"
                                    style={{ borderTop: `3px solid ${cat.color}` }}
                                    onClick={() =>
                                        onCategorySelect({
                                            category_idx: i + 1,
                                            category_p_name: cat.category_p_name,
                                            category_name: subName,
                                        })
                                    }
                                >
                                    {subName}
                                </div>
                            ))}
                        </div>
                    ),
            )}
        </div>
    );
};

export default Cnav;
