import styles from '../styles/FindPwd.module.css';
import { useState } from 'react';
import { findPassword, verifyCode } from '../components/ApiRoute/auth.jsx';
import useNavigations from "../components/Navigation/Navigations.jsx";

const FindPwd = () => {
  const [emailInput, setEmailInput] = useState("");  // 이메일 입력 값
  const [authNum, setAuthNum] = useState("");  // 인증번호 입력 값
  const navigateTo = useNavigations();

  // 페이지 이동 함수
  const handleNavigation = (page) => {
    navigateTo(page);
  };

  // 이메일 입력 핸들러
  const handleEmailInputChange = (e) => {
    setEmailInput(e.target.value);
  };

  // 인증번호 입력 핸들러
  const handleAuthNumChange = (e) => {
    setAuthNum(e.target.value);
  };

  // 인증번호 발송 버튼 클릭 핸들러
  const sendAuthCode = async () => {
    try {
      const response = await findPassword(emailInput);  // findPassword API 호출

      alert(response.message); // 서버에서 받은 메시지를 alert로 표시
    } catch (error) {
      alert(error.message || "비밀번호 찾기 중 오류가 발생했습니다.");
    }
  };

  // 인증번호 확인 후 reset_token을 localStorage에 저장
  const verifyAuthCode = async () => {
    try {
      const response = await verifyCode(emailInput, authNum);  // verifyCode API 호출

      // 서버에서 받은 reset_token을 localStorage에 저장
      localStorage.setItem('reset_token', response.reset_token);

      alert(response.message); // 인증 성공 메시지 팝업
      handleNavigation('Resetpwd'); // 비밀번호 재설정 페이지로 이동
    } catch (error) {
      alert(error.message || "인증 코드 확인 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className={styles.FindPwdContainer}>
      <div className={styles.FindPwdForm}>
        <div className={styles.title}>비밀번호 찾기</div>

        <div className={styles.form}>
          <input
            className={styles.emailInput}
            value={emailInput}
            onChange={handleEmailInputChange}
            placeholder="이메일 입력"
          />
          <div className={styles.keyBtn} onClick={sendAuthCode}>
            인증번호 발송
          </div>
        </div>

        <input
          className={styles.numInput}
          value={authNum}
          onChange={handleAuthNumChange}
          placeholder="인증번호 입력"
        />
        <div className={styles.submitBtn} onClick={verifyAuthCode}>
          확인
        </div>
        <div
          className={styles.cancelBtn}
          onClick={() => handleNavigation('Login')}
        >
          취소
        </div>
      </div>
    </div>
  );
};

export default FindPwd;
