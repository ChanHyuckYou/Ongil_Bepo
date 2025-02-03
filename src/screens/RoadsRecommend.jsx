// RoadsRecommend.js
import {useState, useEffect} from "react";
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

// polygon.json을 직접 import
import polygonData from "../../public/data/polygon.json";

const RoadsRecommend = () => {
  // ------------------------------
  // 기존 도로 데이터 예시
  // ------------------------------
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
  useEffect(() => {
    const script = document.createElement("script");
    // 실제 발급받은 AppKey를 사용해야 합니다.
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=08b03f93523dfa3e040fac4f08ce8934&libraries=services&autoload=false`;
    script.async = true;
    document.head.appendChild(script);

    script.onload = () => {
      window.kakao.maps.load(() => {
        const mapContainer = document.getElementById("map");
        const mapOptions = {
          center: new window.kakao.maps.LatLng(37.469055190532536,
              126.80784397139458),
          level: 3,
        };

        const mapInstance = new window.kakao.maps.Map(mapContainer, mapOptions);

        // 교통 정보 오버레이 제거
        mapInstance.removeOverlayMapTypeId(window.kakao.maps.MapTypeId.TRAFFIC);

        // 로드뷰 설정
        const rvContainer = document.getElementById("roadview");
        const roadviewInstance = new window.kakao.maps.Roadview(rvContainer);
        const rvClientInstance = new window.kakao.maps.RoadviewClient();

        setMap(mapInstance);
        setRoadview(roadviewInstance);
        setRvClient(rvClientInstance);

        // 테스트용 도로 마커 생성
        roads.forEach((road) => {
          const marker = new window.kakao.maps.Marker({
            position: new window.kakao.maps.LatLng(37.469055190532536,
                126.80784397139458),
            map: mapInstance,
          });
          window.kakao.maps.event.addListener(marker, "click", () => {
            alert(`${road.rank}: ${road.location}`);
          });
        });
      });
    };

    return () => {
      document.head.removeChild(script);
    };
  }, [roads]);

  // ------------------------------
  // polygon.json 데이터 로드 (import로 이미 로드됨)
  // -> 버튼 클릭 시 상태에 반영
  // ------------------------------
  const handleFetchPolygonData = () => {
    // polygonData가 {"2019":[...], "2020":[...]} 이런 식으로 되어있으므로
    // 여러 연도의 배열을 하나로 합친 뒤 setMultiAccidentAreas
    let combinedAreas = [];
    for (const year in polygonData) {
      combinedAreas = combinedAreas.concat(polygonData[year]);
    }
    setMultiAccidentAreas(combinedAreas);

    // 자동으로 폴리곤 표시
    setShowAccidentPolygons(true);
  };

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

    const infowindow = new window.kakao.maps.InfoWindow({zIndex: 1});

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
                    const content = `
                    <div style="padding:5px;font-size:12px;">
                      ${place.place_name}<br/>${place.address_name}
                    </div>
                  `;
                    infowindow.setContent(content);
                    infowindow.open(map, marker);
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

  // ------------------------------
  // 카테고리별 아이콘 설정
  // ------------------------------
  const getCategoryIcon = (category) => {
    const iconSize = new window.kakao.maps.Size(24, 35);
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

  const handlePolygonToggle = () => {
    setShowAccidentPolygons((prev) => !prev);
  };

  // ------------------------------
  // 렌더링
  // ------------------------------
  return (
      <div className={styles.roadsrecommend}>
        <div className={styles.content}>
          {/* 도로 목록 */}
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

          {/* 지도 컨테이너 */}
          <div className={styles.mapContainer}>
            {/* Controls Section */}
            <div className={styles.controls}>
              {/* 카테고리 버튼 섹션 */}
              <div className={styles.categoryButtons}>
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

              {/* 다발지역 폴리곤 데이터 불러오기 버튼 */}
              <button
                  className={styles.categoryButton}
                  onClick={handleFetchPolygonData}
              >
                폴리곤 데이터 불러오기
              </button>

              {/* 다발지역 폴리곤 표시/숨기기 버튼 */}
              <button
                  className={styles.categoryButton}
                  onClick={handlePolygonToggle}
              >
                {showAccidentPolygons ? "다발지역 숨기기" : "다발지역 보기"}
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
                <label htmlFor="radius">검색 반경: </label>
                <input
                    type="range"
                    id="radius"
                    min="0"
                    max="20000"
                    step="100"
                    value={searchRadius}
                    onChange={(e) => setSearchRadius(Number(e.target.value))}
                />
                <span>{searchRadius}m</span>
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
