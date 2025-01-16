import styles from '../styles/FindPwd.module.css';
import { useState } from 'react';
import useNavigations from "../Components/Navigation/Navigations.jsx";

const FindPwd = () => {
  const [emailInput, setEmailInput] = useState(""); // 입력 필드 값
  const [email, setEmail] = useState(""); // 저장된 이메일
  const [authNum, setAuthNum] = useState("");
  const [responsePwd, setResponsePwd] = useState("");

  // 페이지 이동 실행
  const navigateTo = useNavigations();
  const handleNavigation = (page) => {
    navigateTo(page);
  };

  // 이메일 입력 필드 변경 핸들러
  const handleEmailInputChange = (e) => {
    setEmailInput(e.target.value); // 입력 필드 값 업데이트
  };

  // 이메일 저장 버튼 클릭 핸들러
  const save = () => {
    setEmail(emailInput); // 입력된 값을 저장
  };

  // 인증번호 입력 핸들러
  const handleAuthNumChange = (e) => {
    setAuthNum(e.target.value);
  };

  // 인증번호 발송 버튼 클릭 핸들러
  const sendAuthCode = () => {
    console.log("인증번호 발송"); // 인증번호 발송 로직
  };


  return (
    <div className={styles.FindPwdContainer}>
      <div className={styles.FindPwdForm}>
        <div className={styles.title}>비밀번호 찾기</div>
        {/*}<div className={styles.emailTxt}>이메일</div>*/}

        <div className={styles.form}>
          <input
            className={styles.emailInput}
            value={emailInput} // 이메일 입력 필드 값
            onChange={handleEmailInputChange} // 값 변경 핸들러 연결
            placeholder="이메일 입력"
          />
          <div className={styles.keyBtn} onClick={save}>
            인증번호 발송
          </div>
        </div>

        {/*<div className={styles.numTxt}>인증번호</div>*/}
        <input
          className={styles.numInput}
          value={authNum}
          onChange={handleAuthNumChange}
          placeholder="인증번호 입력"
        />
        <div className={styles.submitBtn} onClick={() => handleNavigation('Resetpwd')}>확인</div>
        <div className={styles.cancelBtn} onClick={() => handleNavigation('Login')}>취소</div>
      </div>
    </div>
  );
};

export default FindPwd;
