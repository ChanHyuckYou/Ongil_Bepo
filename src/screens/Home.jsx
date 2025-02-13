import styles from '../styles/Home.module.css';
import React, { useState, useEffect } from 'react';
import WeatherApi from '../components/ApiRoute/WeatherApi.jsx';
import jsonData from "../data/상습결빙구간.json";
import axios from 'axios';

const Home = () => {
  const [text, setText] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState({
    lat: 37.5666791,
    lon: 126.9782914,
  });
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [error, setError] = useState('');
  const [cityName, setCityName] = useState('');
  const [cctvUrl, setCctvUrl] = useState(null); // CCTV 영상 URL 저장
  const [map, setMap] = useState(null);
  const [isSatellite, setIsSatellite] = useState(false); // 지도 타입 상태 관리

  // 현재 날씨 정보 가져오기
  const fetchWeather = async (lat, lon) => {
    try {
      const data = await WeatherApi.getCurrentWeather(lat, lon);
      setWeather(data);
      const city = await WeatherApi.getReverseGeo(lat, lon); // 도시 이름 가져오기
      setCityName(city); // 가져온 도시 이름 상태에 저장
    } catch (err) {
      alert('현재 날씨 정보를 가져올 수 없습니다.');
    }
  };

  const fetch5Weather = async (lat, lon) => {
    try {
      const data = await WeatherApi.getForecast(lat, lon);
      const filteredData = data.list.filter((_, index) => index % 8 === 7);
      setForecast(filteredData);
    } catch (err) {
      alert('5일 예보를 가져올 수 없습니다.');
    }
  };

  const searchCities = async (query) => {
    try {
      const data = await WeatherApi.searchCities(query);
      const filteredData = data.filter((result) => result.country === 'KR'); // KR 필터링
      setSearchResults(filteredData);
    } catch (err) {
      alert('도시를 찾을 수 없습니다.');
    }
  };

  useEffect(() => {
    fetchWeather(selectedLocation.lat, selectedLocation.lon);
    fetch5Weather(selectedLocation.lat, selectedLocation.lon);

    const script = document.createElement("script");
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=08b03f93523dfa3e040fac4f08ce8934&libraries=services&autoload=false`;
    script.async = true;
    script.onload = () => {
      window.kakao.maps.load(() => {
        const container = document.getElementById("kakao-map");
        const options = {
          center: new window.kakao.maps.LatLng(selectedLocation.lat, selectedLocation.lon),
          level: 5,
        };
        const map = new window.kakao.maps.Map(container, options);
        setMap(map);
        let activeInfoWindow = null; // 현재 열려 있는 InfoWindow 저장 변수

        jsonData.forEach((item) => {
          if (item["경로"] && item["경로"].length > 0) {
            const roadPath = item["경로"].map(([lng, lat]) => new window.kakao.maps.LatLng(lat, lng));

            // 파스텔 색상 생성 함수
            const getPastelColor = () => {
              const r = Math.floor(Math.random() * 128 + 127);
              const g = Math.floor(Math.random() * 128 + 127);
              const b = Math.floor(Math.random() * 128 + 127);
              return `rgb(${r}, ${g}, ${b})`;
            };

            // Polyline을 추가하기 전에 두 개의 Polyline을 설정하여 테두리 효과
            const polylineOuter = new window.kakao.maps.Polyline({
              path: roadPath,
              strokeWeight: 6,
              strokeColor: 'black',
              strokeOpacity: 0.7,
              strokeStyle: "solid",
            });

            const polylineInner = new window.kakao.maps.Polyline({
              path: roadPath,
              strokeWeight: 3,
              strokeColor: getPastelColor(),
              strokeOpacity: 0.9,
              strokeStyle: "solid",
            });

            // Polyline을 지도에 추가
            polylineOuter.setMap(map);
            polylineInner.setMap(map);

            // 중간 지점 찾기
            const midIndex = Math.floor(roadPath.length / 2);
            const midPoint = roadPath[midIndex];

            // 클릭 이벤트 추가
            window.kakao.maps.event.addListener(polylineInner, 'click', () => {
              if (activeInfoWindow) {
                activeInfoWindow.close(); // 기존 창 닫기
              }

              // 📌 CCTV 요청 함수 호출
              fetchCCTV(midPoint.getLat(), midPoint.getLng());

              const infoWindowContent = `
                <div style="padding:10px; font-size:14px; line-height:1.5; margin-top:10px;">
                  <h4 style="margin:0 0 5px 0; font-size:16px; font-weight:bold;">${item["도로(노선)명"]}</h4>
                  <p><strong>대표지역:</strong> ${item["대표지역"]}</p>
                  <p><strong>관리청</strong> ${item["관리청"]}</p>
                  <p><strong>도로길이:</strong> ${item["총길이(km)"]} km</p>
                  <button id="cctv-btn" style="  padding: 10px 20px;
                                                 border: 1px solid #ddd;
                                                 border-radius: 5px;
                                                 background-color: #f5f5f5;
                                                 cursor: pointer;">CCTV 보기</button>
                </div>
              `;

              const infoWindow = new window.kakao.maps.InfoWindow({
                position: new window.kakao.maps.LatLng(midPoint.getLat(), midPoint.getLng()),
                content: infoWindowContent,
                removable: true,
              });

              infoWindow.open(map); // 마커 기준으로 InfoWindow 열기
              activeInfoWindow = infoWindow; // 현재 열린 창 저장

              // 📌 CCTV 버튼 이벤트 추가
              setTimeout(() => {
                document.getElementById("cctv-btn").addEventListener("click", () => {
                  fetchCCTV(midPoint.getLat(), midPoint.getLng());
                });
              }, 500);

            });

            // 마우스 올렸을 때 선 스타일 변경
            window.kakao.maps.event.addListener(polylineInner, 'mouseover', () => {
              polylineOuter.setOptions({
                strokeWeight: 8,
                strokeColor: 'black',
                strokeOpacity: 1,
              });
            });

            // 마우스 벗어났을 때 선 스타일 원래대로
            window.kakao.maps.event.addListener(polylineInner, 'mouseout', () => {
              polylineOuter.setOptions({
                strokeWeight: 6,
                strokeColor: 'black',
                strokeOpacity: 0.7,
              });
            });

          }
        });
      });
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [jsonData, selectedLocation]);

  // 지도 타입 토글 함수
  const toggleMapType = () => {
    if (map) {
      const newType = isSatellite ? window.kakao.maps.MapTypeId.ROADMAP : window.kakao.maps.MapTypeId.SKYVIEW;
      map.setMapTypeId(newType);
      setIsSatellite(!isSatellite); // 상태 변경
    }
  };

  // 📌 CCTV API 요청 함수
  const fetchCCTV = async (lat, lng) => {
    const key = 'd55898e517934fcbbaced8fe46f906de';  // API Key
    const minX = (lng - 1).toFixed(6); // 경도 값 (1도 범위로 설정)
    const maxX = (lng + 1).toFixed(6);
    const minY = (lat - 1).toFixed(6); // 위도 값 (1도 범위로 설정)
    const maxY = (lat + 1).toFixed(6);

    const url = `https://openapi.its.go.kr:9443/cctvInfo?apiKey=${key}&type=its&cctvType=2&minX=${minX}&maxX=${maxX}&minY=${minY}&maxY=${maxY}&getType=json`;

    try {
      const response = await axios.get(url);
      const cctvData = response.data.response.data;

      if (cctvData && cctvData.length > 0) {
        // 가장 가까운 CCTV URL을 선택
        const closestCctv = cctvData[3];  // (여기서는 첫 번째 CCTV만 선택)
        setCctvUrl(closestCctv.cctvurl);  // CCTV URL 상태 업데이트
      } else {
        alert("해당 위치의 CCTV 영상을 찾을 수 없습니다.");
      }
    } catch (error) {
      console.error("CCTV 데이터를 가져오는 중 오류 발생:", error);
    }
  };

  const handleInputChange = (e) => {
    const query = e.target.value.trim();
    setText(query);
    if (query.length > 0) {
      searchCities(query);
    } else {
      setSearchResults([]);
    }
  };

  const handleResultClick = (lat, lon) => {
    setSelectedLocation({ lat, lon });
    setText('');
    setSearchResults([]);
  };

  return (
    <div className={styles.home}>
      <div className={styles.search}>
        <input
          type="text"
          value={text}
          onChange={handleInputChange}
          placeholder="도시명을 입력하세요"
          className={styles.input}
        />
        {error && <p>{error}</p>}
        {searchResults.length > 0 && (
          <div className={styles.resultList}>
            <ul>
              {searchResults.map((result, index) => (
                <li
                  key={index}
                  onClick={() => handleResultClick(result.lat, result.lon)}
                  className={styles.resultItem}
                >
                  {result.name}, {result.country}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <div className={styles.dup}>
        <div className={styles.daycurrent}>
          <h2 className="text-xl font-bold">현재 날씨</h2>
          {weather && (
            <div className={styles.current}>
              <h3>{cityName}의 날씨</h3>
              <img
                src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}.png`}
                width="50"
                height="50"
                alt={weather.weather[0].description}
              />
              <p>날씨: {weather.weather[0].description}</p>
              <p>온도: {weather.main.temp}°C</p>
              <p>습도: {weather.main.humidity}%</p>
              <p>강수 확률: {weather.clouds.all}%</p>
            </div>
          )}
        </div>

        <div className={styles.day5}>
          <h2 className="text-xl font-bold">5일간의 날씨 예보</h2>
          {forecast && (
            <ul className={styles.list}>
              {forecast.map((day, index) => {
                const date = new Date(day.dt_txt);
                return (
                  <li key={index} className={styles.item}>
                    <div className={styles.wrapper}>
                      <img
                        src={`http://openweathermap.org/img/wn/${day.weather[0].icon}.png`}
                        width="50"
                        height="50"
                        alt={day.weather[0].description}
                      />
                      <p className={styles.temp}>{`${Math.round(day.main.temp_max)}°C`}</p>
                    </div>
                    <p className={styles.label}>
                      {date.getUTCMonth() + 1}월 {date.getUTCDate()}일
                    </p>
                    <p className={styles.label}>{['일', '월', '화', '수', '목', '금', '토'][date.getUTCDay()]}</p>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>

      {/* 지도 표시 영역 */}
      <h2 className="text-xl font-bold">지역별 상습 결빙 도로</h2>
      <div id="kakao-map" style={{ width: '100%', height: '500px' }}>
        {/* 지도 타입 토글 버튼 */}
        <button
          onClick={toggleMapType}
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            zIndex: 1000,
            padding: "10px 20px",
            border: "1px solid #ccc",
            borderRadius: "5px",
            cursor: "pointer",
            backgroundColor: "#C3E7FA"
          }}
        >
          {isSatellite ? "기본 지도" : "위성 지도"} 보기
        </button>
      </div>

      {/* CCTV 영상 출력 영역 */}
      {cctvUrl && (
        <div style={{ marginTop: "20px" }}>
          <h3>CCTV 영상</h3>
          <video src={cctvUrl} controls autoPlay style={{ width: "600px" }} />
        </div>
      )}
    </div>
  );
};

export default Home;
