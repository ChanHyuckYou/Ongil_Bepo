import useNavigations from "../components/Navigation/Navigations.jsx";
import styles from "../styles/Login.module.css";
import { useState } from "react";
import { checkEmail, sendSignupCode, loginUser } from '../components/ApiRoute/auth.jsx';

const Login = () => {
  const [isSignUpActive, setIsSignUpActive] = useState(false); // 상태 관리
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    managementArea: "",
    department: "",
  });
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  const requestData = {
    email: formData.email,
    password: formData.password,
    confirm_password: formData.confirmPassword,
    name: formData.name,
    jurisdiction: formData.managementArea,
    department: formData.department,
  };

  // 이벤트 핸들러: Sign Up 버튼 클릭
  const handleSignUpClick = () => {
    setIsSignUpActive(true);
  };

  // 이벤트 핸들러: Sign In 버튼 클릭
  const handleSignInClick = () => {
    setIsSignUpActive(false);
  };

  // Input 변경 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (isSignUpActive) {
      setFormData((prev) => ({ ...prev, [name]: value }));
    } else {
      setLoginData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // 페이지 이동 실행
  const navigateTo = useNavigations();
  const handleNavigation = (page) => {
    navigateTo(page);
  };

  // 중복확인 요청
  const handleEmailCheck = async () => {
    try {
      const response = await checkEmail(formData.email);
      alert(response.message);
    } catch (error) {
      alert(error.message || "이메일 중복 확인 오류가 발생했습니다.");
    }
  };

  // 회원가입 이메일 전송
  const handleSendEmail = async () => {
    try {
      const response = await sendSignupCode(requestData);
      alert(response.message);
      handleNavigation("Login"); // 인증 이메일 전송 후 로그인 화면으로 이동
    } catch (error) {
      alert(error.message || "이메일 전송 오류가 발생했습니다.");
    }
  };

  // 회원가입 완료 처리
  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    handleSendEmail();
  };

  // 이메일 형식 검증 함수
  const isValidEmail = (email) => {
    // '@' 뒤에 숫자 포함도 허용하는 정규식
    const emailRegex = /^[^\s@]+@[a-zA-Z0-9]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  // 로그인 처리
  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    // 이메일 형식이 올바른지 확인
    if (!isValidEmail(loginData.email)) {
      alert("잘못된 이메일 형식입니다. 이메일을 다시 확인해주세요.");
      return; // 이메일 형식이 올바르지 않으면 로그인 진행하지 않음
    }
    try {
      const response = await loginUser(loginData.email, loginData.password);
      alert("로그인 성공!");
      handleNavigation("Home"); // 로그인 후 홈 화면으로 이동
    } catch (error) {
      alert(error.message || "로그인 실패");
    }
  };

  return (
    <div className={styles.background}>
      <div
        className={`${styles.container} ${isSignUpActive ? styles["right-panel-active"] : ""}`}
      >
        {/* Sign Up Form */}
        <div className={`${styles.container__form} ${styles["container--signup"]}`}>
          <form className={styles.form} onSubmit={handleSignUpSubmit}>
            <img src="public/images/login_logo.png" className={styles.form__title} />
            <input
              type="text"
              name="name"
              placeholder="Name"
              className={styles.input}
              value={formData.name}
              onChange={handleChange}
              required
            />
            <div className={styles.dup}>
              <input
                type="email"
                name="email"
                placeholder="Email"
                className={styles.input}
                value={formData.email}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className={styles.checkbtn}
                onClick={handleEmailCheck}
              >
                중복확인
              </button>
            </div>
            <input
              type="password"
              name="password"
              placeholder="Password"
              className={styles.input}
              value={formData.password}
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="confirmPassword"
              placeholder="Re-enter password"
              className={styles.input}
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="managementArea"
              placeholder="Local government area"
              className={styles.input}
              value={formData.managementArea}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="department"
              placeholder="Team"
              className={styles.input}
              value={formData.department}
              onChange={handleChange}
              required
            />
            <button type="submit" className={styles.btn}>
              회원가입
            </button>
          </form>
        </div>

        {/* Sign In Form */}
        <div className={`${styles.container__form} ${styles["container--signin"]}`}>
          <form className={styles.form} onSubmit={handleLoginSubmit}>
            <img src="public/images/login_logo.png" className={styles.form__title} />
            <input
              type="email"
              name="email"
              placeholder="Email"
              className={styles.input}
              value={loginData.email}
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              className={styles.input}
              value={loginData.password}
              onChange={handleChange}
              required
            />
            <a
              href="#"
              className={styles.link}
              onClick={() => handleNavigation("Findpwd")}
            >
              Forgot your password?
            </a>
            <button type="submit" className={styles.btn}>
              로그인
            </button>
          </form>
        </div>

        {/* Overlay */}
        <div className={styles.container__overlay}>
          <div className={styles.overlay}>
            <div className={`${styles.overlay__panel} ${styles["overlay--left"]}`}>
              <button className={styles.btn} onClick={handleSignInClick}>
                로그인
              </button>
            </div>
            <div className={`${styles.overlay__panel} ${styles["overlay--right"]}`}>
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
