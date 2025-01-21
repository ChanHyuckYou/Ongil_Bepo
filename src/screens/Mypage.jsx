import { useState } from 'react';
import styles from '../styles/Mypage.module.css';

const Mypage = () => {
  // 내 정보 수정 폼 기본 false
  const [showEditInfo, setShowEditInfo] = useState(false);

  // <수정 필요> 확인 클릭시 보임
  const handleOkClick = () => {
    setShowEditInfo(true); // 내 정보 수정 폼 보이게 하기
  };

  return (
    <div className={styles.mypage}>
      <div className={styles.mypageForm}>
        <div className={styles.form}>
          {/* mypageinput 섹션 */}
          {!showEditInfo && (
            <div className={styles.mypageinput}>
              <div className={styles.mypageImgIcon} />
              <div className={styles.inputform}>
                <div className={styles.pwdcheckTxt}>기존 비밀번호 확인</div>
                <input type="password" className={styles.pwdInput} />
                <div className={styles.okBtn1} onClick={handleOkClick}>
                  확인
                </div>
              </div>
            </div>
          )}
          {/* editmyinfo 섹션 */}
          {showEditInfo && (
            <div className={styles.editmyinfo}>
                <div className={styles.editform}>
                    <input type="text" placeholder="Name" className={styles.input} />
                    <div className={styles.dup}>
                        <input type="email" placeholder="Email" className={styles.input} />
                        <button className={styles.checkbtn}>중복확인</button>
                    </div>
                    <input type="password" placeholder="Password" className={styles.input} />
                    <input type="password" placeholder="Re-enter password" className={styles.input} />
                    <input type="text" placeholder="Local government area" className={styles.input} />
                    <input type="text" placeholder="Team" className={styles.input} />
                    <button type="submit" className={styles.okBtn2}>확인</button>
                    <div className={styles.Withdraw}>회원탈퇴</div>
                </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Mypage;
