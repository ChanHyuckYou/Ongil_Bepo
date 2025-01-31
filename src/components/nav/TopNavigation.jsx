import styles from '../../styles/Navigation.module.css';

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
              src="/images/logo.png"
          />
        </div>
      </div>
  );
};

export default TopNavigation;
