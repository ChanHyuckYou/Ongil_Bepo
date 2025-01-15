import styles from '../styles/MypageInput.module.css';

const MypageInput = () => {
  return (
      <div className={styles.mypageinput}>

        <div className={styles.head}>
          <b className={styles.headTxt}>내 정보 수정</b>
          <div className={styles.headLine}/>
        </div>
        <div className={styles.mypageForm}>
          <div className={styles.pwdForm}/>
          <div className={styles.inputFuild}/>
          <div className={styles.okBtn}>
            <div className={styles.okBg}/>
            <b className={styles.okTxt}>확인</b>
          </div>
          <b className={styles.pwdcheckTxt}>기존 비밀번호 확인</b>
          <img className={styles.mypageImgIcon} alt="" src="Mypage_img.png"/>
        </div>
      </div>);
};

export default MypageInput;
