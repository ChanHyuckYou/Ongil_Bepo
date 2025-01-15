import styles from '../styles/Navigation.module.css';

const TopNavigation = () => {
  return (
      <div className={styles.topNavi}>
        {/* 배경 */}

        {/* 로고 */}
        <div className={styles.Toplogo}>
          {/* 텍스트 이미지 */}
          <img
              className={styles.logoTxt}
              alt="Logo Text"
              src="/images/logo_txt.png"
          />
          {/* 오른쪽 상단 아이콘 */}
          <img
              className={styles.logoImgIcon}
              alt="Logo Icon"
              src="/images/logo_img.png"
          />
        </div>
      </div>
  );
};

export default TopNavigation;
