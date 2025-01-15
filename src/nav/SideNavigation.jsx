import styles from '../styles/Navigation.module.css';

const SideNavigation = () => {
  return (
      <div className={styles.leftNavi}>
        {/* 상단 연결 버튼 */}
        <div className={`${styles.navItem} ${styles.topNavItem}`}>
          <img
              src="/images/home_img.png"
              alt="대시보드"
          />
          <b>대시보드</b>
        </div>

        <div className={`${styles.navItem} ${styles.topNavItem}`}>
          <img
              src="/images/road_img.png"
              alt="열선 도로 추천"
          />
          <b>열선 도로 추천</b>
        </div>

        <div className={`${styles.navItem} ${styles.topNavItem}`}>
          <img
              src="/images/board_img.png"
              alt="정보 게시판"
          />
          <b>정보 게시판</b>
        </div>

        {/* 하단 추가 버튼 */}
        <div className={`${styles.navItem} ${styles.bottomNavItem}`}>
          <img
              src="/images/login_img.png"
              alt="마이페이지"
          />
          <b>마이페이지</b>
        </div>

        <div className={`${styles.navItem}`}>
          <img
              src="/images/sign-out_img.png"
              alt="로그아웃"
          />
          <b>로그아웃</b>
        </div>

        <div className={`${styles.navItem}`}>
          <img
              src="/images/help_img.png"
              alt="문의하기"
          />
          <b>문의하기</b>
        </div>
      </div>
  );
};

export default SideNavigation;
