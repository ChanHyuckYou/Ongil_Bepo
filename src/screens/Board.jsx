import styles from '../styles/Board.module.css';

const Board = () => {
  return (
      <div className={styles.board}>

        <div className={styles.boardListView}/>
        <div className={styles.searchInput}/>
        <div className={styles.searchForm}>
          <div className={styles.searchBtn}/>
          <b className={styles.searchTxt}>검색</b>
        </div>
        <div className={styles.filterForm}>
          <div className={styles.filterBtn}/>
          <b className={styles.filterTxt}>제목 ↓</b>
        </div>
        <div className={styles.boardChild}/>
        <div className={styles.createForm}>
          <div className={styles.searchBtn}/>
          <b className={styles.createTxt}>작성</b>
          <img className={styles.plusIcon} alt="" src="plus_icon.png"/>
        </div>
        <div className={styles.boardListForm}>
          <div className={styles.boardItem}/>
          <b className={styles.b}>부천시 범박동 열선도로 설치 후기</b>
          <b className={styles.b1}>2025-01-10</b>
          <b className={styles.boradAuthor}>작성자</b>
          <b className={styles.updateDay}>게시일</b>
          <b className={styles.boardName}>제목</b>
          <b className={styles.b2}>조회수</b>
          <b className={styles.b3}>범박동-행정복지부</b>
          <b className={styles.b4}>456</b>
          <div className={styles.boardListFormChild}/>
          <div className={styles.boardListFormItem}/>
        </div>

      </div>);
};

export default Board;
