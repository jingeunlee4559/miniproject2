import { useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Pagination, Navigation } from 'swiper/modules';
import '../../css/Travel.css';

const travelData = [
    {
        id: 1,
        title: '협재 해수욕장',
        address: '제주특별자치도 한림읍',
        distance: '내 위치에서 300km',
        images: [
            'https://api.cdn.visitjeju.net/photomng/imgpath/202408/27/f7057419-8ad8-4fac-8b01-ed1119806687.jpg',
            'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTZSdMK1KWWwvuptHBQUCfnTgDd4PvQOwvvWg&s',
            'https://files.ban-life.com/store/2020/10/1128711602749606.jpg',
        ],
    },
    {
        id: 2,
        title: '제주 한라산 국립공원',
        address: '제주특별자치도 제주시',
        distance: '내 위치에서 270km',
        images: [
            'https://cdn.visitkorea.or.kr/img/call?cmd=VIEW&id=be450627-9341-4953-89a2-a7d35df98936',
            'https://content.r9cdn.net/rimg/dimg/99/29/9c79b80f-lm-73092-164fb26cf00.jpg?width=1366&height=768&xhint=2696&yhint=1846&crop=true',
            'https://media.triple.guide/triple-cms/c_limit,f_auto,h_1024,w_1024/9a62d1a8-c6cc-43da-a988-a1324c8cbb78.jpeg',
        ],
    },

    {
        id: 3,
        title: '천지연폭포',
        address: '제주특별자치도 한림읍',
        distance: '내 위치에서 290km',
        images: [
            'https://i.namu.wiki/i/tEazTDA9aO9pB_5GgKaaXwTTGe3unF-eyBNDGMVyG_HsI2PLQhxIIPTf-Lk_LQlH3IsdfYyfJAkwRIj6Kj8bDg.webp',
            'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQGEYjW0wlHPRYu3aTLNwFMf9K-nnSJHGwIGg&s',
            'https://www.kfoodtimes.com/news/photo/202108/16661_28150_2821.jpg',
        ],
    },

    {
        id: 4,
        title: '성산일출봉',
        address: '제주특별자치도 성산읍',
        distance: '내 위치에서 280km',
        images: [
            'https://file2.nocutnews.co.kr/newsroom/image/2016/07/22/20160722200715664828.jpg',
            'https://api.cdn.visitjeju.net/photomng/imgpath/202312/13/746f66e0-74a4-40f2-9cdc-10ddff4134e7.jpg',
            'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRv7NQW4rVmJWZjstEwUu8jSClWsbG9QSDKLg&s',
        ],
    },
    {
        id: 5,
        title: '제주 우도',
        address: '제주특별자치도 우도면',
        distance: '내 위치에서 270km',
        images: [
            'https://t1.daumcdn.net/brunch/service/user/g16y/image/RUdfBjx_JbDwWyJGlGPjRCzx6G0.jpg',
            'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRY67GlpIREVWnxxnA2X6qDMo6u3KnKGt0cxw&s',
            'https://mblogthumb-phinf.pstatic.net/MjAyMjA1MThfMTkx/MDAxNjUyNzk5NzMxMTg4.2Eav_1HeaKLbmKKBAQ0V0Voo1QzRfSq7P7NIngoJ-b8g.HTXJFFosN-N6ymBn50qFXabm-QKc_2mgzVdHGJYjGokg.JPEG.suk4408/20220223_151311_1.jpg?type=w800',
        ],
    },
];

const TravelSlide = () => {
    const [selectedTravel, setSelectedTravel] = useState(travelData[0]);

    return (
        <div>
            {/* Swiper 슬라이드 */}
            <Swiper
                slidesPerView={travelData.length <= 3 ? travelData.length : 3}
                spaceBetween={16}
                pagination={{ clickable: true }}
                navigation={{
                    nextEl: '.custom-next',
                    prevEl: '.custom-prev',
                }}
                modules={[Pagination, Navigation]}
                className="travel-swiper mb-4"
            >
                {travelData.map((item) => (
                    <SwiperSlide key={item.id}>
                        <div className={`travel-slide ${selectedTravel.id === item.id ? 'active' : ''}`} onClick={() => setSelectedTravel(item)}>
                            <img src={item.images[0]} alt={item.title} className="img-fluid rounded shadow-sm" />
                            <div className="travel-title">{item.title}</div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>

            {/* 커스텀 네비게이션 버튼 */}
            {travelData.length > 3 && (
                <div className="swiper-custom-nav">
                    <button className="custom-prev">〈</button>
                    <button className="custom-next">〉</button>
                </div>
            )}

            {/* 선택한 여행지 상세 */}
            <div className="travel-detail border rounded p-3">
                <h5>
                    {selectedTravel.id}. {selectedTravel.title}
                </h5>
                <p>
                    {selectedTravel.address} | {selectedTravel.distance}
                </p>
                <Row>
                    {selectedTravel.images.map((img, idx) => (
                        <Col key={idx} xs={12} sm={6} md={4} className="mb-3">
                            <img src={img} alt={`detail-${idx}`} className="img-fluid rounded shadow-sm" />
                        </Col>
                    ))}
                </Row>
            </div>
        </div>
    );
};

export default TravelSlide;
