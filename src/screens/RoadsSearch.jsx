import styles from '../styles/RoadsSearch.module.css';


const RoadsSearch = () => {
  	return (
    		<div className={styles.roadssearch}>
      			<div className={styles.roadsSearchForm}>
        				<div className={styles.form} />
        				<div className={styles.view} />
        				<div className={styles.guideTxt}>열선 도로를 설치할 자치구별 동을 입력해주세요.</div>
        				<div className={styles.searchBtn}>
          					<div className={styles.searchForm} />
          					<div className={styles.search}>검색</div>
        				</div>
        				<div className={styles.inputTxt}> 동명 입력 :</div>
        				<div className={styles.exTxt}>예) 소월동, 범박동</div>
        				<div className={styles.inputForm} />
      			</div>
      			<div className={styles.head}>
        				<img className={styles.headIcon} alt="" src="head_icon.png" />
        				<b className={styles.headTxt}>열선도로 추천</b>
        				<div className={styles.headLine} />
      			</div>
      			<div className={styles.leftNavi}>
        				<div className={styles.leftNavi1} />
        				<b className={styles.logOutButton}>로그아웃</b>
        				<b className={styles.helpBtn}>문의하기</b>
        				<b className={styles.mypageBtn}>마이페이지</b>
        				<b className={styles.roadsSearchBtn}>열선 도로 추천</b>
        				<b className={styles.boardBtn}>정보 게시판</b>
        				<b className={styles.homeBtn}>대시보드</b>
        				<img className={styles.signOutImgIcon} alt="" src="sign-out_img.png" />
        				<img className={styles.loginImgIcon} alt="" src="login_img.png" />
        				<img className={styles.roadImgIcon} alt="" src="road_img.png" />
        				<img className={styles.boardImgIcon} alt="" src="board_img.png" />
        				<img className={styles.helpImgIcon} alt="" src="help_img.png" />
        				<img className={styles.homeImgIcon} alt="" src="home_img.png" />
      			</div>
      			<div className={styles.topNavi}>
        				<div className={styles.topNaviBg} />
        				<div className={styles.logo}>
          					<img className={styles.logoImgIcon} alt="" src="logo_img.png" />
          					<div className={styles.logoTxt}>온길</div>
        				</div>
      			</div>
      			<div className={styles.pageSelector}>
        				<img className={styles.selector1Icon} alt="" src="selector1.svg" />
        				<div className={styles.selector2} />
      			</div>
    		</div>);
};

export default RoadsSearch;
