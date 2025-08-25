import React, { useState } from 'react';
import '../css/Cnav.css';

const Cnav = ({ regions, onCategorySelect }) => {
    const [openCategory, setOpenCategory] = useState(null);

    // 색상 매핑 (기존 디자인 유지)
    const getColorForRegion = (regionName) => {
        const colorMap = {
            전라남도: '#FF9F43',
            광주광역시: '#16A085',
            제주도: 'BLACK',
        };
        return colorMap[regionName] || '#6c757d'; // 기본 색상
    };

    const handleRegion1Click = (region1) => {
        const isCurrentlyOpen = openCategory === region1.id;

        // 열려있던 것을 클릭하면 닫기, 아니면 열기
        setOpenCategory(isCurrentlyOpen ? null : region1.id);

        // 1차 지역 선택
        onCategorySelect({
            region1Id: region1.id,
            region2Id: null,
            region1Name: region1.name,
            region2Name: '',
        });
    };

    const handleRegion2Click = (region1, region2) => {
        // 2차 지역 선택
        onCategorySelect({
            region1Id: region1.id,
            region2Id: region2.id,
            region1Name: region1.name,
            region2Name: region2.name,
        });
    };

    // 지역 데이터가 아직 로딩 중인 경우
    if (!regions || regions.length === 0) {
        return (
            <div className="cnav-container">
                <div className="first-category-row">
                    <div>지역 정보 로딩 중...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="cnav-container">
            {/* 1차 카테고리 버튼 */}
            <div className="first-category-row">
                {regions.map((region1) => (
                    <button
                        key={region1.id}
                        className={`first-category-btn ${openCategory === region1.id ? 'active' : ''}`}
                        style={{
                            backgroundColor: openCategory === region1.id ? getColorForRegion(region1.name) : '#f1f1f1',
                            color: openCategory === region1.id ? 'white' : '#333',
                        }}
                        onClick={() => handleRegion1Click(region1)}
                    >
                        {region1.name}
                    </button>
                ))}
            </div>

            {/* 2차 카테고리 영역 */}
            {regions.map(
                (region1) =>
                    openCategory === region1.id &&
                    region1.region2s &&
                    region1.region2s.length > 0 && (
                        <div key={region1.id} className="second-category-container">
                            {region1.region2s.map((region2) => (
                                <div
                                    key={region2.id}
                                    className="second-category-card"
                                    style={{
                                        borderTop: `3px solid ${getColorForRegion(region1.name)}`,
                                    }}
                                    onClick={() => handleRegion2Click(region1, region2)}
                                >
                                    {region2.name}
                                </div>
                            ))}
                        </div>
                    ),
            )}
        </div>
    );
};

export default Cnav;
