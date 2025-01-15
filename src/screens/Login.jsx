import styles from '../styles/Login.module.css';


const Login = () => {
  	return (
    		<div className={styles.login}>
      			<div className={styles.signInBg}>
                      <div className={styles.signBtn}>
                              <div className={styles.signInBtn} />
                              <div className={styles.signIn}>Sign in</div>
                      </div>
      			</div>
      			<div className={styles.loginBg} />
      			<div className={styles.logo}>온길</div>
      			<div className={styles.loginForm}>
        				<div className={styles.idInput} />
        				<div className={styles.pwdInput} />
        				<div className={styles.id}>id</div>
        				<div className={styles.password}>password</div>
      			</div>
      			<div className={styles.loginBtn}>
        				<div className={styles.loginSubmitBg} />
        				<div className={styles.logIn}>Log in</div>
      			</div>
      			<div className={styles.findPwdBtn}>{` 비밀번호 재설정 `}</div>
    		</div>);
};

export default Login;
