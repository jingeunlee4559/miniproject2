import React, { useState, useEffect, useRef } from 'react';
import Carousel from 'react-bootstrap/Carousel';
import Modal from 'react-bootstrap/Modal';
import '../css/Carousels3.css';

const getRandomImage = (images, usedImages) => {
    const availableImages = images.filter((image) => !usedImages.has(image));
    if (availableImages.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * availableImages.length);
    return availableImages[randomIndex];
};

const fillImagesToGroup = (images, groupSize) => {
    const result = [...images];
    const usedImages = new Set();

    while (result.length % groupSize !== 0) {
        const randomImage = getRandomImage(images, usedImages);
        if (randomImage) {
            result.push(randomImage);
            usedImages.add(randomImage);
        } else {
            break;
        }
    }

    return groupImages(result, groupSize);
};

const groupImages = (images, groupSize) => {
    let result = [];
    for (let i = 0; i < images.length; i += groupSize) {
        result.push(images.slice(i, i + groupSize));
    }
    return result;
};

// props로 받은 images 사용하도록 수정
const Carousel3 = ({ images }) => {
    const [modalShow, setModalShow] = useState(false);
    const [modalIndex, setModalIndex] = useState(0);
    const [modalImages, setModalImages] = useState([]);
    const [carouselIndexes, setCarouselIndexes] = useState([0]);
    const carouselRefs = useRef([]);

    // props로 받은 images가 없으면 빈 배열 사용
    const displayImages = images && images.length > 0 ? images : [];

    useEffect(() => {
        if (displayImages.length === 0) return;

        const interval = carouselRefs.current[0]
            ? setInterval(() => {
                  carouselRefs.current[0].next();
                  setCarouselIndexes((prev) => [(prev[0] + 1) % fillImagesToGroup(displayImages, 4).length]);
              }, 10000)
            : null;

        return () => interval && clearInterval(interval);
    }, [displayImages]);

    const handleSelect = (selectedIndex) => {
        setCarouselIndexes([selectedIndex]);
    };

    const handleImageClick = (selectedIndex) => {
        setModalImages(displayImages);
        setModalIndex(selectedIndex);
        setModalShow(true);
    };

    const handleModalSelect = (selectedIndex) => {
        setModalIndex(selectedIndex);
    };

    // 이미지가 없으면 메시지 표시
    if (displayImages.length === 0) {
        return (
            <div
                style={{
                    width: '100%',
                    height: '400px',
                    backgroundColor: '#f8f9fa',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '8px',
                }}
            >
                <span style={{ color: '#6c757d' }}>이미지가 없습니다</span>
            </div>
        );
    }

    // 이미지가 1개만 있으면 단순 이미지 표시
    if (displayImages.length === 1) {
        return (
            <div onClick={() => handleImageClick(0)} style={{ cursor: 'pointer' }}>
                <img
                    src={displayImages[0]}
                    alt="여행지 이미지"
                    style={{
                        width: '100%',
                        maxHeight: '400px',
                        objectFit: 'cover',
                        borderRadius: '8px',
                    }}
                />
                <Modal show={modalShow} onHide={() => setModalShow(false)} className="modal-fullscreen" centered>
                    <Modal.Body className="modal-body-fullscreen">
                        <img className="carousel-img-fullscreen" src={displayImages[0]} alt="Modal Image" />
                    </Modal.Body>
                </Modal>
            </div>
        );
    }

    return (
        <>
            <div className="carousel-section">
                <Carousel ref={(el) => (carouselRefs.current[0] = el)} activeIndex={carouselIndexes[0]} onSelect={handleSelect} className="custom-carousel2" interval={10000} fade>
                    {fillImagesToGroup(displayImages, 4).map((group, groupIndex) => (
                        <Carousel.Item key={groupIndex}>
                            <div className="carousel-slide">
                                {group.map((image, imageIndex) => (
                                    <img key={imageIndex} src={image} alt={`Slide ${imageIndex + 1}`} onClick={() => handleImageClick(imageIndex)} />
                                ))}
                            </div>
                        </Carousel.Item>
                    ))}
                </Carousel>
            </div>

            <Modal show={modalShow} onHide={() => setModalShow(false)} className="modal-fullscreen" centered>
                <Modal.Body className="modal-body-fullscreen">
                    <Carousel activeIndex={modalIndex} onSelect={handleModalSelect} className="w-100 h-100">
                        {modalImages.map((image, idx) => (
                            <Carousel.Item key={idx}>
                                <img className="carousel-img-fullscreen" src={image} alt={`Modal Slide ${idx + 1}`} />
                            </Carousel.Item>
                        ))}
                    </Carousel>
                </Modal.Body>
            </Modal>
        </>
    );
};

export default Carousel3;
