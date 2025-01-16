import styles from '../styles/FindPwd.module.css';
import {useState} from 'react';

const FindPwd = () => {
  const [email, setEmail] = useState("");
  const [authNum, setAuthNum] = useState("");
  const [responsePwd, setResponsePwd] = useState("");

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleAuthNumChange = (e) => {
    setAuthNum(e.target.value);
  };

  const sendAuthCode = () => {
    // 인증번호 발송 로직
    console.log("인증번호 발송");
  };

  const confirmPwd = () => {
    // 비밀번호 확인 로직
    setResponsePwd("response_pwd"); // 예시로 response_pwd 설정
  };

  return (
    <div className={styles.FindPwdForm}>
      <div className={styles.title}>비밀번호 찾기</div>
      <div className={styles.emailTxt}>이메일</div>

      <div className={styles.form}>
          <input
            className={styles.emailInput}
            value={email}
            onChange={handleEmailChange}
            placeholder="이메일 입력"
          />
          <div className={styles.keyBtn} onClick={sendAuthCode}>
            인증번호 발송
          </div>
      </div>

      <div className={styles.numTxt}>인증번호</div>
      <input
        className={styles.numInput}
        value={authNum}
        onChange={handleAuthNumChange}
        placeholder="인증번호 입력"
      />
      <div className={styles.submitBtn} onClick={confirmPwd}>
        Confirm
      </div>
      {responsePwd && (
        <div className={styles.responseMessage}>
          {email}님의 비밀번호는 {responsePwd} 입니다!
        </div>
      )}
    </div>
  );
};


export default FindPwd;
