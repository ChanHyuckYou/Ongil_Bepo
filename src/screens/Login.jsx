import styles from '../styles/Login.module.css';
import {useNavigate} from "react-router-dom";

const Login = () => {
  const nav = useNavigate();
  const handleDivClick1 = () => {
    nav("/signup");
  };
  const handleDivClick2 = () => {
    nav("/find-pwd");
  };
  return (
      <div className={styles.login}>
        <div className={styles.signInBg}>
          <div className={styles.signInBtn} onClick={handleDivClick1}>회원가입</div>
        </div>
        <div className={styles.loginBg}>
          <div className={styles.logo}>온길</div>
          <div className={styles.loginForm}>
            <div className={styles.id}>아이디</div>
            <input className={styles.idInput}/>
            <div className={styles.pwd}>비밀번호</div>
            <input className={styles.pwdInput} type="password"/>
            <div className={styles.findPwdBtn} onClick={handleDivClick2}>Forgot
              Password
            </div>
          </div>
          <div className={styles.loginBtn}>로그인</div>
        </div>
      </div>);
};

export default Login;