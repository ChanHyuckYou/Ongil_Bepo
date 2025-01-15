import styles from '../styles/Board.module.css';


const Board = () => {
  	return (
    		<div className={styles.board}>
      			<div className={styles.boardListView} />
      			<div className={styles.searchInput} />
      			<div className={styles.searchForm}>
        				<div className={styles.searchBtn} />
        				<b className={styles.searchTxt}>검색</b>
      			</div>
      			<div className={styles.filterForm}>
        				<div className={styles.filterBtn} />
        				<b className={styles.filterTxt}>제목        ↓</b>
      			</div>
      			<div className={styles.boardChild} />
      			<div className={styles.createForm}>
        				<div className={styles.searchBtn} />
        				<b className={styles.createTxt}>작성</b>
        				<img className={styles.plusIcon} alt="" src="plus_icon.png" />
      			</div>
      			<div className={styles.boardListForm}>
        				<div className={styles.boardItem} />
        				<b className={styles.b}>부천시 범박동 열선도로 설치 후기</b>
        				<b className={styles.b1}>2025-01-10</b>
        				<b className={styles.boradAuthor}>작성자</b>
        				<b className={styles.updateDay}>게시일</b>
        				<b className={styles.boardName}>제목</b>
        				<b className={styles.b2}>조회수</b>
        				<b className={styles.b3}>범박동-행정복지부</b>
        				<b className={styles.b4}>456</b>
        				<div className={styles.boardListFormChild} />
        				<div className={styles.boardListFormItem} />
      			</div>
      			<div className={styles.head}>
        				<img className={styles.headIcon} alt="" src="head_icon.png" />
        				<b className={styles.headTxt}>정보 게시판</b>
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

export default Board;
