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
  const [isRoadview, setIsRoadview] = useState(false);
  const [map, setMap] = useState(null);
  const [roadview, setRoadview] = useState(null);
  const [rvClient, setRvClient] = useState(null);

  // 카테고리 상태
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
  const [searchRadius, setSearchRadius] = useState(20000); // 20km

  useEffect(() => {
    const script = document.createElement("script");
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

        const rvContainer = document.getElementById("roadview");
        const roadviewInstance = new window.kakao.maps.Roadview(rvContainer);
        const rvClientInstance = new window.kakao.maps.RoadviewClient();

        setMap(mapInstance);
        setRoadview(roadviewInstance);
        setRvClient(rvClientInstance);

        // 기존 도로 마커 추가 (예시)
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

        // 인포윈도우 생성
        const infowindow = new window.kakao.maps.InfoWindow({zIndex: 1});
      });
    };

    return () => {
      document.head.removeChild(script);
    };
  }, [roads]);

  // 카테고리별 마커 업데이트
  useEffect(() => {
    if (map) {
      const ps = new window.kakao.maps.services.Places();
      const infowindow = new window.kakao.maps.InfoWindow({zIndex: 1});

      // 기존 카테고리 마커 제거
      categoryMarkers.forEach((marker) => marker.setMap(null));
      setCategoryMarkers([]);

      // 카테고리별 키워드 매핑
      const categoryKeywordMapping = {
        hospital: "병원",
        seniorCenter: "노인회관",
        publicInstitution: "공공기관",
        daycare: "어린이집",
        school: "학교",
        touristAttraction: "관광명소",
      };

      // 활성화된 카테고리 필터링
      const selectedCategories = Object.keys(activeCategories).filter(
          (category) => activeCategories[category]
      );

      selectedCategories.forEach((category) => {
        const keyword = categoryKeywordMapping[category];
        if (keyword) {
          // 검색할 중심 좌표와 반경 설정
          const center = map.getCenter();
          const radius = searchRadius; // 설정된 반경 사용

          // 키워드 검색 옵션 설정
          const options = {
            location: center,
            radius: radius,
          };

          // 키워드 검색
          ps.keywordSearch(keyword, (data, status, pagination) => {
            if (status === window.kakao.maps.services.Status.OK) {
              const newMarkers = data.map((place) => {
                const marker = new window.kakao.maps.Marker({
                  map: map,
                  position: new window.kakao.maps.LatLng(place.y, place.x),
                  title: place.place_name,
                  image: getCategoryIcon(category),
                });

                // 마커 클릭 이벤트 등록
                window.kakao.maps.event.addListener(marker, "click", () => {
                  const content = `<div style="padding:5px;font-size:12px;">${place.place_name}<br/>${place.address_name}</div>`;
                  infowindow.setContent(content);
                  infowindow.open(map, marker);
                });

                return marker;
              });

              setCategoryMarkers((prev) => [...prev, ...newMarkers]);

              if (pagination.hasNextPage) {
                pagination.nextPage();
              }
            } else {
              console.error(`키워드 검색 실패: ${status}`);
            }
          }, options);
        }
      });
    }
  }, [activeCategories, map, searchRadius]);

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

  const handleCategoryToggle = (category) => {
    setActiveCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const handleRoadviewToggle = () => {
    if (!isRoadview && rvClient && roadview) {
      const position = map.getCenter();
      rvClient.getNearestPanoId(position, 100, (panoId) => { // 100m 반경 설정
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

  return (
      <div className={styles.roadsrecommend}>

        {/* Content Section */}
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
