import styles from '../styles/Home.module.css';
import React, { useState, useEffect } from 'react';
import WeatherApi from '../components/ApiRoute/WeatherApi.jsx';
import jsonData from "../data/상습결빙구간.json";

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
      const container = document.getElementById('kakao-map'); // Map container ID
      const options = {
        center: new window.kakao.maps.LatLng(37.5665, 126.9780), // Default: Seoul
        level: 3, // Zoom level (1 to 14)
      };
      const map = new window.kakao.maps.Map(container, options);

      // JSON 데이터를 사용하여 도로를 선으로 표시
      jsonData.forEach(item => {
        const roadPath = [
          new window.kakao.maps.LatLng(item['기점 위도'], item['기점 경도']),
          new window.kakao.maps.LatLng(item['종점 위도'], item['종점 경도'])
        ];

        // Polyline 객체 생성
        const polyline = new window.kakao.maps.Polyline({
          path: roadPath, // 도로의 경로
          strokeWeight: 5, // 선의 두께
          strokeColor: '#FF0000', // 선의 색
          strokeOpacity: 1, // 선의 투명도
          strokeStyle: 'solid' // 선의 스타일
        });

        // 지도에 Polyline 추가
        polyline.setMap(map);
      });
    };

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [selectedLocation]);

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
      <div id="kakao-map" style={{ width: '1000px', height: '700px' }}></div>
    </div>
  );
};

export default Home;
