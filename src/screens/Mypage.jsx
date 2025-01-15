import styles from '../styles/Mypage.module.css';

const Mypage = () => {
  return (
      <div className={styles.mypage}>
        <div className={styles.mypageForm}>
          <div className={styles.board}/>
          <div className={styles.emailTxt}>이메일</div>
          <div className={styles.pwdTxt}>비밀번호</div>
          <div className={styles.jurisdictionTxt}>관할 구역</div>
          <div className={styles.departmentTxt}>부서</div>
          <div className={styles.submitBtn}>
            <div className={styles.submitForm}/>
            <div className={styles.confrim}>Confrim</div>
          </div>
          <div className={styles.emailInput}>
            <div className={styles.inputForm}/>
            <div className={styles.setEmail}>Set_Email</div>
          </div>
          <div className={styles.departmentBtn}>
            <div className={styles.inputForm}/>
            <div className={styles.setEmail}>Set_Email</div>
          </div>
          <div className={styles.pwdInput}>
            <div className={styles.inputForm}/>
            <div className={styles.setPwd}>Set_Pwd</div>
          </div>
          <div className={styles.jurisdictionBtn}>
            <div className={styles.inputForm}/>
            <div className={styles.setEmail}>Set_Email</div>
          </div>
          <b className={styles.withdrawBtn}>회원 탈퇴</b>
        </div>

      </div>);
};

export default Mypage;
