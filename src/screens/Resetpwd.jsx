import styles from '../styles/Resetpwd.module.css';
import { useState, useEffect } from 'react';
import { resetPassword } from '../components/ApiRoute/auth.jsx';
import useNavigations from '../components/Navigation/Navigations.jsx';

const Resetpwd = () => {
  const [newPassword, setNewPassword] = useState("");  // 새 비밀번호 상태
  const [confirmPassword, setConfirmPassword] = useState("");  // 확인 비밀번호 상태
  const [resetToken, setResetToken] = useState("");  // reset_token 상태

  const navigateTo = useNavigations();

  // 페이지가 로드될 때 localStorage에서 reset_token을 가져와서 상태에 저장
  useEffect(() => {
    const token = localStorage.getItem('reset_token');
    if (token) {
      setResetToken(token);  // token 있으면 상태에 저장
    } else {
      alert("유효한 reset token이 없습니다.");
      navigateTo("Login"); // 유효하지 않으면 로그인 페이지로 이동
    }
  }, []);

  // 비밀번호 재설정 요청 함수
  const handleResetPassword = async () => {
    if (newPassword !== confirmPassword) {
      alert("비밀번호가 일치하지 않습니다.");  // 비밀번호 불일치 팝업
      return;
    }

    try {
      // resetPassword API 호출
      const response = await resetPassword({
        reset_token: resetToken,  // 사용자가 받은 reset_token
        new_password: newPassword,  // 새 비밀번호
        confirm_password: confirmPassword  // 새 비밀번호 확인
      });

      alert(response.message);  // 서버에서 받은 메시지 팝업
      navigateTo("Login");  // 로그인 페이지로 리디렉션
    } catch (error) {
      alert(error.message || "비밀번호 재설정 중 오류가 발생했습니다.");  // 오류 팝업
    }
  };

  return (
    <div className={styles.FindPwdContainer}>
      <div className={styles.FindPwdForm}>
        <div className={styles.title}>비밀번호 재설정</div>

        {/* 새 비밀번호 입력 */}
        <input
          className={styles.pwdInput}
          type="password"
          placeholder="새 비밀번호"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}  // 새 비밀번호 상태 업데이트
        />

        {/* 새 비밀번호 확인 입력 */}
        <input
          className={styles.repwdInput}
          type="password"
          placeholder="새 비밀번호 확인"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}  // 확인 비밀번호 상태 업데이트
        />

        {/* 확인 버튼 */}
        <div className={styles.submitBtn} onClick={handleResetPassword}>
          확인
        </div>

        {/* 취소 버튼 */}
        <div className={styles.cancelBtn} onClick={() => navigateTo("Login")}>
          취소
        </div>
      </div>
    </div>
  );
};

export default Resetpwd;
