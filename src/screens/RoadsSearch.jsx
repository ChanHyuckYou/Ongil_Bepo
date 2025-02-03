import styles from '../styles/RoadsSearch.module.css';
import {useState, useEffect} from 'react';
import useNavigations from "../components/Navigation/Navigations.jsx";
import locationData from '../../public/data/locations_nested.json';
import LoadingPage from "../components/spinner/LoadingPage.jsx";

const RoadsSearch = () => {
  const [data, setData] = useState([]);
  const [sido, setSido] = useState('');
  const [sigungu, setSigungu] = useState('');
  const [eupmyeondong, setEupmyeondong] = useState('');

  // 가중치 관련 state
  const [icingWeight, setIcingWeight] = useState('');    // 결빙 가능성 지수
  const [slopeWeight, setSlopeWeight] = useState('');    // 도로별 경사도
  const [trafficWeight, setTrafficWeight] = useState(''); // 교통량 데이터

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

  /**
   * icingWeight, slopeWeight가 둘 다 설정되면
   * 마지막 필드(trafficWeight)를 자동으로 100 - (icing + slope)로 맞춤
   */
  useEffect(() => {
    if (icingWeight > 0 && slopeWeight > 0) {
      const sum = icingWeight + slopeWeight;
      if (sum > 100) {
        alert("결빙 가능성 지수와 경사도의 합이 100을 초과했습니다.");
        setSlopeWeight(0);
      } else {
        setTrafficWeight(100 - sum);
      }
    }
  }, [icingWeight, slopeWeight]);

  // 5단위 선택 (숫자 범위 체크)
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

  // 페이지 이동 실행
  const navigateTo = useNavigations();
  const handleNavigation = () => {
    if (sido && sigungu && eupmyeondong) {
      const sumWeights = icingWeight + slopeWeight + trafficWeight;
      if (sumWeights !== 100) {
        alert(`가중치의 합이 100이 되도록 설정해주세요! (현재: ${sumWeights})`);
        return;
      }
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        navigateTo('RoadsRecommend', {
          sido,
          sigungu,
          eupmyeondong,
          icingWeight,
          slopeWeight,
          trafficWeight
        });
      }, 5000);
    } else {
      alert("모든 주소 필드를 선택해주세요.");
    }
  };

  /**
   * 5 단위 리스트를 미리 만들어서 datalist에 사용
   * 0, 5, 10, ... 100 까지
   */
  const increments = Array.from({length: 21}, (_, i) => i * 5);

  // === 현재 남은 가중치 계산 ===
  const remain = 100 - (icingWeight + slopeWeight + trafficWeight);

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
                      onChange={(e) => setEupmyeondong(e.target.value)}
                      disabled={!sigungu}
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

                {/* 가중치 폼 */}
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
                        value={icingWeight}
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
                        value={slopeWeight}
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
                        value={trafficWeight}
                        onChange={handleTrafficChange}
                    />
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
