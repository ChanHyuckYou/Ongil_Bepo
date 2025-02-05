import {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import axios from 'axios';
import styles from '../styles/Mypage.module.css';

import {
  loadUserInfo,
  checkPassword,
  updateUserInfo,
  deleteUser
} from '../components/ApiRoute/mypage.jsx';

const Mypage = () => {
  const accessToken = localStorage.getItem("access_token");
  const navigate = useNavigate();
  const [showEditInfo, setShowEditInfo] = useState(false);
  const [password, setPassword] = useState("");  // 비밀번호 상태
  const [userInfo, setUserInfo] = useState(
      {user_email: "", user_name: "", user_dept: "", jurisdiction: ""});

  // 유저 정보 불러오기
  const fetchUserInfo = async () => {
    const data = await loadUserInfo(accessToken);  // loadUserInfo 호출하여 데이터 가져오기
    if (data) {
      setUserInfo(data.user_info[0]);  // 데이터 저장
    }
  };

  // 비밀번호 확인
  const handleOkClick = async () => {
    try {
      const data = await checkPassword(password, accessToken);  // api.js의 checkPassword 호출
      alert(data.message);
      await fetchUserInfo();
      setShowEditInfo(true);  // 비밀번호 확인 후 사용자 정보 수정 섹션 보이기
    } catch (error) {
      alert(error.message || "비밀번호가 일치하지 않습니다.");
    }
  };

  // 사용자 정보 수정 후 업데이트
  const handleUpdateUserInfo = async () => {
    try {
      const updateData = {
        user_name: userInfo.user_name,
        user_dept: userInfo.user_dept,
        jurisdiction: userInfo.jurisdiction,
        user_ps: userInfo.user_ps,  // 비밀번호 변경된 경우 추가
      };

      const data = await updateUserInfo(updateData);  // api.js의 updateUserInfo 호출
      alert("회원정보가 성공적으로 업데이트되었습니다.");
      setShowEditInfo(false); // 수정 완료 후 수정 폼 숨기기
    } catch (error) {
      alert(error.message || "회원정보 업데이트에 실패했습니다.");
    }
  };

  // 회원 탈퇴
  const handleDeleteAccount = async () => {
    if (!window.confirm("정말로 회원 탈퇴하시겠습니까? 🥲")) {
      return;
    }

    try {
      const data = await deleteUser();  // api.js의 deleteUser 호출
      alert("회원 탈퇴가 완료되었습니다.");
      localStorage.removeItem("access_token"); // 토큰 삭제
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("is_admin");
      window.location.href = "/"; // 홈으로 리디렉션
    } catch (error) {
      alert(error.message || "회원 탈퇴에 실패했습니다.");
    }
  };

  // 🔹 입력값 변경 핸들러
  const handleChange = (e) => {
    setUserInfo({
      ...userInfo,
      [e.target.name]: e.target.value,
    });
  };

  return (
      <div className={styles.mypage}>
        <div className={styles.mypageForm}>
          <div className={styles.form}>
            {/* 기존 비밀번호 확인 섹션 */}
            {!showEditInfo && (
                <div className={styles.mypageinput}>
                  <div className={styles.mypageImgIcon}/>
                  <div className={styles.inputform}>
                    <div className={styles.pwdcheckTxt}>기존 비밀번호 확인</div>
                    <input
                        type="password"
                        className={styles.pwdInput}
                        value={password}
                        onChange={(e) => setPassword(
                            e.target.value)} // 비밀번호 상태 업데이트
                        onKeyDown={(e) => e.key === "Enter"
                            && handleOkClick()} // Enter 키 입력 시 실행
                    />
                    <div className={styles.okBtn1} onClick={handleOkClick}>
                      확인
                    </div>
                  </div>
                </div>
            )}
            {/* 회원 정보 수정 섹션 */}
            {showEditInfo && (
                <div className={styles.editmyinfo}>
                  <div className={styles.editform}>
                    <input
                        type="text"
                        name="user_name"
                        value={userInfo.user_name}
                        placeholder="Name"
                        className={styles.input}
                        onChange={handleChange}
                    />
                    <input
                        type="email"
                        name="user_email"
                        value={userInfo.user_email}
                        placeholder="Email"
                        className={styles.input}
                        disabled // 이메일은 수정 불가
                        style={{backgroundColor: "#f0f0f0"}}
                    />
                    <input
                        type="password"
                        name="user_ps"
                        placeholder="New Password"
                        className={styles.input}
                        onChange={handleChange}
                    />
                    <input
                        type="password"
                        name="user_ps_confirm"
                        placeholder="Re-enter Password"
                        className={styles.input}
                        onChange={handleChange}
                    />
                    <input
                        type="text"
                        name="user_dept"
                        value={userInfo.user_dept}
                        placeholder="Department"
                        className={styles.input}
                        onChange={handleChange}
                    />
                    <input
                        type="text"
                        name="jurisdiction"
                        value={userInfo.jurisdiction}
                        placeholder="Jurisdiction"
                        className={styles.input}
                        onChange={handleChange}
                    />
                    <button className={styles.okBtn2}
                            onClick={handleUpdateUserInfo}>확인
                    </button>
                    {/* 회원탈퇴 버튼 추가 */}
                    <div className={styles.Withdraw}
                         onClick={handleDeleteAccount}>회원탈퇴
                    </div>
                  </div>
                </div>
            )}
          </div>
        </div>
      </div>
  );
};

export default Mypage;
