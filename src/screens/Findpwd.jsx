import styles from '../styles/FindPwd.module.css';

const FindPwd = () => {
  	return (
    		<div className={styles.findPwd}>
      			<div className={styles.responseMessage}>Set_email님의 비밀번호는 response_pwd 입니다 !</div>
      			<div className={styles.submitBtn}>
        				<div className={styles.confrimForm} />
        				<div className={styles.confrimTxt}>Confrim</div>
      			</div>
      			<div className={styles.keyBtn}>
        				<div className={styles.keyForm} />
        				<div className={styles.keyTxt}>인증번호 발송</div>
      			</div>
      			<div className={styles.findPwdForm}>
        				<div className={styles.emailTxt}>이메일</div>
        				<div className={styles.numTxt}>인증번호</div>
        				<div className={styles.emailForm}>
          					<div className={styles.emailInput} />
          					<div className={styles.emailTxt1}>Set_Email</div>
        				</div>
        				<div className={styles.authKeyForm}>
          					<div className={styles.emailInput} />
          					<div className={styles.emailTxt1}>인증번호 입력</div>
        				</div>
      			</div>
      			<div className={styles.title}>비밀번호 찾기</div>
    		</div>);
};

export default FindPwd;
