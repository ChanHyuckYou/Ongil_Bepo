import styles from '../styles/Signup.module.css';


const Signup = () => {
  	return (
    		<div className={styles.signup}>
      			<div className={styles.title}>Sign Up</div>
      			<div className={styles.signupForm}>
        				<div className={styles.emailInput} />
        				<div className={styles.pwdInput} />
        				<div className={styles.emailTxt}>이메일</div>
        				<div className={styles.pwdTxt}>비밀번호</div>
        				<div className={styles.jurisdictionInput} />
        				<div className={styles.jurisdictionTxt}>관할 구역</div>
        				<div className={styles.signupFormChild} />
        				<div className={styles.pwdcheckInput} />
        				<div className={styles.departmentTxt}>부서</div>
        				<div className={styles.pwdcheckTxt}>비밀번호 확인</div>
      			</div>
      			<div className={styles.submitBtn}>
        				<div className={styles.confrimForm} />
        				<div className={styles.confrimTxt}>Confrim</div>
      			</div>
      			<div className={styles.checkBtn}>
        				<div className={styles.checkFrom} />
        				<div className={styles.checkTxt}>중복확인</div>
      			</div>
    		</div>);
};

export default Signup;
