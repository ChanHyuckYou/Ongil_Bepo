import {useState, useEffect} from "react";
import {io} from "socket.io-client";
import styles from "../styles/Board.module.css";
import useNavigations from "../components/Navigation/Navigations.jsx";
// WebSocket 연결
// eslint-disable-next-line no-undef
const socket = io(process.env.EB_SOCKET_URL);

const Board = () => {
  const navigateTo = useNavigations();
  const [boardItems, setBoardItems] = useState([]);

  useEffect(() => {
    // (1) 서버에서 초기 게시글 데이터를 받아옴
    const handleInitPosts = (posts) => {
      console.log("Initial posts:", posts);
      setBoardItems(posts);
    };

    // (2) 서버에서 새 게시글이 생성되었다고 브로드캐스트가 오면 받음
    const handleNewPost = (newPost) => {
      console.log("New post received:", newPost);
      setBoardItems((prevItems) => [...prevItems, newPost]);
    };

    // (3) WebSocket 이벤트 리스너 등록
    socket.on("initPosts", handleInitPosts);
    socket.on("newPost", handleNewPost);

    // (4) 컴포넌트 언마운트 시 이벤트 리스너 해제
    return () => {
      socket.off("initPosts", handleInitPosts);
      socket.off("newPost", handleNewPost);
    };
  }, []);

  const handleNavigation = (page) => {
    navigateTo(page); // 작성 페이지로 이동
  };

  const handleDetailNavigation = (postId) => {
    navigateTo(`/board-detail/${postId}`); // 상세 페이지로 이동
  };

  return (
      <div className="container">
        <div className={styles.board}>
          {/* 검색 및 필터 */}
          <div className={styles.boardHeader}>
            <button className={styles.filterBtn}>제목 ↓</button>
            <input
                type="text"
                placeholder="검색어를 입력하세요"
                className={styles.searchInput}
            />
            <button className={styles.searchBtn}>검색</button>
            <button
                className={styles.createBtn}
                onClick={() => handleNavigation("BoardCreate")}
            >
              <img
                  className={styles.plusIcon}
                  src="/images/plus_icon.png"
                  alt="추가 아이콘"
              />
              작성
            </button>
          </div>

          {/* 게시판 리스트 */}
          <div className={styles.boardListView}>
            <div className={styles.boardListHeader}>
              <span>제목</span>
              <span>작성자</span>
              <span>조회수</span>
              <span>게시일</span>
            </div>

            <div className={styles.boardListItems}>
              {boardItems.map((item) => (
                  <div
                      key={item.id}
                      className={styles.boardListItem}
                      onClick={() => handleDetailNavigation(
                          item.id)} // 클릭 시 상세 페이지로 이동
                      style={{cursor: "pointer"}} // 클릭 가능 커서 추가
                  >
                    <span className={styles.boardTitle}>{item.title}</span>
                    <span className={styles.boardAuthor}>{item.author}</span>
                    <span className={styles.boardViews}>{item.views}</span>
                    <span className={styles.boardDate}>{item.date}</span>
                  </div>
              ))}
            </div>
          </div>
        </div>
      </div>
  );
};

export default Board;
