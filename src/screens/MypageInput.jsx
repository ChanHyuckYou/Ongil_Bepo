import styles from '../styles/MypageInput.module.css';


const MypageInput = () => {
  	return (
    		<div className={styles.mypageinput}>
      			<div className={styles.head}>
        				<b className={styles.headTxt}>내 정보 수정</b>
        				<div className={styles.headLine} />
      			</div>
      			<div className={styles.mypageForm}>
        				<div className={styles.pwdForm} />
        				<div className={styles.inputFuild} />
        				<div className={styles.okBtn}>
          					<div className={styles.okBg} />
          					<b className={styles.okTxt}>확인</b>
        				</div>
        				<b className={styles.pwdcheckTxt}>기존 비밀번호 확인</b>
        				<img className={styles.mypageImgIcon} alt="" src="Mypage_img.png" />
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
        				<div className={styles.pageSelector}>
          					<img className={styles.selector1Icon} alt="" src="selector1.svg" />
          					<div className={styles.selector2} />
        				</div>
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

export default MypageInput;
