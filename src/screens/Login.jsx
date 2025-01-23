import useNavigations from "../components/Navigation/Navigations.jsx";
import styles from "../styles/Login.module.css";
import { useState } from "react";

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

  // 회원가입 요청
  const handleSignUpSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://127.0.0.1:8000/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (response.ok) {
        alert(result.message || "회원가입에 성공했습니다.");
        setFormData({
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
          managementArea: "",
          department: "",
        });
        setIsSignUpActive(false); // 로그인 화면으로 전환
      } else {
        alert(result.detail || "회원가입에 실패했습니다.");
      }
    } catch (error) {
      console.error("회원가입 오류:", error);
      alert("서버 오류가 발생했습니다.");
    }
  };

  // 로그인 요청
  const handleSignInSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://127.0.0.1:8000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData),
      });

      const result = await response.json();
      if (response.ok) {
        localStorage.setItem("access_token", result.access_token);
        setLoginData({ email: "", password: "" }); // 입력 필드 초기화
        handleNavigation("Home"); // 홈 페이지로 이동
      } else {
        alert(result.detail || "로그인에 실패했습니다.");
      }
    } catch (error) {
      console.error("로그인 오류:", error);
      alert("서버 오류가 발생했습니다.");
    }
  };

  // 이메일 중복 확인 요청
  const handleEmailCheck = async () => {
    try {
      const response = await fetch(
          `http://127.0.0.1:8000/auth/check-email?email=${formData.email}`,
          {
            method: "GET",
          }
      );
      const result = await response.json();
      if (response.ok) {
        alert("사용 가능한 이메일입니다.");
      } else {
        alert(result.detail || "이미 사용 중인 이메일입니다.");
      }
    } catch (error) {
      console.error("중복 확인 오류:", error);
      alert("서버 오류가 발생했습니다.");
    }
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
              className={`${styles.container__form} ${styles["container--signup"]}`}
          >
            <form className={styles.form} onSubmit={handleSignUpSubmit}>
              <h2 className={styles.form__title}>온길</h2>
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
          <div
              className={`${styles.container__form} ${styles["container--signin"]}`}
          >
            <form className={styles.form} onSubmit={handleSignInSubmit}>
              <h2 className={styles.form__title}>온길</h2>
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
              <div
                  className={`${styles.overlay__panel} ${styles["overlay--left"]}`}
              >
                <button className={styles.btn} onClick={handleSignInClick}>
                  로그인
                </button>
              </div>
              <div
                  className={`${styles.overlay__panel} ${styles["overlay--right"]}`}
              >
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
