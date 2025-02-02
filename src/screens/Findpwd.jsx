import styles from '../styles/FindPwd.module.css';
import { useState } from 'react';
import axios from 'axios'; // axios import
import useNavigations from "../components/Navigation/Navigations.jsx";

const FindPwd = () => {
  const [emailInput, setEmailInput] = useState(""); // 입력 필드 값
  const [authNum, setAuthNum] = useState(""); // 인증번호
  const [responsePwd, setResponsePwd] = useState(""); // 서버 응답
  const navigateTo = useNavigations();

  // 페이지 이동 실행
  const handleNavigation = (page) => {
    navigateTo(page);
  };

  // 이메일 입력 필드 변경 핸들러
  const handleEmailInputChange = (e) => {
    setEmailInput(e.target.value); // 이메일 입력값 업데이트
  };

  // 인증번호 입력 핸들러
  const handleAuthNumChange = (e) => {
    setAuthNum(e.target.value); // 인증번호 입력값 업데이트
  };

  // 인증번호 발송 버튼 클릭 핸들러
  const sendAuthCode = async () => {
    try {
      const response = await axios.post("http://localhost:8000/auth/findpwd", {
        email: emailInput,
      });

      alert(response.data.message); // 성공 메시지 팝업
    } catch (error) {
      alert(error.response.data.detail); // 에러 메시지 팝업
    }
  };

  // 인증번호 확인 후 reset_token을 localStorage에 저장
  const verifyAuthCode = async () => {
    try {
      const response = await axios.post("http://localhost:8000/auth/verify-code", {
        email: emailInput,
        code: authNum,
      });

      // 서버에서 받은 reset_token을 localStorage에 저장
      localStorage.setItem('reset_token', response.data.reset_token);

      alert(response.data.message); // 인증 성공 메시지 팝업
      handleNavigation('Resetpwd'); // 비밀번호 재설정 페이지로 이동
    } catch (error) {
      alert(error.response.data.detail); // 인증 실패 시 에러 메시지 팝업
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

        {responsePwd && <p>{responsePwd}</p>}

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
