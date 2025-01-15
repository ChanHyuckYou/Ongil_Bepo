import styles from '../styles/Adminpage.module.css';


const Adminpage = () => {
  	return (
    		<div className={styles.adminpage}>
      			<div className={styles.adminContent}>
        				<div className={styles.table} />
        				<div className={styles.approveBtn}>
          					<div className={styles.approveBg} />
          					<b className={styles.approveTxt}>승인</b>
        				</div>
        				<div className={styles.rejectBtn}>
          					<div className={styles.rejectBg} />
          					<b className={styles.approveTxt}>거부</b>
        				</div>
        				<div className={styles.tableTitleLine} />
        				<div className={styles.tableLine} />
        				<b className={styles.loginidTxt}>로그인 ID</b>
        				<b className={styles.b}>관할 구역</b>
        				<b className={styles.b1}>부서</b>
        				<b className={styles.b2}>승인 여부</b>
        				<b className={styles.time}>날짜 및 시간</b>
        				<div className={styles.div}>부천시청</div>
        				<div className={styles.div1}>도시안전관리부</div>
        				<div className={styles.timeValue}>2025-01-09 03:11:26</div>
        				<a className={styles.idValue} href="mailto:nasdjb@mail.korea.kr" target="_blank">nasdjb@mail.korea.kr</a>
      			</div>
      			<div className={styles.head}>
        				<img className={styles.headIcon} alt="" src="head_icon.png" />
        				<b className={styles.headTxt}>[관리자] 각 동별 파일 요청 현황</b>
        				<div className={styles.headLine} />
      			</div>
      			<div className={styles.leftNavi}>
        				<div className={styles.leftNavi1} />
        				<div className={styles.pageSelector}>
          					<img className={styles.selector1Icon} alt="" src="selector1.svg" />
          					<div className={styles.selector2} />
        				</div>
        				<b className={styles.logOutButton}>로그아웃</b>
        				<b className={styles.helpBtn}>문의하기</b>
        				<b className={styles.mypageBtn}>마이페이지</b>
        				<b className={styles.roadsSearchBtn}>열선 도로 추천</b>
        				<b className={styles.boardBtn}>정보 게시판</b>
        				<b className={styles.adminPageBtn}>파일 요청 승인</b>
        				<b className={styles.homeBtn}>대시보드</b>
        				<img className={styles.signOutImgIcon} alt="" src="sign-out_img.png" />
        				<img className={styles.loginImgIcon} alt="" src="login_img.png" />
        				<img className={styles.roadImgIcon} alt="" src="road_img.png" />
        				<img className={styles.boardImgIcon} alt="" src="board_img.png" />
        				<img className={styles.helpImgIcon} alt="" src="help_img.png" />
        				<img className={styles.homeImgIcon} alt="" src="home_img.png" />
        				<img className={styles.adminImgIcon} alt="" src="admin_img.png" />
      			</div>
      			<div className={styles.topNavi}>
        				<div className={styles.topNaviBg} />
        				<div className={styles.logo}>
          					<img className={styles.logoImgIcon} alt="" src="logo_img.png" />
          					<div className={styles.logoTxt}>온길</div>
        				</div>
      			</div>
    		</div>);
};

export default Adminpage;
