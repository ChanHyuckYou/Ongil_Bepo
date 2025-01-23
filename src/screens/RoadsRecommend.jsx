import {useState, useEffect} from "react";
import styles from "../styles/RoadsRecommend.module.css";

const RoadsRecommend = () => {
  const [roads, setRoads] = useState([
    {
      rank: "1순위",
      location: "원미구 원미1동 원미로321312321312",
      freezingIndex: 1342,
      slope: "10%",
      trafficVolume: 93480,
    },
    {
      rank: "2순위",
      location: "다른 도로 이름",
      freezingIndex: 1200,
      slope: "8%",
      trafficVolume: 75400,
    },
    {
      rank: "3순위",
      location: "다른 도로 이름",
      freezingIndex: 1200,
      slope: "6%",
      trafficVolume: 75400,
    },
  ]);

  const [isRoadview, setIsRoadview] = useState(false); // 지도와 로드뷰 전환 상태
  const [map, setMap] = useState(null); // 카카오맵 객체
  const [roadview, setRoadview] = useState(null); // 로드뷰 객체
  const [rvClient, setRvClient] = useState(null); // 로드뷰 클라이언트

  useEffect(() => {
    const script = document.createElement("script");
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=08b03f93523dfa3e040fac4f08ce8934&libraries=services&autoload=false`;
    script.async = true;
    document.head.appendChild(script);

    script.onload = () => {
      window.kakao.maps.load(() => {
        const mapContainer = document.getElementById("map");
        const mapOptions = {
          center: new window.kakao.maps.LatLng(37.5665, 126.9780), // 서울 중심
          level: 3,
        };

        // 지도 생성
        const map = new window.kakao.maps.Map(mapContainer, mapOptions);

        // 로드뷰 생성
        const rvContainer = document.getElementById("roadview");
        const roadview = new window.kakao.maps.Roadview(rvContainer);
        const rvClient = new window.kakao.maps.RoadviewClient();

        setMap(map);
        setRoadview(roadview);
        setRvClient(rvClient);

        // 지도에 마커 추가
        roads.forEach((road) => {
          const marker = new window.kakao.maps.Marker({
            position: new window.kakao.maps.LatLng(37.5665, 126.9780), // 실제 도로 좌표 필요
            map: map,
          });

          // 마커 클릭 이벤트
          window.kakao.maps.event.addListener(marker, "click", () => {
            alert(`${road.rank}: ${road.location}`); // 마커 클릭 시 메시지만 표시
          });
        });
      });
    };

    return () => {
      document.head.removeChild(script);
    };
  }, [roads]);

  const handleRoadviewToggle = () => {
    // 로드뷰 활성화 시 특정 좌표로 로드뷰 설정
    if (!isRoadview && rvClient && roadview) {
      const position = map.getCenter(); // 지도 중심 좌표 가져오기
      rvClient.getNearestPanoId(position, 50, (panoId) => {
        if (panoId) {
          roadview.setPanoId(panoId, position); // 로드뷰 위치 설정
          setIsRoadview(true); // 로드뷰 활성화
        } else {
          alert("해당 위치에 로드뷰 정보가 없습니다.");
        }
      });
    } else {
      setIsRoadview(false); // 지도 보기로 전환
    }
  };

  return (
      <div id="container" className={styles.roadsrecommend}>
        <div className={styles.roadtable}>
          <div className={styles.ListHeader}>
            <span>열선 도로 추천 목록</span>
            <button>파일요청</button>
          </div>
          <div className={styles.ListItems}>
            {roads.map((road, index) => (
                <div key={index} className={styles.item}>
                  <div className={styles.itemContent}>
                    <p>
                      {road.rank} : {road.location}
                    </p>
                    <button className={styles.itemButton}>상세보기</button>
                  </div>
                  <div>결빙예측지수 : {road.freezingIndex}</div>
                  <div>경사도 : {road.slope}</div>
                  <div>교통량 : {road.trafficVolume.toLocaleString()}</div>
                </div>
            ))}
          </div>
        </div>

        {/* 지도 */}
        <div id="map" className={styles.map}
             style={{display: isRoadview ? "none" : "block"}}></div>

        {/* 로드뷰 */}
        <div id="roadview" className={styles.roadview}
             style={{display: isRoadview ? "block" : "none"}}></div>

        {/* 버튼 */}
        <button className={styles.roadviewButton}
                onClick={handleRoadviewToggle}>
          {isRoadview ? "지도 보기" : "로드뷰 보기"}
        </button>
      </div>

  );
};

export default RoadsRecommend;
