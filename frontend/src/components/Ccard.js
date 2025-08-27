import React, { useContext } from 'react';
import { Col, Card, Button } from 'react-bootstrap';
import CartContext from '../components/CartContext';
import '../css/Mcard.css';
import { Link } from 'react-router-dom';
import { faEye, faThumbsUp, faThumbsDown, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Ccard = ({ store_img, store, store_idx, store_info, address, viewCount, onViewIncrement, positivePercentage, negativePercentage, reviewCount }) => {
    const handleCardClick = () => {
        // 조회수 증가 함수 호출
        if (onViewIncrement) {
            onViewIncrement();
        }
    };

    return (
        <Col xs={12} sm={6} md={6} lg={3} xl={3} className="mb-4">
            <Card className="product-card">
                <Link to={`/category/${store_idx}`} onClick={handleCardClick} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <Card.Img variant="top" src={store_img || '/img/default-image.jpg'} alt={store} className="product-image" />
                    <Card.Body className="card-body-custom">
                        <Card.Title className="product-title">{store}</Card.Title>
                        <div className="review-container">
                            <span className="review-text">{store_info}</span>
                        </div>
                        {address && (
                            <div className="address-text" style={{ fontSize: '0.8rem', color: '#666', marginBottom: '8px' }}>
                                📍 {address}
                            </div>
                        )}
                        <hr className="product-divider" />
                        <div className="product-hover-info">
                            <span>
                                <FontAwesomeIcon icon={faEye} /> {viewCount || reviewCount || 0}
                            </span>
                            <span>
                                <FontAwesomeIcon icon={faThumbsUp} /> {positivePercentage || 0}%
                            </span>
                            <span>
                                <FontAwesomeIcon icon={faThumbsDown} /> {negativePercentage || 0}%
                            </span>
                        </div>
                    </Card.Body>
                </Link>
            </Card>
        </Col>
    );
};

export default Ccard;
