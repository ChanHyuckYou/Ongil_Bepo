import styles from '../styles/Inquire.module.css';


const Inquire = () => {
  	return (
    		<div className={styles.inquire}>
      			<div className={styles.inquireView}>
        				<div className={styles.inquireDetail} />
        				<div className={styles.inquireCreateBtn} />
        				<b className={styles.inquireCreate}>작성</b>
        				<div className={styles.bodyLine} />
        				<img className={styles.plusIcon} alt="" src="plus_icon.png" />
        				<div className={styles.inquireList}>
          					<div className={styles.inquireListChild} />
          					<b className={styles.b}>부천시 범박동 열선도로 정보가 잘못되었습니다.</b>
          					<b className={styles.b1}>2025-01-10</b>
          					<b className={styles.id}>ID</b>
          					<b className={styles.updateDay}>문의일</b>
          					<b className={styles.postTxt}>제목</b>
          					<b className={styles.commentBoolTxt}>답변</b>
          					<b className={styles.userIdTxt}>범박동-행정복지부</b>
          					<b className={styles.y}>Y</b>
          					<div className={styles.inquireListItem} />
          					<div className={styles.inquireListInner} />
        				</div>
      			</div>
      			<div className={styles.head}>
        				<img className={styles.headIcon} alt="" src="head_icon.png" />
        				<b className={styles.head1}>나의 문의 내역</b>
        				<div className={styles.headline} />
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

export default Inquire;
