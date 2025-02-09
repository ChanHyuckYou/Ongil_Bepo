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
  const [sigunguCode, setSigunguCode] = useState(0);

  // 기존 가중치 관련 state (기본 값 20으로 설정)
  const [icingWeight, setIcingWeight] = useState(50);
  const [slopeWeight, setSlopeWeight] = useState(50);

  // 사고 관련 state (기본 값 20으로 설정)
  const [accidentCount, setAccidentCount] = useState(50); // 사고발생건수
  const [accidentRate, setAccidentRate] = useState(50); // 사고율

  const [sigunguOptions, setSigunguOptions] = useState([]);
  const [eupmyeondongOptions, setEupmyeondongOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // 초기 데이터 설정
  useEffect(() => {
    setData(locationData);
  }, []);

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

  // 각 가중치 값의 범위를 0~100으로 제한
  const handleWeightChange = (setter) => (e) => {
    const value = parseInt(e.target.value || "0", 10);
    if (value < 0 || value > 100) {
      return;
    }
    setter(value);
  };

  // 읍면동
  const handleEupmyeondongChange = (e) => {
    const selectedEupmyeondong = e.target.value;
    setEupmyeondong(selectedEupmyeondong);

    if (selectedEupmyeondong && sigungu) {
      // 선택된 시군구에서 sigungu_code 찾기
      const selectedSido = data.find(item => item.sido === sido);
      const selectedSigungu = selectedSido?.sigungu.find(item => item.sigungu === sigungu);
      const sigunguCode = selectedSigungu?.sigungu_code; // 시군구 코드
      setSigunguCode(selectedSigungu?.sigungu_code);

      if (sigunguCode) {
        getDistrict(selectedEupmyeondong, sigunguCode) // 읍면동 + 시군구 코드 전달
          .then(responseMessage => {
            alert(responseMessage);
          })
          .catch(error => {
            console.error("API 호출 실패:", error);
          });
      } else {
        alert("시군구 코드 정보를 찾을 수 없습니다.");
      }
    }
  };


  const navigateTo = useNavigations();
  const handleNavigation = () => {
    if (sido && sigungu && eupmyeondong) {

      // 모든 값이 0일 경우 25씩 할당하여 100 만들기
      let weights = [icingWeight, slopeWeight, accidentCount, accidentRate];
      const allZero = weights.every(weight => weight === 0);

      let newIcingWeight = icingWeight;
      let newSlopeWeight = slopeWeight;
      let newAccidentCount = accidentCount;
      let newAccidentRate = accidentRate;

      if (allZero) {
        newIcingWeight = 25;
        newSlopeWeight = 25;
        newAccidentCount = 25;
        newAccidentRate = 25;
      } else {
        const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
        if (totalWeight > 0) {
          const scale = 100 / totalWeight;
          newIcingWeight = icingWeight * scale;
          newSlopeWeight = slopeWeight * scale;
          newAccidentCount = accidentCount * scale;
          newAccidentRate = accidentRate * scale;
        }
      }
      // 사용자 가중치 데이터 준비
      const userWeights = {
        sigungu: sigunguCode,
        region: `${eupmyeondong}`,
        freezing_weight: newIcingWeight,
        rd_slope_weight: newSlopeWeight,
        acc_occ_weight: newAccidentCount,
        acc_sc_weight: newAccidentRate,
      };
      // 로딩 상태 시작
      setIsLoading(true);

      // 추천 도로 API 호출
      recommendRoads(userWeights)
        .then((response) => {
          setIsLoading(false); // 로딩 종료
          console.log(response)
          navigateTo('RoadsRecommend', { sido: sido, sigungu: sigungu, eupmyeondong: eupmyeondong, recommendedRoads: response });
        })
        .catch((error) => {
          setIsLoading(false); // 로딩 종료
          console.error("도로 추천 실패:", error);
          alert('도로 추천에 실패했습니다. 다시 시도해주세요.');
        });
    } else {
      alert("모든 주소 필드를 선택해주세요.");
    }
  };


  const increments = Array.from({length: 21}, (_, i) => i * 5);

  return (
      <div className={styles.roadssearch}>
        <div className={styles.roadsSearchForm}>
          {isLoading ? (
              <LoadingPage isLoading={isLoading}/>
          ) : (
              <div className={styles.form}>
                <h2>
                  열선 도로를 설치할 자치구별 동을 입력해주세요.
                </h2>

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

                <p style={{opacity: 0.9 }}>
                  * 중요도 비율을 지정하신대로 열선도로를 추천합니다.
                  <span style={{color: 'red'}}></span>
                </p>
                {/* 0~100 사이의 숫자를 바 형태로 늘리며 선택할 수 있는 필드 */}
                <div className={styles.weightContainer}>
                  <div className={styles.weightItem}>
                    <label className={styles.weightLabel}>결빙 가능성 지수</label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={icingWeight || 0} // 0이면 가장 왼쪽에 위치하도록 설정
                      onChange={handleWeightChange(setIcingWeight)}
                      className={styles.weightRange}
                    />
                    <span>{icingWeight || 0}</span> {/* 선택된 숫자 표시 */}
                  </div>
                  <div className={styles.weightItem}>
                    <label className={styles.weightLabel}>도로별 경사도</label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={slopeWeight || 0} // 0이면 가장 왼쪽에 위치하도록 설정
                      onChange={handleWeightChange(setSlopeWeight)}
                      className={styles.weightRange}
                    />
                    <span>{slopeWeight || 0}</span> {/* 선택된 숫자 표시 */}
                  </div>

                  {/* 사고발생건수와 사고율 입력 필드 */}
                  <div className={styles.weightItem}>
                    <label className={styles.weightLabel}>사고발생건수</label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={accidentCount || 0} // 0이면 가장 왼쪽에 위치하도록 설정
                      onChange={handleWeightChange(setAccidentCount)}
                      className={styles.weightRange}
                    />
                    <span>{accidentCount || 0}</span> {/* 선택된 숫자 표시 */}
                  </div>
                  <div className={styles.weightItem}>
                    <label className={styles.weightLabel}>사고심각도</label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={accidentRate || 0} // 0이면 가장 왼쪽에 위치하도록 설정
                      onChange={handleWeightChange(setAccidentRate)}
                      className={styles.weightRange}
                    />
                    <span>{accidentRate || 0}</span> {/* 선택된 숫자 표시 */}
                  </div>
                </div>
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
