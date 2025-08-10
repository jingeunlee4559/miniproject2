import React, { useState, useEffect, useRef } from "react";
import Carousel from "react-bootstrap/Carousel";
import Modal from "react-bootstrap/Modal";
import "../css/Carousels3.css";

const getRandomImage = (images, usedImages) => {
    const availableImages = images.filter(image => !usedImages.has(image));
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

// 1개 여행지에 여러 이미지 하드코딩
const hardcodedCarousel = {
    id: 1,
    images: [
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR8h9gXy-kpIXFkq20g4AoOtyyw5foRbukyqw&sg",
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTpOKPCJNxXNoI1TmjKnlJ19lRkSGZ-XhNpXg&s",
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqGu6e7KrpbZb48CLDgBXqjCgS_UKgq1-xaA&s",
       "https://mblogthumb-phinf.pstatic.net/MjAyMzAzMzBfMjM3/MDAxNjgwMTYxODYxMjc3.WYdoUL38nzHstnAsbeyv8D0-5p8q97ajl56QZpAfos0g.iKV-uf0k4f5kWCoxNlik2ADKW9ROLKlO7nnnvh9XD2Ig.JPEG.iloveknp/%EC%A6%9D%EC%8B%AC%EC%82%AC25.jpg?type=w800",
       "/img/travel1234.png",
    ]
};

const Carousel3 = () => {
    const [modalShow, setModalShow] = useState(false);
    const [modalIndex, setModalIndex] = useState(0);
    const [modalImages, setModalImages] = useState([]);
    const [carouselIndexes, setCarouselIndexes] = useState([0]);
    const carouselRefs = useRef([]);

    // 단일 carousel이므로 배열이 아닌 객체 하나만 사용
    const carousels = [hardcodedCarousel];

    useEffect(() => {
        const interval = carouselRefs.current[0]
            ? setInterval(() => {
                carouselRefs.current[0].next();
                setCarouselIndexes(prev => [(prev[0] + 1) % fillImagesToGroup(carousels[0].images, 4).length]);
            }, 10000)
            : null;

        return () => interval && clearInterval(interval);
    }, [carousels]);

    const handleSelect = (selectedIndex) => {
        setCarouselIndexes([selectedIndex]);
    };

    const handleImageClick = (selectedIndex) => {
        setModalImages(carousels[0].images);
        setModalIndex(selectedIndex);
        setModalShow(true);
    };

    const handleModalSelect = (selectedIndex) => {
        setModalIndex(selectedIndex);
    };

    return (
        <>
            <div className="carousel-section">
                <h2 className="carousel-title">{carousels[0].title}</h2>
                <Carousel
                    ref={el => carouselRefs.current[0] = el}
                    activeIndex={carouselIndexes[0]}
                    onSelect={handleSelect}
                    className="custom-carousel2"
                    interval={10000}
                    fade
                >
                    {fillImagesToGroup(carousels[0].images, 4).map((group, groupIndex) => (
                        <Carousel.Item key={groupIndex}>
                            <div className="carousel-slide">
                                {group.map((image, imageIndex) => (
                                    <img
                                        key={imageIndex}
                                        src={image}
                                        alt={`Slide ${imageIndex + 1}`}
                                        onClick={() => handleImageClick(imageIndex)}
                                    />
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
                                <img
                                    className="carousel-img-fullscreen"
                                    src={image}
                                    alt={`Modal Slide ${idx + 1}`}
                                />
                            </Carousel.Item>
                        ))}
                    </Carousel>
                </Modal.Body>
            </Modal>
        </>
    );
};

export default Carousel3;
