// components/TopNavigation.js
import styles from '../styles/Home.module.css';

const TopNavigation = () => {
  return (
      <div className={styles.topNavi}>
        <div className={styles.topNaviBg}/>
        <div className={styles.logo}>
          <img className={styles.logoImgIcon} alt=""
               src="/images/logo_img.png"/>
          <div className={styles.logoTxt}>온길</div>
        </div>
      </div>
  );
};

export default TopNavigation;
