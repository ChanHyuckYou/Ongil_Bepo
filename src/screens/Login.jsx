import useNavigations from "../components/Navigation/Navigations.jsx";
import styles from "../styles/Login.module.css";
import { useState } from "react";
import {
  checkEmail,
  sendSignupCode,
  loginUser,
} from "../components/ApiRoute/auth.jsx";
import PrivacyPolicy from '../data/PrivacyPolicy.jsx';
import PersonalDataPolicy from '../data/PersonalDataPolicy.jsx';

const Login = () => {
  const [isSignUpActive, setIsSignUpActive] = useState(false); // 상태 관리
  const [isAgreementChecked, setIsAgreementChecked] = useState({
          terms: false, // 약관 동의
          privacy: false, // 개인정보 처리방침 동의
        });

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirm_password: "", // confirmPassword에서 confirm_password로 변경
    jurisdiction: "", // managementArea에서 jurisdiction으로 변경
    department: "",
  });

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState(""); // 오류 메시지 상태

  // 이벤트 핸들러: Sign Up 버튼 클릭
  const handleSignUpClick = () => {
    setIsSignUpActive(true);
    setError("");
  };

  // 이벤트 핸들러: Sign In 버튼 클릭
  const handleSignInClick = () => {
    setIsSignUpActive(false);
    setError("");
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

  // 이메일 중복 확인 요청
  const handleEmailCheck = async () => {
    try {
      const result = await checkEmail(formData.email);
      alert(result.message || "사용 가능한 이메일입니다.");
    } catch (err) {
      alert(err.detail || err.message || "이메일 확인에 실패했습니다.");
    }
  };

  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    setError(""); // 에러 초기화

    // 비밀번호와 확인 비밀번호 일치 여부 확인
    if (formData.password !== formData.confirm_password) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      // 1. 이메일 중복 확인
      await checkEmail(formData.email);

      // 2. 인증 코드 전송
      await sendSignupCode(formData);
      alert("인증 코드가 이메일로 전송되었습니다. 이메일을 확인해주세요.");
      setIsSignUpActive(false); // 이메일 인증 후 로그인 화면으로 전환
    } catch (err) {
      console.error("회원가입 에러:", err);
      let errorMessage = "회원가입에 실패했습니다.";
      if (err.detail) {
        if (Array.isArray(err.detail)) {
          errorMessage = err.detail.map((d) => d.msg).join(", ");
        } else if (typeof err.detail === "string") {
          errorMessage = err.detail;
        }
      } else if (err.message) {
        errorMessage = typeof err.message === "string" ? err.message : JSON.stringify(err.message);
      }

      setError(errorMessage);
    }
  };

  // 이메일 형식 검증 함수
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // 로그인 처리
  const handleSignInSubmit = async (e) => {
    e.preventDefault();

    if (!isValidEmail(loginData.email)) {
      alert("잘못된 이메일 형식입니다. 이메일을 다시 확인해주세요.");
      return;
    }
    try {
      const response = await loginUser(loginData.email, loginData.password);
      alert("로그인 성공!");
      handleNavigation("Home");
    } catch (error) {
      alert(error.message || "로그인 실패");
    }
  };

  // 체크박스 상태 변경 핸들러
  const handleAgreementChange = (e) => {
    const { name, checked } = e.target;
    setIsAgreementChecked((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };
  const [showAgreementScreen, setShowAgreementScreen] = useState(true); // 약관 동의 화면 활성화 상태 추가

  return (
      <div className={styles.background}>
        <div
          className={`${styles.container} ${isSignUpActive ? styles["right-panel-active"] : ""}`}
        >
          {/* 약관 동의 화면 */}
          {showAgreementScreen && !Object.values(isAgreementChecked).every(Boolean) ? (
                <div className={`${styles.container__form} ${styles["container--signup"]}`}>
                  <form className={styles.form}>
                    <img src="/images/login_logo.png" className={styles.form__title} alt="Logo" />
                    {/* 이용약관 박스 */}
                    <div className={styles.Agreebox}>
                        <div className={styles.termsBox}>
                          <h3>이용약관</h3>
                          <div className={styles.box}>
                                <PrivacyPolicy />
                          </div>
                        </div>
                        <div className={styles.agreement}>
                          <input
                            type="checkbox"
                            id="terms"
                            name="terms"
                            checked={isAgreementChecked.terms}
                            onChange={handleAgreementChange}
                          />
                          <label>이용 약관에 동의합니다.</label>
                        </div>

                        {/* 개인정보 수집 및 활용 박스 */}
                        <div className={styles.termsBox}>
                          <h3>개인정보 수집 및 활용</h3>
                          <div className={styles.box}>
                              <PersonalDataPolicy />
                          </div>
                        </div>
                        <div className={styles.agreement}>
                          <input
                            type="checkbox"
                            id="privacy"
                            name="privacy"
                            checked={isAgreementChecked.privacy}
                            onChange={handleAgreementChange}
                          />
                          <label >개인정보 처리방침에 동의합니다.</label>
                        </div>
                    </div>
                  </form>
                </div>
          ) : (
            // 회원가입 폼
            <div className={`${styles.container__form} ${styles["container--signup"]}`}>
              <form className={styles.form} onSubmit={handleSignUpSubmit}>
                <img src="/images/login_logo.png" className={styles.form__title} />
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
                  name="confirm_password"
                  placeholder="Re-enter password"
                  className={styles.input}
                  value={formData.confirm_password}
                  onChange={handleChange}
                  required
                />
                <input
                  type="text"
                  name="jurisdiction"
                  placeholder="Local government area"
                  className={styles.input}
                  value={formData.jurisdiction}
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
                {error && <p className={styles.error}>{error}</p>}
                <button type="submit" className={styles.btn}>
                  회원가입
                </button>
              </form>
            </div>
          )}


        {/* Sign In Form */}
        <div className={`${styles.container__form} ${styles["container--signin"]}`}>
          <form className={styles.form} onSubmit={handleSignInSubmit}>
            <img src="/images/login_logo.png" className={styles.form__title} />
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
            {error && <p className={styles.error}>{error}</p>}
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
