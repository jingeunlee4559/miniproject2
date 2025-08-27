import React from 'react';
import { Container, Row, Col, ListGroup } from 'react-bootstrap';

const InfoSection = ({ info }) => {
    // 왼쪽 고정 항목들 - DB의 일반 필드들
    const leftItems = [
        { label: '주소', value: info?.address || '정보 없음' },
        { label: '이용시간', value: info?.openingHours || '정보 없음' },
        { label: '휴일', value: info?.holiday || '정보 없음' },
        { label: '주차', value: info?.parkingAvailable || '정보 없음' },
        { label: '입장료', value: info?.fee || '무료' },
    ];

    // 왼쪽 고정 칼럼과 중복되는 키들 (제외할 항목들)
    const excludeKeys = ['주소', '이용시간', '휴일', '주차', '입장료', '주차요금'];

    // extraInfo 키들의 우선순위 정의 (중요한 것부터)
    const keyPriority = {
        '문의 및 안내': 1,
        홈페이지: 2,
        이용요금: 3,
        시설이용료: 4,
        '체험 프로그램': 5,
        체험프로그램: 5,
        '체험가능 연령': 6,
        화장실: 7,
        이용가능시설: 8,
        주요시설: 9,
        '판매 품목': 10,
        지정현황: 11,
        접근로: 12,
        출입통로: 13,
        '장애인 주차 안내': 14,
        엘리베이터: 15,
        휠체어: 16,
        '보조견 동반': 17,
        '점자 블록': 18,
        '안내 요원': 19,
    };

    // 오른쪽 동적 항목들 - extraInfo에서 가져온 데이터
    const getRightItems = () => {
        if (!info?.extraInfo || typeof info.extraInfo !== 'object') {
            return [{ label: '추가 정보', value: '정보 없음' }];
        }

        // extraInfo 객체의 키-값 쌍을 배열로 변환하고 우선순위로 정렬
        return Object.entries(info.extraInfo)
            .filter(([key, value]) => {
                // 왼쪽 고정 칼럼과 중복되는 키들 제외
                if (excludeKeys.includes(key)) return false;
                // 빈 값들 제외
                return formatValue(value) !== null;
            })
            .map(([key, value]) => ({
                label: key,
                value: formatValue(value),
                priority: keyPriority[key] || 999, // 정의되지 않은 키는 맨 뒤로
            }))
            .sort((a, b) => a.priority - b.priority);
    };

    // 값을 포맷팅하는 함수
    const formatValue = (value) => {
        if (!value || value === null || value === undefined) {
            return null;
        }

        const strValue = String(value).trim();

        // 빈 값이나 의미없는 값들 제거
        if (!strValue || strValue === '-' || strValue === 'null') {
            return null;
        }

        return strValue;
    };

    // 전화번호인지 확인하는 함수
    const isPhoneNumber = (str) => {
        return /^(\d{2,3}-\d{3,4}-\d{4}|\d{3}-\d{4}-\d{4}|\d{10,11})$/.test(str.replace(/\s/g, ''));
    };

    // 긴 텍스트인지 확인하는 함수 (50자 이상)
    const isLongText = (str) => {
        return typeof str === 'string' && str.length > 50;
    };

    // 값을 렌더링하는 함수
    const renderValue = (value, label) => {
        if (!value) return <span style={{ color: '#999' }}>정보 없음</span>;

        // 전화번호 처리 (클릭 시 전화걸기)
        if (isPhoneNumber(value)) {
            const cleanNumber = value.replace(/[^0-9]/g, '');
            return (
                <a
                    href={`tel:${cleanNumber}`}
                    style={{ color: '#000', textDecoration: 'none' }}
                    onMouseOver={(e) => (e.target.style.textDecoration = 'underline')}
                    onMouseOut={(e) => (e.target.style.textDecoration = 'none')}
                >
                    {value}
                </a>
            );
        }

        // 긴 텍스트 처리 (접기/펼치기)
        if (isLongText(value)) {
            return <LongTextRenderer text={value} />;
        }

        // 모든 텍스트를 검정색으로 통일
        return <span style={{ color: '#000' }}>{value}</span>;
    };

    const rightItems = getRightItems();

    return (
        <Container fluid className="my-4">
            <Row>
                {/* 왼쪽: 고정 정보 */}
                <Col md={6}>
                    <ListGroup variant="flush">
                        {leftItems.map((item, idx) => (
                            <ListGroup.Item
                                key={idx}
                                className="d-flex justify-content-between align-items-start px-0 py-2"
                                style={{ border: 'none', borderBottom: idx < leftItems.length - 1 ? '1px solid #f0f0f0' : 'none' }}
                            >
                                <strong style={{ minWidth: '70px', color: '#555', fontSize: '0.9rem' }}>{item.label}</strong>
                                <div style={{ textAlign: 'right', flex: 1, marginLeft: '15px', fontSize: '0.9rem' }}>{renderValue(item.value, item.label)}</div>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                </Col>

                {/* 오른쪽: 동적 정보 (extraInfo) */}
                <Col md={6}>
                    {rightItems.length > 0 && rightItems[0].value !== '정보 없음' ? (
                        <ListGroup variant="flush">
                            {rightItems.map((item, idx) => (
                                <ListGroup.Item
                                    key={idx}
                                    className="d-flex justify-content-between align-items-start px-0 py-2"
                                    style={{ border: 'none', borderBottom: idx < rightItems.length - 1 ? '1px solid #f0f0f0' : 'none' }}
                                >
                                    <strong style={{ minWidth: '70px', color: '#555', fontSize: '0.9rem' }}>{item.label}</strong>
                                    <div style={{ textAlign: 'right', flex: 1, marginLeft: '15px', fontSize: '0.9rem' }}>{renderValue(item.value, item.label)}</div>
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    ) : (
                        <div className="text-center text-muted py-4">
                            <small>추가 정보가 제공되지 않습니다.</small>
                        </div>
                    )}
                </Col>
            </Row>
        </Container>
    );
};

// 긴 텍스트를 접기/펼치기 기능과 함께 렌더링하는 컴포넌트
const LongTextRenderer = ({ text }) => {
    const [isExpanded, setIsExpanded] = React.useState(false);
    const shortText = text.substring(0, 50) + '...';

    return (
        <div>
            <span>{isExpanded ? text : shortText}</span>
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                style={{
                    background: 'none',
                    border: 'none',
                    color: '#007bff',
                    cursor: 'pointer',
                    padding: '0 5px',
                    fontSize: '0.8rem',
                    textDecoration: 'underline',
                }}
            >
                {isExpanded ? '접기' : '더보기'}
            </button>
        </div>
    );
};

export default InfoSection;
