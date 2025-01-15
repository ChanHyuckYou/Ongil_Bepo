import styles from '../styles/Inquire.module.css';

const Inquire = () => {
  return (
      <div className={styles.inquire}>
        <div className={styles.inquireView}>
          <div className={styles.inquireDetail}/>
          <div className={styles.inquireCreateBtn}/>
          <b className={styles.inquireCreate}>작성</b>
          <div className={styles.bodyLine}/>
          <img className={styles.plusIcon} alt="" src="plus_icon.png"/>
          <div className={styles.inquireList}>
            <div className={styles.inquireListChild}/>
            <b className={styles.b}>부천시 범박동 열선도로 정보가 잘못되었습니다.</b>
            <b className={styles.b1}>2025-01-10</b>
            <b className={styles.id}>ID</b>
            <b className={styles.updateDay}>문의일</b>
            <b className={styles.postTxt}>제목</b>
            <b className={styles.commentBoolTxt}>답변</b>
            <b className={styles.userIdTxt}>범박동-행정복지부</b>
            <b className={styles.y}>Y</b>
            <div className={styles.inquireListItem}/>
            <div className={styles.inquireListInner}/>
          </div>
        </div>
      </div>);
};

export default Inquire;
