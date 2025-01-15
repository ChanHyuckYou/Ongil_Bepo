// pages/index.js
import styles from '../styles/Home.module.css';
import TopNavigation from '../nav/TopNavigation.jsx';
import SideNavigation from '../nav/SideNavigation.jsx';

const Home = () => {
  return (
      <div className={styles.home}>
        <TopNavigation/>
        <SideNavigation/>
        <img className={styles.dashbodeImgIcon} alt=""
             src="/images/dashbode_img.png"/>
        <div className={styles.head}>
          <img className={styles.headIcon} alt="" src="/images/head_icon.png"/>
          <b className={styles.headTxt}>대시보드 홈</b>
          <div className={styles.headLine}/>
        </div>
      </div>
  );
};

export default Home;
