import styles from '../styles/BoardCreate.module.css';

const BoardCreate = () => {
  return (
      <div className={styles.boardcreate}>

        <div className={styles.boardSelection}>
          <div className={styles.boardForm}/>
          <div className={styles.contentForm}/>
          <div className={styles.postForm}/>
          <b className={styles.postTxt}>제목</b>
          <b className={styles.contentTxt}>게시판 글</b>
          <div className={styles.createBtn}>
            <div className={styles.createForm}/>
            <b className={styles.createTxt}>작성</b>
          </div>
        </div>
        <div className={styles.head}>
          <img className={styles.headIcon} alt="" src="head_icon.png"/>
          <b className={styles.headTxt}>정보 게시판</b>
          <div className={styles.headLine}/>
        </div>
      </div>);
};

export default BoardCreate;
