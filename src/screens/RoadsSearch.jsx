import styles from '../styles/RoadsSearch.module.css';
import {useState, useEffect} from 'react';

const RoadsSearch = () => {
    const [data, setData] = useState([]);

    // 서버에서 데이터 가져오기
    useEffect(() => {
    const testData = [
      {
        id: 1,
        dong: '효성1동',
      },
      {
        id: 2,
        dong: '계산동',
      },
      {
        id: 3,
        dong: '작전동',
      },
    ];
    setData(testData); // 테스트 데이터를 상태에 설정
    }, []);

  return (
      <div className={styles.roadssearch}>
        <div className={styles.roadsSearchForm}>
          <div className={styles.form}>
              <div className={styles.guideTxt}>열선 도로를 설치할 자치구별 동을 입력해주세요.</div>
              <div className={styles.dup}>
                  <label className={styles.inputTxt}> 동명 입력 :</label>
                    <select className={styles.select}>
                      {data.map((item) => (
                        <option key={item.id} value={item.dong}>{item.dong}</option>
                      ))}
                    </select>
              </div>
              <div className={styles.searchBtn}>검색</div>
          </div>
        </div>
      </div>);
};

export default RoadsSearch;
