import styles from '../styles/Home.module.css';

const SideNavigation = () => {
  return (
      <div className={styles.leftNavi}>
        <div className={styles.leftNavi1}/>
        <div className={styles.pageSelector}>
          <img className={styles.selector1Icon} alt=""
               src="/images/selector1.svg"/>
          <div className={styles.selector2}/>
        </div>
        <b className={styles.logOutButton}>로그아웃</b>
        <b className={styles.helpBtn}>문의하기</b>
        <b className={styles.mypageBtn}>마이페이지</b>
        <b className={styles.roadsSearchBtn}>열선 도로 추천</b>
        <b className={styles.boardBtn}>정보 게시판</b>
        <b className={styles.homeBtn}>대시보드</b>
        <img className={styles.signOutImgIcon} alt=""
             src="/images/sign-out_img.png"/>
        <img className={styles.loginImgIcon} alt=""
             src="/images/login_img.png"/>
        <img className={styles.roadImgIcon} alt="" src="/images/road_img.png"/>
        <img className={styles.boardImgIcon} alt=""
             src="/images/board_img.png"/>
        <img className={styles.helpImgIcon} alt="" src="/images/help_img.png"/>
        <img className={styles.homeImgIcon} alt="" src="/images/home_img.png"/>
      </div>
  );
};

export default SideNavigation;
