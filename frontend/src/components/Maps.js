import { useEffect, useState } from 'react';
// import '../css/Map.css';
import '../css/Maps.css';

const Maps = () => {
    const { kakao } = window;
    const [map, setMap] = useState(null);

    useEffect(() => {
        const mapContainer = document.getElementById('map');
        const mapOption = {
            center: new kakao.maps.LatLng(35.94, 127.014),
            level: 8,
        };
        const map = new kakao.maps.Map(mapContainer, mapOption);
        setMap(map);

        const course = [
            { title: '협재 해수욕장', lat: 33.3947, lng: 126.2396 },
            { title: '한라산 국립공원', lat: 33.3617, lng: 126.5292 },
            { title: '천지연 폭포', lat: 33.2472, lng: 126.5544 },
            { title: '성산일출봉', lat: 33.4584, lng: 126.9425 },
            { title: '우도', lat: 33.504, lng: 126.9558 },
        ];

        const positions = course.map((c) => ({
            title: c.title,
            latlng: new kakao.maps.LatLng(c.lat, c.lng),
        }));

        const overlays = [];

        positions.forEach((pos, idx) => {
            function createMarkerImage(number) {
                const canvas = document.createElement('canvas');
                canvas.width = 40;
                canvas.height = 40;
                const ctx = canvas.getContext('2d');

                // 원
                ctx.fillStyle = '#ff5a5f';
                ctx.beginPath();
                ctx.arc(20, 20, 20, 0, Math.PI * 2);
                ctx.fill();

                // 숫자
                ctx.fillStyle = '#fff';
                ctx.font = 'bold 16px Arial';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(number, 20, 20);

                return new kakao.maps.MarkerImage(canvas.toDataURL(), new kakao.maps.Size(40, 40));
            }

            // 사용
            const marker = new kakao.maps.Marker({
                map,
                position: pos.latlng,
                image: createMarkerImage(idx + 1),
            });
            // 2. 커스텀 오버레이
            const content = document.createElement('div');
            content.className = 'custom-overlay';
            content.innerHTML = `
                <div class="overlay-content">
                    <span class="close-btn">&times;</span>
                    <h4>${pos.title}</h4>
                
                </div>
            `;
            const overlay = new kakao.maps.CustomOverlay({
                position: pos.latlng,
                content: content,
                yAnchor: 1,
            });

            overlays.push(overlay);

            // 3. 마커 클릭 시 오버레이 표시
            kakao.maps.event.addListener(marker, 'click', () => {
                overlays.forEach((ov) => ov.setMap(null));
                overlay.setMap(map);
            });

            // 4. 닫기 버튼 클릭 시 오버레이 숨김
            content.querySelector('.close-btn').addEventListener('click', () => {
                overlay.setMap(null);
            });
        });

        // 5. 코스 연결선
        const polyline = new kakao.maps.Polyline({
            path: positions.map((p) => p.latlng),
            strokeWeight: 4,
            strokeColor: '#FF0000',
            strokeOpacity: 0.7,
            strokeStyle: 'solid',
        });
        polyline.setMap(map);

        // 6. 지도 중심 조정
        const bounds = new kakao.maps.LatLngBounds();
        positions.forEach((pos) => bounds.extend(pos.latlng));
        map.setBounds(bounds);
    }, []);

    return (
        <div className="ssss">
            <div id="map" style={{ width: '100%', height: '500px' }}></div>
        </div>
    );
};

export default Maps;
