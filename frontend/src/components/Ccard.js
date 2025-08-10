import React, { useContext } from 'react';
import { Col, Card, Button } from 'react-bootstrap';
import CartContext from '../components/CartContext';
import '../css/Mcard.css';
import { Link } from 'react-router-dom';
import { faEye, faThumbsUp, faThumbsDown, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Ccard = ({ store_img, store, store_idx, store_info, price, positivePercentage, negativePercentage, reviewCount }) => {
    // const { addToCart } = useContext(CartContext);

    // const handleAddToCart = () => {
    //   const item = { store_img, store, store_idx, store_info, price };
    //   addToCart(item);
    // };

    return (
        <Col xs={12} sm={6} md={6} lg={3} xl={3} className="mb-4">
            <Card className="product-card">
                <Link to={`/Category/${store_idx}`}>
                    <Card.Img variant="top" src={store_img} alt="Product" className="product-image" />
                </Link>
                <Card.Body className="card-body-custom">
                    <Card.Title className="product-title">{store}</Card.Title>
                    <div className="review-container">
                        <span className="review-text">{store_info}</span>
                    </div>
                    <hr className="product-divider" />
                    <div className="product-hover-info">
                        <span>
                            <FontAwesomeIcon icon={faEye} /> {reviewCount}
                        </span>
                        <span>
                            <FontAwesomeIcon icon={faThumbsUp} /> {positivePercentage}%
                        </span>
                        <span>
                            <FontAwesomeIcon icon={faThumbsDown} /> {negativePercentage}%
                        </span>
                    </div>
                </Card.Body>
            </Card>
        </Col>
    );
};

export default Ccard;
