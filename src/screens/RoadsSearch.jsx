import styles from '../styles/RoadsSearch.module.css';
import {useState, useEffect} from 'react';
import useNavigations from "../components/Navigation/Navigations.jsx";
import locationData from '../../public/data/locations_nested.json'; // JSON 데이터 가져오기
import LoadingPage from "../components/loading/LoadingPage.jsx"; // LoadingPage 컴포넌트 가져오기

const RoadsSearch = () => {
  const [data, setData] = useState([]);
  const [sido, setSido] = useState('');
  const [sigungu, setSigungu] = useState('');
  const [eupmyeondong, setEupmyeondong] = useState('');
  const [sigunguOptions, setSigunguOptions] = useState([]);
  const [eupmyeondongOptions, setEupmyeondongOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태 추가

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

  // 페이지 이동 실행
  const navigateTo = useNavigations();
  const handleNavigation = () => {
    if (sido && sigungu && eupmyeondong) {
      setIsLoading(true); // 로딩 시작
      setTimeout(() => {
        setIsLoading(false); // 5초 후 로딩 종료
        navigateTo('RoadsRecommend', {sido, sigungu, eupmyeondong});
      }, 5000);
    } else {
      alert("모든 필드를 선택해주세요.");
    }
  };

  return (
      <div className={styles.roadssearch}>
        <div className={styles.roadsSearchForm}>
          {isLoading ? (
              <LoadingPage isLoading={isLoading}/> // 로딩 페이지 표시
          ) : (
              <div className={styles.form}>
                <div className={styles.guideTxt}>열선 도로를 설치할 자치구별 동을 입력해주세요.
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
