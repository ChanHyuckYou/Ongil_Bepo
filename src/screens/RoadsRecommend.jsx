import { useState, useEffect } from 'react';
import styles from '../styles/RoadsRecommend.module.css';

const RoadsRecommend = () => {
    // 상태값 정의
    const [roads, setRoads] = useState([
        {
            rank: "1순위",
            location: "원미구 원미1동 원미로321312321312",
            freezingIndex: 1342,
            slope: "10%",
            trafficVolume: 93480
        },
        {
            rank: "2순위",
            location: "다른 도로 이름",
            freezingIndex: 1200,
            slope: "8%",
            trafficVolume: 75400
        },
        {
            rank: "3순위",
            location: "다른 도로 이름",
            freezingIndex: 1200,
            slope: "6%",
            trafficVolume: 75400
        }
    ]); // 초기값을 임의 데이터로 설정
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // 카카오맵 API 로드
        const script = document.createElement('script');
        script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=08b03f93523dfa3e040fac4f08ce8934&autoload=false`;
        script.async = true;
        document.head.appendChild(script);

        script.onload = () => {
            window.kakao.maps.load(() => {
                const container = document.getElementById('map'); // 맵을 렌더링할 DOM
                const options = {
                    center: new window.kakao.maps.LatLng(37.5665, 126.9780), // 서울 중심 좌표
                    level: 3 // 확대 레벨
                };

                const map = new window.kakao.maps.Map(container, options);

                // 도로 데이터 기반 마커 추가
                roads.forEach((road) => {
                    const marker = new window.kakao.maps.Marker({
                        position: new window.kakao.maps.LatLng(37.5665, 126.9780), // 실제 도로 좌표 필요
                        map: map
                    });

                    // 마커 클릭 이벤트
                    window.kakao.maps.event.addListener(marker, 'click', () => {
                        alert(`${road.rank}: ${road.location}`);
                    });
                });
            });
        };

        return () => {
            document.head.removeChild(script); // 컴포넌트 언마운트 시 스크립트 제거
        };
    }, [roads]);

    return (
        <div className={styles.roadsrecommend}>
            <div className={styles.roadtable}>
                <div className={styles.ListHeader}>
                    <span>열선 도로 추천 목록</span>
                    <button>파일요청</button>
                </div>
                <div className={styles.ListItems}>
                    {roads.map((road, index) => (
                        <div key={index} className={styles.item}>
                            <div className={styles.itemContent}>
                                <p>{road.rank} : {road.location}</p>
                                <button className={styles.itemButton}>상세보기</button>
                            </div>
                            <div>결빙예측지수 : {road.freezingIndex}</div>
                            <div>경사도 : {road.slope}</div>
                            <div>교통량 : {road.trafficVolume.toLocaleString()}</div>
                        </div>
                    ))}
                </div>
            </div>
            <div id="map" className={styles.map}/> {/* 카카오맵이 렌더링될 DOM */}
        </div>
    );
};

export default RoadsRecommend;
