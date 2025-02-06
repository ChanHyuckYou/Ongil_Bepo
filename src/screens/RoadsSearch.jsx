import styles from '../styles/RoadsSearch.module.css';
import {useState, useEffect} from 'react';
import useNavigations from "../components/Navigation/Navigations.jsx";
import locationData from '../data/locations_nested.json';
import LoadingPage from "../components/spinner/LoadingPage.jsx";
import { getDistrict, recommendRoads } from "../components/ApiRoute/roads.jsx";
const handleEupmyeondongChange = (e) => {
  const selectedEupmyeondong = e.target.value;
  setEupmyeondong(selectedEupmyeondong);

  if (selectedEupmyeondong) {
    getDistrict(selectedEupmyeondong) // 읍면동 이름을 그대로 전달
      .then(response => {
        alert('응답 받은 데이터: ' + JSON.stringify(response));
      })
      .catch(error => {
        console.error("API 호출 실패:", error);
      });
  }
};
const RoadsSearch = () => {
  const [data, setData] = useState([]);
  const [sido, setSido] = useState('');
  const [sigungu, setSigungu] = useState('');
  const [eupmyeondong, setEupmyeondong] = useState('');

  // 기존 가중치 관련 state (기본 값 20으로 설정)
  const [icingWeight, setIcingWeight] = useState(20);
  const [slopeWeight, setSlopeWeight] = useState(20);
  const [trafficWeight, setTrafficWeight] = useState(20);

  // 사고 관련 state (기본 값 20으로 설정)
  const [accidentCount, setAccidentCount] = useState(20); // 사고발생건수
  const [accidentRate, setAccidentRate] = useState(20); // 사고율

  const [sigunguOptions, setSigunguOptions] = useState([]);
  const [eupmyeondongOptions, setEupmyeondongOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // 초기 데이터 설정
  useEffect(() => {
    setData(locationData);
  }, []);

  // 사고발생건수와 사고율 초기화
  const resetWeights = () => {
    setIcingWeight(0);  // 0으로 초기화
    setSlopeWeight(0);  // 0으로 초기화
    setTrafficWeight(0); // 0으로 초기화
    setAccidentCount(0); // 0으로 초기화
    setAccidentRate(0);  // 0으로 초기화
  };

  // 시도명 변경 시 시군구명 옵션 업데이트
  useEffect(() => {
    if (sido) {
      const selectedSido = data.find(item => item.sido === sido);
      if (selectedSido) {
        const sigunguList = selectedSido.sigungu.map(item => item.sigungu);
        setSigunguOptions(sigunguList);
      } else {
        setSigunguOptions([]);
      }
      setSigungu('');
      setEupmyeondongOptions([]);
      setEupmyeondong('');
    } else {
      setSigunguOptions([]);
      setSigungu('');
      setEupmyeondongOptions([]);
      setEupmyeondong('');
    }
  }, [sido, data]);

  // 시군구명 변경 시 읍면동명 옵션 업데이트
  useEffect(() => {
    if (sido && sigungu) {
      const selectedSido = data.find(item => item.sido === sido);
      if (selectedSido) {
        const selectedSigungu = selectedSido.sigungu.find(
            item => item.sigungu === sigungu
        );
        if (selectedSigungu) {
          const eupmyeondongList = selectedSigungu.eupmyeondong.map(
              item => item.eupmyeondong
          );
          setEupmyeondongOptions(eupmyeondongList);
        } else {
          setEupmyeondongOptions([]);
        }
      } else {
        setEupmyeondongOptions([]);
      }
      setEupmyeondong('');
    } else {
      setEupmyeondongOptions([]);
      setEupmyeondong('');
    }
  }, [sigungu, sido, data]);

  // 가중치의 합이 100을 초과하지 않도록 처리하는 로직
  const updateWeights = () => {
    const sum = icingWeight + slopeWeight + trafficWeight + accidentCount
        + accidentRate;
    if (sum > 100) {
      alert("가중치의 합이 100을 초과했습니다.");
      return false;
    }
    return true;
  };

  // 각 가중치 값의 범위를 0~100으로 제한
  const handleIcingChange = (e) => {
    const value = parseInt(e.target.value || "0", 10);
    if (value < 0 || value > 100) {
      return;
    }
    setIcingWeight(value);
  };

  const handleSlopeChange = (e) => {
    const value = parseInt(e.target.value || "0", 10);
    if (value < 0 || value > 100) {
      return;
    }
    setSlopeWeight(value);
  };

  const handleTrafficChange = (e) => {
    const value = parseInt(e.target.value || "0", 10);
    if (value < 0 || value > 100) {
      return;
    }
    setTrafficWeight(value);
  };

  const handleAccidentCountChange = (e) => {
    const value = parseInt(e.target.value || "0", 10);
    if (value < 0 || value > 100) {
      return;
    }
    setAccidentCount(value);
  };

  // 읍면동
  const handleEupmyeondongChange = (e) => {
     const selectedEupmyeondong = e.target.value;
     setEupmyeondong(selectedEupmyeondong);

     if (selectedEupmyeondong) {
       getDistrict(selectedEupmyeondong) // 읍면동 이름을 그대로 전달
         .then(responseMessage => {
           // 메시지를 받아서 처리 (예: 읍면동이 DB에 존재한다면 성공 처리)
           alert(responseMessage); // 서버에서 받은 메시지 표시
         })
         .catch(error => {
           // 오류 처리 (예: 읍면동이 DB에 없다거나, API 호출 실패 시)
           console.error("API 호출 실패:", error);
         });
     }
   };

  const handleAccidentRateChange = (e) => {
    const value = parseInt(e.target.value || "0", 10);
    if (value < 0 || value > 100) {
      return;
    }
    setAccidentRate(value);
  };

  const navigateTo = useNavigations();
  /* const handleNavigation = () => {
    if (sido && sigungu && eupmyeondong) {
      if (!updateWeights()) {
        return;
      }

      // 사용자 가중치 데이터 준비
      const userWeights = {
        region: `${sido} ${sigungu} ${eupmyeondong}`,
        rd_slope_weight: slopeWeight,
        acc_occ_weight: accidentCount,
        acc_sc_weight: accidentRate,
      };

      // 로딩 상태 시작
      setIsLoading(true);

      // 추천 도로 API 호출
      recommendRoads(userWeights)
        .then((response) => {
          // 도로 추천 데이터 처리
          console.log("추천 도로 데이터:", response);

          setIsLoading(false); // 로딩 종료
          // 결과를 다루는 로직 (예: 추천 도로를 새로운 페이지에서 보여주거나, 현재 페이지에서 업데이트)
          navigateTo('RoadsRecommend', {
            sido,
            sigungu,
            eupmyeondong,
            icingWeight,
            slopeWeight,
            trafficWeight,
            accidentCount,
            accidentRate,
            recommendedRoads: response.recommended_roads, // 추천 도로 데이터 넘기기
          });
        })
        .catch((error) => {
          setIsLoading(false); // 로딩 종료
          console.error("도로 추천 실패:", error);
          alert('도로 추천에 실패했습니다. 다시 시도해주세요.');
        });
    } else {
      alert("모든 주소 필드를 선택해주세요.");
    }
  }; */
  const handleNavigation = () => {
    if (sido && sigungu && eupmyeondong) {
      if (!updateWeights()) {
        return;
      }

      // 사용자 가중치 데이터 준비
      const userWeights = {
        region: `${sido} ${sigungu} ${eupmyeondong}`,
        rd_slope_weight: slopeWeight,
        acc_occ_weight: accidentCount,
        acc_sc_weight: accidentRate,
      };

      // 로딩 상태 시작
      setIsLoading(true);

      // 임시로 추천 도로 데이터를 넣어주는 코드 (테스트용)
      const recommendedRoads = [
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
      ];

      // 로딩 종료 후 페이지 이동
      setIsLoading(false); // 로딩 종료
      navigateTo('RoadsRecommend', {
        sido,
        sigungu,
        eupmyeondong,
        icingWeight,
        slopeWeight,
        trafficWeight,
        accidentCount,
        accidentRate,
        recommendedRoads, // 임시로 넣은 추천 도로 데이터
      });
    } else {
      alert("모든 주소 필드를 선택해주세요.");
    }
  };


  const increments = Array.from({length: 21}, (_, i) => i * 5);

  const remain = 100 - (icingWeight + slopeWeight + trafficWeight
      + accidentCount + accidentRate);

  return (
      <div className={styles.roadssearch}>
        <div className={styles.roadsSearchForm}>
          {isLoading ? (
              <LoadingPage isLoading={isLoading}/>
          ) : (
              <div className={styles.form}>
                <div className={styles.guideTxt}>
                  열선 도로를 설치할 자치구별 동을 입력해주세요.
                </div>

                {/* 시도명 드롭다운 */}
                <div className={styles.dup}>
                  <label className={styles.inputTxt}>시도명:</label>
                  <select
                      className={styles.select}
                      value={sido}
                      onChange={(e) => setSido(e.target.value)}
                  >
                    <option value="">선택하세요</option>
                    {data.map((item, index) => (
                        <option key={index} value={item.sido}>
                          {item.sido}
                        </option>
                    ))}
                  </select>
                </div>

                {/* 시군구명 드롭다운 */}
                <div className={styles.dup}>
                  <label className={styles.inputTxt}>시군구명:</label>
                  <select
                      className={styles.select}
                      value={sigungu}
                      onChange={(e) => setSigungu(e.target.value)}
                      disabled={!sido}
                  >
                    <option value="">선택하세요</option>
                    {sigunguOptions.map((sigunguItem, index) => (
                        <option key={index} value={sigunguItem}>
                          {sigunguItem}
                        </option>
                    ))}
                  </select>
                </div>

                {/* 읍면동명 드롭다운 */}
                <div className={styles.dup}>
                  <label className={styles.inputTxt}>읍면동명:</label>
                  <select
                    className={styles.select}
                    value={eupmyeondong}
                    onChange={(e) => handleEupmyeondongChange(e)} // 이벤트 핸들러 호출
                    disabled={!sigungu} // 시군구가 선택되지 않으면 읍면동을 선택할 수 없도록 비활성화
                  >
                    <option value="">선택하세요</option>
                    {eupmyeondongOptions.map((dongItem, index) => (
                      <option key={index} value={dongItem}>
                        {dongItem}
                      </option>
                    ))}
                  </select>
                </div>

                <p style={{opacity: 0.9}}>
                  * 선택하신 읍면동의 가중치를 적용하여 열선도로를 추천합니다.
                  <span style={{color: 'red'}}>     현재 남은 가중치 : {remain}</span>
                </p>
                {/* 5단위로 선택할 수 있는 리스트(datalist) */}
                <datalist id="increments">
                  {increments.map((val) => (
                      <option key={val} value={val}/>
                  ))}
                </datalist>
                {/* 기존 가중치 필드 (결빙 가능성, 경사도, 교통량) */}
                <div className={styles.weightContainer}>
                  <div className={styles.weightItem}>
                    <label className={styles.weightLabel}>결빙 가능성 지수</label>
                    <input
                        type="number"
                        step="5"
                        min="0"
                        max="100"
                        list="increments"
                        className={styles.weightInput}
                        value={icingWeight === 0 ? '' : icingWeight} // 0이면 빈 값
                        onChange={handleIcingChange}
                    />
                  </div>
                  <div className={styles.weightItem}>
                    <label className={styles.weightLabel}>도로별 경사도</label>
                    <input
                        type="number"
                        step="5"
                        min="0"
                        max="100"
                        list="increments"
                        className={styles.weightInput}
                        value={slopeWeight === 0 ? '' : slopeWeight} // 0이면 빈 값
                        onChange={handleSlopeChange}
                    />
                  </div>
                  <div className={styles.weightItem}>
                    <label className={styles.weightLabel}>교통량 데이터</label>
                    <input
                        type="number"
                        step="5"
                        min="0"
                        max="100"
                        list="increments"
                        className={styles.weightInput}
                        value={trafficWeight === 0 ? ''
                            : trafficWeight} // 0이면 빈 값
                        onChange={handleTrafficChange}
                    />
                  </div>

                  {/* 사고발생건수와 사고율 입력 필드 */}
                  <div className={styles.weightItem}>
                    <label className={styles.weightLabel}>사고발생건수</label>
                    <input
                        type="number"
                        step="5"
                        min="0"
                        max="100"
                        list="increments"
                        className={styles.weightInput}
                        value={accidentCount === 0 ? ''
                            : accidentCount} // 0이면 빈 값
                        onChange={handleAccidentCountChange}
                    />
                  </div>
                  <div className={styles.weightItem}>
                    <label className={styles.weightLabel}>사고율</label>
                    <input
                        type="number"
                        step="5"
                        min="0"
                        max="100"
                        list="increments"
                        className={styles.weightInput}
                        value={accidentRate === 0 ? ''
                            : accidentRate} // 0이면 빈 값
                        onChange={handleAccidentRateChange}
                    />
                  </div>
                </div>

                {/* 초기화 버튼 */}
                <button className={styles.searchBtn} onClick={resetWeights}>
                  가중치 초기화
                </button>

                {/* 검색 버튼 */}
                <div className={styles.searchBtn} onClick={handleNavigation}>
                  검색
                </div>
              </div>
          )}
        </div>
      </div>
  );
};

export default RoadsSearch;
