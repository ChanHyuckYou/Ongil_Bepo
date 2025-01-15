import styles from '../styles/Mypage.module.css';


const Mypage = () => {
  	return (
    		<div className={styles.mypage}>
      			<div className={styles.head}>
        				<b className={styles.headTxt}>내 정보 수정</b>
        				<div className={styles.headLine} />
      			</div>
      			<div className={styles.mypageForm}>
        				<div className={styles.board} />
        				<div className={styles.emailTxt}>이메일</div>
        				<div className={styles.pwdTxt}>비밀번호</div>
        				<div className={styles.jurisdictionTxt}>관할 구역</div>
        				<div className={styles.departmentTxt}>부서</div>
        				<div className={styles.submitBtn}>
          					<div className={styles.submitForm} />
          					<div className={styles.confrim}>Confrim</div>
        				</div>
        				<div className={styles.emailInput}>
          					<div className={styles.inputForm} />
          					<div className={styles.setEmail}>Set_Email</div>
        				</div>
        				<div className={styles.departmentBtn}>
          					<div className={styles.inputForm} />
          					<div className={styles.setEmail}>Set_Email</div>
        				</div>
        				<div className={styles.pwdInput}>
          					<div className={styles.inputForm} />
          					<div className={styles.setPwd}>Set_Pwd</div>
        				</div>
        				<div className={styles.jurisdictionBtn}>
          					<div className={styles.inputForm} />
          					<div className={styles.setEmail}>Set_Email</div>
        				</div>
        				<b className={styles.withdrawBtn}>회원 탈퇴</b>
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

export default Mypage;
