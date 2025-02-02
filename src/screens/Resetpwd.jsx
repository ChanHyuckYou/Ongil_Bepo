import styles from '../styles/Resetpwd.module.css';
import { useState, useEffect } from 'react'; // useEffect import
import useNavigations from "../components/Navigation/Navigations.jsx";
import axios from 'axios';

const Resetpwd = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [responsePwd, setResponsePwd] = useState("");
  const [resetToken, setResetToken] = useState(""); // reset_token 상태

  const navigateTo = useNavigations();

  const handleDivClick = (page) => {
    navigateTo(page);
  };

  // 페이지가 로드되면 localStorage에서 reset_token을 가져와서 상태에 저장
  useEffect(() => {
    const token = localStorage.getItem('reset_token');
    if (token) {
      setResetToken(token);
    } else {
      alert("유효한 reset token이 없습니다.");
      handleDivClick("Login"); // 유효하지 않으면 로그인 페이지로 리디렉션
    }
  }, []);

  // 비밀번호 재설정 요청 함수
  const resetPassword = async () => {
    if (newPassword !== confirmPassword) {
      alert("비밀번호가 일치하지 않습니다."); // 비밀번호 불일치 팝업
      return;
    }

    try {
      const response = await axios.post("http://localhost:8000/auth/reset-password", {
        reset_token: resetToken, // 사용자가 받은 reset_token
        new_password: newPassword, // 새 비밀번호
        confirm_password: confirmPassword, // 새 비밀번호 확인
      });

      alert(response.data.message); // 서버에서 받은 메시지를 팝업으로 표시
      console.log(response.data.message); // 콘솔에 성공 메시지
    } catch (error) {
      alert(error.response.data.detail); // 에러 메시지를 팝업으로 표시
      console.error(error.response.data.detail); // 콘솔에 에러 메시지
    }
  };

  return (
    <div className={styles.FindPwdContainer}>
      <div className={styles.FindPwdForm}>
        <div className={styles.title}>비밀번호 재설정</div>
        <input
          className={styles.pwdInput}
          type="password"
          placeholder="새 비밀번호"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)} // 새 비밀번호 상태 업데이트
        />
        <input
          className={styles.repwdInput}
          type="password"
          placeholder="새 비밀번호 확인"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)} // 확인 비밀번호 상태 업데이트
        />

        <div className={styles.submitBtn} onClick={resetPassword}>
          확인
        </div>
        <div className={styles.cancelBtn} onClick={() => handleDivClick("Login")}>
          취소
        </div>
      </div>
    </div>
  );
};

export default Resetpwd;
