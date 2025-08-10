import { useState } from 'react';
import React, { useEffect } from 'react';
import '../css/Map.css';

const Map = ({ lat, lon }) => {
    // 맵관련useState
    const [map, setMap] = useState(null);

    // let ClickOverlay = null;
    const { kakao } = window;

    useEffect(() => {
        const mapContainer = document.getElementById('map'); // 지도의 중심좌표
        const mapOption = {
            center: new kakao.maps.LatLng(lat, lon), // 지도의 중심좌표
            level: 2, // 지도의 확대 레벨
        };

        const map = new kakao.maps.Map(mapContainer, mapOption);
        setMap(map);

        let positions = [
            {
                latlng: new kakao.maps.LatLng(lat, lon),
            },
        ];

        // 마커 찍는 함수입니다. (필요)
        for (let i = 0; i < positions.length; i++) {
            var data = positions[i];
            displayMarker(data);
        }

        function displayMarker(data) {
            new kakao.maps.Marker({
                map: map,
                position: data.latlng,
            });
        }
    }, [lat, lon]);

    return (
        <>
            <div className="ssss">
                {/* 카카오맵 */}
                <div id="map" style={{ width: '100%', height: '300px' }}></div>
            </div>
        </>
    );
};

export default Map;
