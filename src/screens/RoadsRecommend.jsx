// RoadsRecommend.js
import {useState, useEffect} from "react";
import { useLocation } from 'react-router-dom';
import styles from "../styles/RoadsRecommend.module.css";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
  faBaby,
  faBuilding,
  faHospital,
  faLandmark,
  faSchool,
  faUserFriends,
} from "@fortawesome/free-solid-svg-icons";
import {requestRoadFile} from "../components/ApiRoute/roads.jsx"
// polygon.json을 직접 import
import polygonData from "../data/polygon.json";


const RoadsRecommend = () => {
  const location = useLocation();
  const sido = location.state?.sido || "";
  const sigungu = location.state?.sigungu || "";
  const eupmyeondong = location.state?.eupmyeondong || "";
  const log = location.state?.recommendedRoads || [];
  const [roads, setRoads] = useState(log.recommended_roads  || []); // 추천 도로 데이터

  // ------------------------------
  // 결빙사고 다발지역(폴리곤) 데이터
  // ------------------------------
  const [multiAccidentAreas, setMultiAccidentAreas] = useState([]);
  const [showAccidentPolygons, setShowAccidentPolygons] = useState(false);
  const [accidentPolygons, setAccidentPolygons] = useState([]);

  // ------------------------------
  // 지도, 로드뷰 관련
  // ------------------------------
  const [isRoadview, setIsRoadview] = useState(false);
  const [map, setMap] = useState(null);
  const [roadview, setRoadview] = useState(null);
  const [rvClient, setRvClient] = useState(null);

  // ------------------------------
  // 카테고리 상태
  // ------------------------------
  const [activeCategories, setActiveCategories] = useState({
    hospital: false,
    seniorCenter: false,
    publicInstitution: false,
    daycare: false,
    school: false,
    touristAttraction: false,
  });

  // 카테고리별 마커 상태
  const [categoryMarkers, setCategoryMarkers] = useState([]);

  // 검색 반경 상태
  const [searchRadius, setSearchRadius] = useState(20000);

  // ------------------------------
  // 지도 생성 useEffect
  // ------------------------------

  const getRankedColor = (rank) => {
    // HSL 색상 모델을 사용하여 순위에 따른 색상 값 생성
    const hue = 220; // 색상(파란색 계열로 설정)
    const saturation = 100; // 채도 (100%로 설정하여 진한 색)
    const lightness = (rank - 1) * 7 + 30; // 순위가 높을수록 진하고, 1순위는 가장 연한 색, 10순위는 가장 진한 색
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  };

  useEffect(() => {
    const firstRoad = roads[0];
    const [lat, lng] = firstRoad.rep.split(", ").map(Number); // 첫 번째 도로 중심

    const script = document.createElement("script");
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=08b03f93523dfa3e040fac4f08ce8934&libraries=services&autoload=false`;
    script.async = true;
    document.head.appendChild(script);

    script.onload = () => {
      window.kakao.maps.load(() => {
        const mapContainer = document.getElementById("map");
        const mapOptions = {
          center: new window.kakao.maps.LatLng(lat, lng),
          level: 3,
        };
        const mapInstance = new window.kakao.maps.Map(mapContainer, mapOptions);
        mapInstance.setMapTypeId(window.kakao.maps.MapTypeId.SKYVIEW);
        mapInstance.addOverlayMapTypeId(window.kakao.maps.MapTypeId.SKYVIEW); // 위성 지도
        let activeInfoWindow = null;

        // 로드뷰 설정
        const rvContainer = document.getElementById("roadview");
        const roadviewInstance = new window.kakao.maps.Roadview(rvContainer);
        const rvClientInstance = new window.kakao.maps.RoadviewClient();

        setMap(mapInstance);
        setRoadview(roadviewInstance);
        setRvClient(rvClientInstance);

        // 도로 마커 및 폴리라인 생성
        roads.forEach((road, index) => {
          // 시점 및 종점 좌표 추출
          const [startLat, startLng] = road.rbp.split(", ").map(Number);
          const [endLat, endLng] = road.rep.split(", ").map(Number);
          const roadColor = getRankedColor(index + 1); // 순위에 맞는 색상

          // 테두리 (검은색) - 더 두꺼운 선
          const polylineOuter = new window.kakao.maps.Polyline({
            path: [
              new window.kakao.maps.LatLng(startLat, startLng),
              new window.kakao.maps.LatLng(endLat, endLng),
            ],
            strokeWeight: 10, // 테두리 두께
            strokeColor: "white",
            strokeOpacity: 1, // 불투명
            strokeStyle: "solid",
          });

          // 실제 도로 (파스텔 색상) - 위에 덮어씌움
          const polylineInner = new window.kakao.maps.Polyline({
            path: [
              new window.kakao.maps.LatLng(startLat, startLng),
              new window.kakao.maps.LatLng(endLat, endLng),
            ],
            strokeWeight: 8, // 도로 두께
            strokeColor: roadColor, // 랜덤 파스텔 색
            strokeOpacity: 1, // 불투명
            strokeStyle: "solid",
          });

          // 클릭 이벤트 추가
          window.kakao.maps.event.addListener(polylineInner, "click", () => {
            if (activeInfoWindow) {
              activeInfoWindow.close(); // 기존 창 닫기
            }
            const infoWindowContent = `
              <div style="padding:10px; font-size:14px; line-height:1.5; margin-top:10px;">
                <h4 style="margin:0 0 5px 0; font-size:16px; font-weight:bold;">${index + 1}순위</h4>
                <p><strong>도로명:</strong> ${road.road_name}</p>
                <p><strong>결빙 사고 건수:</strong> ${road.acc_occ}</p>
                <p><strong>추천 점수:</strong> ${road.acc_sc}</p>
                <p><strong>경사도</strong> ${road.rd_slope}</p>
              </div>
            `;
            const infoWindow = new window.kakao.maps.InfoWindow({
              position: new window.kakao.maps.LatLng(startLat, startLng),
              content: infoWindowContent,
              map: mapInstance,
              removable: true,
            });
            infoWindow.open(mapInstance); // 마커 기준으로 InfoWindow 열기
            activeInfoWindow = infoWindow; // 현재 열린 창 저장
          });

          // 지도에 추가
          polylineOuter.setMap(mapInstance);
          polylineInner.setMap(mapInstance);

          // 마우스 올렸을 때 선 스타일 변경
          window.kakao.maps.event.addListener(polylineInner, "mouseover", () => {
            polylineOuter.setOptions({
              strokeWeight: 13,
              strokeColor: "white",
              strokeOpacity: 1,
            });
          });

          // 마우스 벗어났을 때 선 스타일 원래대로
          window.kakao.maps.event.addListener(polylineInner, "mouseout", () => {
            polylineOuter.setOptions({
              strokeWeight: 10,
              strokeColor: "white",
              strokeOpacity: 0.7,
            });
          });
        });
      });
    };

    return () => {
      document.head.removeChild(script);
    };
  }, [roads]);

  // ------------------------------
  // "결빙사고 다발지역" 폴리곤 표시 useEffect
  // ------------------------------
  useEffect(() => {
    if (!map) {
      return;
    }

    // 기존 폴리곤 제거
    accidentPolygons.forEach((poly) => poly.setMap(null));
    setAccidentPolygons([]);

    // 새로 폴리곤 생성
    if (showAccidentPolygons) {
      const newPolygons = multiAccidentAreas
      .map((area) => {
        try {
          // area.Polygon 에 있는 GeoJSON 문자열 파싱
          const geojson = JSON.parse(area.Polygon);
          // "Polygon" 타입이라 가정: [ [ [lng, lat], ... ] ] 구조
          const coords = geojson.coordinates[0];

          // kakao.maps.LatLng[] 형태로 변환
          const path = coords.map(
              ([lng, lat]) => new window.kakao.maps.LatLng(lat, lng)
          );

          // 폴리곤 생성
          const polygon = new window.kakao.maps.Polygon({
            path: path,
            strokeWeight: 3,
            strokeColor: "#FF0000",
            strokeOpacity: 0.8,
            strokeStyle: "solid",
            fillColor: "#FFEEEE",
            fillOpacity: 0.6,
          });

          // 지도에 표시
          polygon.setMap(map);

          // 폴리곤 클릭 이벤트
          window.kakao.maps.event.addListener(polygon, "click", () => {
            alert(
                `지점명: ${area.지점명}\n` +
                `사망자수: ${area.사망자수}\n` +
                `사상자수: ${area.사상자수}\n` +
                `중상자수: ${area.중상자수}\n` +
                `경상자수: ${area.경상자수}`
            );
          });

          return polygon;
        } catch (err) {
          console.error("GeoJSON 파싱 오류:", err);
          return null;
        }
      })
      .filter(Boolean);

      setAccidentPolygons(newPolygons);
    }
  }, [map, showAccidentPolygons, multiAccidentAreas]);

  // ------------------------------
  // 카테고리 검색용 ps 객체 생성
  // ------------------------------
  const [ps, setPs] = useState(null);
  useEffect(() => {
    if (map && !ps) {
      setPs(new window.kakao.maps.services.Places());
    }
  }, [map, ps]);

  // ------------------------------
  // 카테고리별 장소 검색 & 마커 표시
  // ------------------------------
  useEffect(() => {
    if (!map || !ps) {
      return;
    }

    const infowindow = new window.kakao.maps.InfoWindow({ zIndex: 1, removable: true, });

    // 기존 카테고리 마커 제거
    categoryMarkers.forEach((marker) => marker.setMap(null));
    setCategoryMarkers([]);

    // 카테고리별 키워드
    const categoryKeywordMapping = {
      hospital: "병원",
      seniorCenter: "노인회관",
      publicInstitution: "공공기관",
      daycare: "어린이집",
      school: "학교",
      touristAttraction: "관광명소",
    };

    // 활성화된 카테고리만 검색
    const selectedCategories = Object.keys(activeCategories).filter(
      (cat) => activeCategories[cat]
    );

    // 각각의 카테고리에 대해 검색
    selectedCategories.forEach((category) => {
      const keyword = categoryKeywordMapping[category];
      if (keyword) {
        const center = map.getCenter();
        const radius = searchRadius;

        const options = {
          location: center,
          radius: radius,
        };

        ps.keywordSearch(
          keyword,
          (data, status, pagination) => {
            if (status === window.kakao.maps.services.Status.OK) {
              const newMarkers = data.map((place) => {
                const marker = new window.kakao.maps.Marker({
                  map: map,
                  position: new window.kakao.maps.LatLng(place.y, place.x),
                  title: place.place_name,
                  image: getCategoryIcon(category),
                });

                // 마커 클릭 이벤트
                window.kakao.maps.event.addListener(marker, "click", () => {
                  // x 버튼을 포함한 HTML 콘텐츠
                  const content = `
                    <div style="position:relative; margin-right:20px; padding:10px; font-size:12px;">
                      장소 : ${place.place_name}<br/> 위치 : ${place.address_name}
                    </div>
                  `;

                  infowindow.setContent(content);
                  infowindow.open(map, marker);

                  // x 버튼 클릭 시 정보창 닫기
                  const closeButton = document.getElementById('close-btn');
                  if (closeButton) {
                    closeButton.addEventListener('click', () => {
                      infowindow.close();
                    });
                  }
                });

                return marker;
              });

              setCategoryMarkers((prev) => [...prev, ...newMarkers]);

              // 페이지가 더 있으면 추가 요청
              if (pagination.hasNextPage) {
                pagination.nextPage();
              }
            } else {
              console.error(`키워드 검색 실패: ${status}`);
            }
          },
          options
        );
      }
    });
  }, [activeCategories, map, ps, searchRadius]);


useEffect(() => {
  setRoads(roads);
}, [roads]);

  // ------------------------------
  // 카테고리별 아이콘 설정
  // ------------------------------
  const getCategoryIcon = (category) => {
    const iconSize = new window.kakao.maps.Size(30, 30);
    let imageSrc = "";

    switch (category) {
      case "hospital":
        imageSrc = "/images/medicine.png";
        break;
      case "seniorCenter":
        imageSrc = "/images/person.png";
        break;
      case "publicInstitution":
        imageSrc = "/images/publicInstitution.png";
        break;
      case "daycare":
        imageSrc = "/images/school.png";
        break;
      case "school":
        imageSrc = "/images/middleschool.png";
        break;
      case "touristAttraction":
        imageSrc = "/images/tourist_attraction.png";
        break;
      default:
        imageSrc = "/icons/default.png";
    }

    return new window.kakao.maps.MarkerImage(imageSrc, iconSize);
  };

  // ------------------------------
  // 이벤트 핸들러
  // ------------------------------
  const handleCategoryToggle = (category) => {
    setActiveCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const handleRoadviewToggle = () => {
    if (!isRoadview && rvClient && roadview && map) {
      const position = map.getCenter();
      rvClient.getNearestPanoId(position, 100, (panoId) => {
        if (panoId) {
          roadview.setPanoId(panoId, position);
          setIsRoadview(true);
        } else {
          alert("해당 위치에 로드뷰 정보가 없습니다.");
        }
      });
    } else {
      setIsRoadview(false);
    }
  };

  // ------------------------------
  // polygon.json 데이터 로드 (import로 이미 로드됨)
  // -> 버튼 클릭 시 상태에 반영
  // ------------------------------
  const handleTogglePolygonData = () => {
    if (!showAccidentPolygons) {
      // 폴리곤을 생성하고 표시할 때
      let combinedAreas = [];
      for (const year in polygonData) {
        combinedAreas = combinedAreas.concat(polygonData[year]);
      }
      setMultiAccidentAreas(combinedAreas);  // 폴리곤 데이터 설정
    }
    // 폴리곤 표시 여부 토글
    setShowAccidentPolygons((prev) => !prev);
  };

  // 파일 요청 함수
  const handleFileRequest = async () => {
    try {
      const result = await requestRoadFile(); // api에서 파일 요청 실행
      alert('파일 요청이 성공적으로 처리되었습니다!'); // 성공 메시지 표시
      console.log(result); // 파일 요청 응답 결과 확인 (필요 시 활용)
    } catch (error) {
      console.error('파일 요청 중 오류 발생:', error);
      // 오류가 발생하면 alert로 에러 메시지 표시
      if (error.response && error.response.data && error.response.data.detail) {
        alert(error.response.data.detail);
      } else {
        alert('파일 요청 중 오류가 발생했습니다.');
      }
    }
  };

  // ------------------------------
  // 렌더링
  // ------------------------------
  return (
      <div className={styles.roadsrecommend}>
          <h1>"{sido} {sigungu} {eupmyeondong}" 추천 결과</h1>
        <div className={styles.content}>
          {/* 도로 목록 */}
          <div className={styles.roadtable}>
            <div className={styles.ListHeader}>
              <span>열선 도로 추천 목록</span>
              <button onClick={handleFileRequest}>파일 요청</button>
            </div>
            <div className={styles.ListItems}>
              {roads.map((road, index) => (
                <div
                  key={index}
                  className={styles.item}
                  onClick={() => {
                    if (!map) return;
                    const [startLat, startLng] = road.rbp.split(", ").map(Number);
                    const moveLatLng = new window.kakao.maps.LatLng(startLat, startLng);
                    map.setCenter(moveLatLng);
                  }}
                  style={{ cursor: "pointer" }} // 클릭 가능하게 스타일 추가
                >
                  <div className={styles.itemContent}>
                    <p>
                      {index + 1}순위 : {road.road_name}
                    </p>
                  </div>
                  <div>결빙가능성 지수 : {parseFloat(road.rd_fr).toFixed(5).replace(/(\.\d*?)0+$/, '$1') || road.rd_fr}</div>
                  <div>경사도 : {road.rd_slope}</div>
                  <div>결빙사고건수 : {road.acc_occ}</div>
                  <div>사고 심각도 : {road.acc_sc}</div>
                  <div>추천 점수 : {parseFloat(road.pred_idx) % 1 === 0
                                 ? parseFloat(road.pred_idx) // 정수이면 그대로 출력
                                 : parseFloat(road.pred_idx).toFixed(5).replace(/(\.\d*?)0+$/, '$1')}</div>
                </div>
              ))}
            </div>
          </div>

          {/* 지도 컨테이너 */}
          <div className={styles.mapContainer}>
            {/* Controls Section */}
            <div className={styles.controls}>
              {/* 카테고리 버튼 섹션 */}
              <div className={styles.categoryButtons}>
                <div className={styles.category}>
                    <button
                        className={`${styles.categoryButton} ${
                            activeCategories.hospital ? styles.active : ""
                        }`}
                        onClick={() => handleCategoryToggle("hospital")}
                        aria-label="병원 카테고리 토글"
                    >
                      <FontAwesomeIcon icon={faHospital}/> 병원
                    </button>
                    <button
                        className={`${styles.categoryButton} ${
                            activeCategories.seniorCenter ? styles.active : ""
                        }`}
                        onClick={() => handleCategoryToggle("seniorCenter")}
                        aria-label="노인회관 카테고리 토글"
                    >
                      <FontAwesomeIcon icon={faUserFriends}/> 노인회관
                    </button>
                    <button
                        className={`${styles.categoryButton} ${
                            activeCategories.publicInstitution ? styles.active : ""
                        }`}
                        onClick={() => handleCategoryToggle("publicInstitution")}
                        aria-label="공공기관 카테고리 토글"
                    >
                      <FontAwesomeIcon icon={faBuilding}/> 공공기관
                    </button>
                </div>
                <div className={styles.category}>
                    <button
                        className={`${styles.categoryButton} ${
                            activeCategories.daycare ? styles.active : ""
                        }`}
                        onClick={() => handleCategoryToggle("daycare")}
                        aria-label="어린이집 카테고리 토글"
                    >
                      <FontAwesomeIcon icon={faBaby}/> 어린이집
                    </button>
                    <button
                        className={`${styles.categoryButton} ${
                            activeCategories.school ? styles.active : ""
                        }`}
                        onClick={() => handleCategoryToggle("school")}
                        aria-label="학교 카테고리 토글"
                    >
                      <FontAwesomeIcon icon={faSchool}/> 학교
                    </button>
                    <button
                        className={`${styles.categoryButton} ${
                            activeCategories.touristAttraction ? styles.active : ""
                        }`}
                        onClick={() => handleCategoryToggle("touristAttraction")}
                        aria-label="관광명소 카테고리 토글"
                    >
                      <FontAwesomeIcon icon={faLandmark}/> 관광명소
                    </button>
                </div>
              </div>
              {/* 다발지역 폴리곤 표시/숨기기 버튼 */}
              <button
                className={styles.categoryButton}
                onClick={handleTogglePolygonData}
              >
                {showAccidentPolygons ? "다발지역 숨기기" : "결빙 사고 다발지역 폴리곤 생성"}
              </button>
              {/* Roadview Toggle Button */}
              <button
                  className={styles.roadviewButton}
                  onClick={handleRoadviewToggle}
                  aria-label="로드뷰 토글 버튼"
              >
                {isRoadview ? "지도 보기" : "로드뷰 보기"}
              </button>

              {/* 검색 반경 슬라이더 */}
              <div className={styles.searchRadius}>
                <span style={{ color: 'white', textShadow: '1px 1px 0px black' }}>검색 반경: </span>
                <input
                    type="range"
                    id="radius"
                    min="0"
                    max="20000"
                    step="100"
                    value={searchRadius}
                    onChange={(e) => setSearchRadius(Number(e.target.value))}
                />
                <span style={{ color: 'white', textShadow: '1px 1px 0px black' }}>{searchRadius}m</span>
              </div>
            </div>

            {/* 지도 */}
            <div
                id="map"
                className={styles.map}
                style={{display: isRoadview ? "none" : "block"}}
            ></div>

            {/* 로드뷰 */}
            <div
                id="roadview"
                className={styles.roadview}
                style={{display: isRoadview ? "block" : "none"}}
            ></div>
          </div>
        </div>
      </div>
  );
};

export default RoadsRecommend;
