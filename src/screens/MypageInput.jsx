import styles from '../styles/MypageInput.module.css';

const MypageInput = () => {
  return (
      <div className={styles.mypageinput}>
        <div className={styles.mypageForm}>
          <div className={styles.pwdForm}>
              <img className={styles.mypageImgIcon} alt="" src="/images/Mypage_img.png"/>
              <div className={styles.inputform}>
                  <div className={styles.pwdcheckTxt}>기존 비밀번호 확인</div>
                  <input className={styles.inputFuild}/>
                  <div className={styles.okBtn}>확인</div>
              </div>
          </div>
        </div>
      </div>);
};

export default MypageInput;
