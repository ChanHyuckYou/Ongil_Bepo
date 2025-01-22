import { useState, useEffect } from 'react';
import styles from '../styles/RoadsRecommend.module.css';

const RoadsRecommend = () => {
    // 상태값 정의
    const [roads, setRoads] = useState([ // 임의 데이터 설정
        {
            "rank": "1순위",
            "location": "경기도 수원시 권선구 당수동 수원로 73번길",
            "freezingIndex": 1342,
            "slope": "10%",
            "trafficVolume": 93480
        },
        {
            "rank": "2순위",
            "location": "다른 도로 이름",
            "freezingIndex": 1200,
            "slope": "8%",
            "trafficVolume": 75400
        },
        {
            "rank": "3순위",
            "location": "다른 도로 이름",
            "freezingIndex": 1200,
            "slope": "6%",
            "trafficVolume": 75400
        }
    ]); // 초기값을 임의 데이터로 설정
    const [loading, setLoading] = useState(false); // 로딩 상태

    // 서버에서 데이터를 가져오는 부분은 임시로 생략하고, loading은 false로 설정

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
                                <p className={styles.title}>{road.rank} : {road.location}</p>
                                <button className={styles.itemButton}>주변보호기관</button>
                            </div>
                            <div>결빙예측지수 : {road.freezingIndex}</div>
                            <div>경사도 : {road.slope}</div>
                            <div>교통량 : {road.trafficVolume.toLocaleString()}</div>
                        </div>
                    ))}
                </div>
            </div>
            <div className={styles.map}/>
        </div>
    );
};

export default RoadsRecommend;
