import useNavigations from "../components/Navigation/Navigations.jsx";
import styles from "../styles/Login.module.css";
import {useState} from "react";

const Login = () => {
  const [isSignUpActive, setIsSignUpActive] = useState(false); // 상태 관리
  // 이벤트 핸들러: Sign Up 버튼 클릭
  const handleSignUpClick = () => {
    setIsSignUpActive(true);
  };

  // 이벤트 핸들러: Sign In 버튼 클릭
  const handleSignInClick = () => {
    setIsSignUpActive(false);
  };

  // Form 제출 방지
  const handleFormSubmit = (e) => {
    e.preventDefault();
  };

  // 페이지 이동 실행
  const navigateTo = useNavigations();
  const handleNavigation = (page) => {
    navigateTo(page);
  };

  return (
      <div className={styles.background}>
        <div
            className={`${styles.container} ${
                isSignUpActive ? styles["right-panel-active"] : ""
            }`}
        >
          {/* Sign Up Form */}
          <div
              className={`${styles.container__form} ${styles["container--signup"]}`}>
            <form action="#" className={styles.form}
                  onSubmit={handleFormSubmit}>
              <h2 className={styles.form__title}>온길</h2>
              <input type="text" placeholder="Name" className={styles.input}/>
              <div className={styles.dup}>
                <input type="email" placeholder="Email"
                       className={styles.input}/>
                <button className={styles.checkbtn}>중복확인</button>
              </div>
              <input type="password" placeholder="Password"
                     className={styles.input}/>
              <input type="password" placeholder="Re-enter password"
                     className={styles.input}/>
              <input type="text" placeholder="Local government area"
                     className={styles.input}/>
              <input type="text" placeholder="Team" className={styles.input}/>
              <button type="submit" className={styles.btn}>
                회원가입
              </button>
            </form>
          </div>

          {/* Sign In Form */}
          <div
              className={`${styles.container__form} ${styles["container--signin"]}`}>
            <form action="#" className={styles.form}
                  onSubmit={handleFormSubmit}>
              <h2 className={styles.form__title}>온길</h2>
              <input type="email" placeholder="Email" className={styles.input}/>
              <input type="password" placeholder="Password"
                     className={styles.input}/>
              <a href="#" className={styles.link}
                 onClick={() => handleNavigation('Findpwd')}>
                Forgot your password?
              </a>
              <button type="submit" className={styles.btn}
                      onClick={() => handleNavigation('Home')}>
                로그인
              </button>
            </form>
          </div>

          {/* Overlay */}
          <div className={styles.container__overlay}>
            <div className={styles.overlay}>
              <div
                  className={`${styles.overlay__panel} ${styles["overlay--left"]}`}>
                <button className={styles.btn} onClick={handleSignInClick}>
                  로그인
                </button>
              </div>
              <div
                  className={`${styles.overlay__panel} ${styles["overlay--right"]}`}>
                <button className={styles.btn} onClick={handleSignUpClick}>
                  회원가입
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default Login;
