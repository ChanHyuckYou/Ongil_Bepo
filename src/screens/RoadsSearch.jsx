import styles from '../styles/RoadsSearch.module.css';

const RoadsSearch = () => {
  return (
      <div className={styles.roadssearch}>

        <div className={styles.roadsSearchForm}>
          <div className={styles.form}/>
          <div className={styles.view}/>
          <div className={styles.guideTxt}>열선 도로를 설치할 자치구별 동을 입력해주세요.</div>
          <div className={styles.searchBtn}>
            <div className={styles.searchForm}/>
            <div className={styles.search}>검색</div>
          </div>
          <div className={styles.inputTxt}> 동명 입력 :</div>
          <div className={styles.exTxt}>예) 소월동, 범박동</div>
          <div className={styles.inputForm}/>
        </div>


      </div>);
};

export default RoadsSearch;
