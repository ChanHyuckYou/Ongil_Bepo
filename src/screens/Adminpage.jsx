import styles from '../styles/Adminpage.module.css';

const Adminpage = () => {
  return (
      <div className={styles.adminpage}>
        <div className={styles.adminContent}>
          <div className={styles.table}/>
          <div className={styles.approveBtn}>
            <div className={styles.approveBg}/>
            <b className={styles.approveTxt}>승인</b>
          </div>
          <div className={styles.rejectBtn}>
            <div className={styles.rejectBg}/>
            <b className={styles.approveTxt}>거부</b>
          </div>
          <div className={styles.tableTitleLine}/>
          <div className={styles.tableLine}/>
          <b className={styles.loginidTxt}>로그인 ID</b>
          <b className={styles.b}>관할 구역</b>
          <b className={styles.b1}>부서</b>
          <b className={styles.b2}>승인 여부</b>
          <b className={styles.time}>날짜 및 시간</b>
          <div className={styles.div}>부천시청</div>
          <div className={styles.div1}>도시안전관리부</div>
          <div className={styles.timeValue}>2025-01-09 03:11:26</div>
          <a className={styles.idValue} href="mailto:nasdjb@mail.korea.kr"
             target="_blank">nasdjb@mail.korea.kr</a>
        </div>

      </div>);
};

export default Adminpage;
