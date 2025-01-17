import styles from '../styles/Resetpwd.module.css';
import useNavigations from "../components/Navigation/Navigations.jsx";

const Resetpwd = () => {
  const navigateTo = useNavigations();
  const handleDivClick = (page) => {
    navigateTo(page);
  };

  return (
      <div className={styles.FindPwdContainer}>
        <div className={styles.FindPwdForm}>
          <div className={styles.title}>비밀번호 재설정</div>
          <input
              className={styles.pwdInput}
              placeholder="새 비밀번호"
          />
          <input
              className={styles.repwdInput}
              placeholder="새 비밀번호 확인"
          />
          <div className={styles.submitBtn}>
            확인
          </div>
          <div className={styles.cancelBtn}
               onClick={() => handleDivClick("Login")}>
            취소
          </div>
        </div>
      </div>
  );
};

export default Resetpwd;
