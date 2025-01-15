import styles from '../styles/BoardDetail.module.css';

const BoardDetail = () => {
  return (
      <div className={styles.boarddetail}>

        <div className={styles.board}>
          <div className={styles.boardForm}/>
          <div className={styles.contentForm}>
            <div className={styles.boardContentForm}/>
            <b className={styles.boardContentTxt}>게시판 글</b>
          </div>
          <div className={styles.postForm}>
            <div className={styles.boardPostForm}/>
            <b className={styles.boardPostTxt}>제목</b>
          </div>
          <b className={styles.createUser}>{`작성자 : \${user_locate}-\${user_role}`}</b>
          <b className={styles.createDay}>{`\${board_updateDT}`}</b>
        </div>
        <div className={styles.commentsView}>
          <div className={styles.commentFf}/>
          <div className={styles.commentCreateForm}>
            <div className={styles.commentLi}/>
            <div className={styles.commentForm}/>
            <div className={styles.createBtn}>
              <div className={styles.createBtnForm}/>
              <div className={styles.plusTxt}>+</div>
            </div>
          </div>
          <div className={styles.commentUseritem}>옥길동-안전기획부</div>
          <div className={styles.commentItem}>비용은 어느정도 발생했나요?</div>
          <div className={styles.commentsViewChild}/>
          <div className={styles.commentsViewItem}/>
          <div className={styles.commentUser}>작성자</div>
          <div className={styles.comment}>댓글</div>
        </div>
        <div className={styles.head}>
          <img className={styles.headIcon} alt="" src="head_icon.png"/>
          <b className={styles.headTxt}>정보 게시판</b>
          <div className={styles.headLine}/>
        </div>
      </div>);
};

export default BoardDetail;
