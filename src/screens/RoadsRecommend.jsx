import styles from '../styles/RoadsRecommend.module.css';

const RoadsRecommend = () => {
  return (
      <div className={styles.roadsrecommend}>

        <img className={styles.roadviewBtnIcon} alt="" src="roadview_btn.png"/>

        <img className={styles.mapIcon} alt="" src="map.svg"/>
        <div className={styles.recommendTable}>
          <div className={styles.recommendView}/>
          <div className={styles.line1}/>
          <div className={styles.line2}/>
          <div className={styles.line3}/>
          <b className={styles.recommendList}>열선 도로 추천 목록</b>
          <b className={styles.item}>{`1순위 : 원미구 원미1동 원미로   `}</b>
          <div className={styles.item1}>
            <p className={styles.p}>결빙예측지수 : 1342</p>
            <p className={styles.p}>경사도 : 10%</p>
            <p className={styles.p}>교통량 : 93,480</p>
            <p className={styles.p}>&nbsp;</p>
            <p className={styles.p}>&nbsp;</p>
          </div>
          <b className={styles.item2}>2순위 : 오정구 봉오대로</b>
          <div className={styles.item3}>
            <p className={styles.p}>결빙예측지수 : 1342</p>
            <p className={styles.p}>경사도 : 10%</p>
            <p className={styles.p}>교통량 : 93,480</p>
            <p className={styles.p}>&nbsp;</p>
          </div>
          <b className={styles.item4}>3순위 : 소사구 옥길동 연동로</b>
          <div className={styles.item5}>
            <p className={styles.p}>결빙예측지수 : 1342</p>
            <p className={styles.p}>경사도 : 10%</p>
            <p className={styles.p}>교통량 : 93,480</p>
          </div>
          <div className={styles.scrollVar}/>
          <div className={styles.scroll}/>
          <div className={styles.fileBtn}>
            <div className={styles.fileForm}/>
            <b className={styles.fileTxt}>파일 요청</b>
          </div>
          <div className={styles.guard3}>
            <div className={styles.fileForm}/>
            <b className={styles.guardTxt}>주변보호기관</b>
          </div>
          <div className={styles.guard2}>
            <div className={styles.fileForm}/>
            <b className={styles.guardTxt}>주변보호기관</b>
          </div>
          <div className={styles.guard1}>
            <div className={styles.fileForm}/>
            <b className={styles.guardTxt}>주변보호기관</b>
          </div>
        </div>

      </div>);
};

export default RoadsRecommend;
