import styles from '../styles/RoadsRecommend.module.css';


const RoadsRecommend = () => {
  	return (
    		<div className={styles.roadsrecommend}>
      			<img className={styles.roadviewBtnIcon} alt="" src="roadview_btn.png" />
      			<div className={styles.head}>
        				<img className={styles.headIcon} alt="" src="head_icon.png" />
        				<b className={styles.headTxt}>열선도로 추천</b>
        				<div className={styles.headLine} />
        				<div className={styles.subtitleTxt}>열선 추천 도로를 표시합니다.</div>
      			</div>
      			<img className={styles.mapIcon} alt="" src="map.svg" />
      			<div className={styles.recommendTable}>
        				<div className={styles.recommendView} />
        				<div className={styles.line1} />
        				<div className={styles.line2} />
        				<div className={styles.line3} />
        				<b className={styles.recommendList}>열선 도로 추천 목록</b>
        				<b className={styles.item}>{`1순위 : 원미구 원미1동 원미로   `}</b>
        				<div className={styles.item1}>
          					<p className={styles.p}>결빙예측지수 : 1342</p>
          					<p className={styles.p}>경사도 : 10%</p>
          					<p className={styles.p}>교통량 : 93,480</p>
          					<p className={styles.p}>&nbsp;</p>
          					<p className={styles.p}>&nbsp;</p>
        				</div>
        				<b className={styles.item2}>2순위 : 오정구 봉오대로</b>
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
        				<div className={styles.scrollVar} />
        				<div className={styles.scroll} />
        				<div className={styles.fileBtn}>
          					<div className={styles.fileForm} />
          					<b className={styles.fileTxt}>파일 요청</b>
        				</div>
        				<div className={styles.guard3}>
          					<div className={styles.fileForm} />
          					<b className={styles.guardTxt}>주변보호기관</b>
        				</div>
        				<div className={styles.guard2}>
          					<div className={styles.fileForm} />
          					<b className={styles.guardTxt}>주변보호기관</b>
        				</div>
        				<div className={styles.guard1}>
          					<div className={styles.fileForm} />
          					<b className={styles.guardTxt}>주변보호기관</b>
        				</div>
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

export default RoadsRecommend;
