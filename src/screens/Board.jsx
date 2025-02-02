// src/components/Board.jsx
import {useState, useEffect, useRef} from "react";
import {useNavigate} from "react-router-dom";
import styles from "../styles/Board.module.css";
import useNavigations from "../components/Navigation/Navigations.jsx";
import {getAllPosts, getSocket} from "../components/ApiRoute/board.jsx"; // getSocket() 사용

const ITEMS_PER_PAGE = 10; // 페이지당 게시글 수

const Board = () => {
  const navigateTo = useNavigations();
  const navigate = useNavigate();
  const socketRef = useRef(null);
  const [boardItems, setBoardItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchType, setSearchType] = useState("title");
  const [searchQuery, setSearchQuery] = useState("");
  const totalPages = Math.ceil(boardItems.length / ITEMS_PER_PAGE);

  // (1) 초기 게시글 데이터 불러오기
  useEffect(() => {
    getAllPosts()
    .then((data) => {
      console.log("Initial posts:", data.posts);
      setBoardItems(data.posts);
    })
    .catch((err) => {
      console.error("Error fetching posts:", err);
    });
  }, []);

  // (2) board 페이지에서만 socket 연결 생성 및 이벤트 처리
  useEffect(() => {
    // getSocket()를 통해 기존 소켓이 있으면 재사용하고, 없으면 새로 생성합니다.
    socketRef.current = getSocket();
    const socket = socketRef.current;

    const handleNewPost = (newPost) => {
      console.log("New post received:", newPost);
      setBoardItems((prevItems) => [newPost, ...prevItems]);
    };

    const handleSearchResults = (filteredPosts) => {
      console.log("Search results:", filteredPosts);
      setBoardItems(filteredPosts);
      setCurrentPage(1); // 검색 후 페이지 초기화
    };

    socket.on("newPost", handleNewPost);
    socket.on("searchResults", handleSearchResults);

    // 페이지 언마운트 시 소켓 연결 해제
    return () => {
      socket.off("newPost", handleNewPost);
      socket.off("searchResults", handleSearchResults);
      socket.disconnect();
      socketRef.current = null;
    };
  }, []);

  const handleNavigation = (page, params = {}) => {
    navigateTo(page, params);
  };

  // 페이지 변경 핸들러
  const goToPage = (page) => {
    if (page < 1 || page > totalPages) {
      return;
    }
    setCurrentPage(page);
  };

  // 검색 핸들러 (소켓 연결은 socketRef.current를 사용)
  const handleSearch = () => {
    if (socketRef.current) {
      socketRef.current.emit("searchPosts",
          {type: searchType, query: searchQuery});
    }
  };

  // 현재 페이지에 해당하는 게시글 추출
  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentItems = boardItems.slice(indexOfFirstItem, indexOfLastItem);

  return (
      <div className="container">
        <div className={styles.board}>
          {/* 검색 및 필터 영역 */}
          <div className={styles.boardHeader}>
            <select
                className={styles.searchTypeSelect}
                value={searchType}
                onChange={(e) => setSearchType(e.target.value)}
            >
              <option value="title">제목</option>
              <option value="content">내용</option>
            </select>
            <input
                type="text"
                placeholder="검색어를 입력하세요"
                className={styles.searchInput}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSearch();
                  }
                }}
            />
            <button className={styles.searchBtn} onClick={handleSearch}>
              검색
            </button>
            <button className={styles.createBtn}
                    onClick={() => handleNavigation("BoardCreate")}>
              <img className={styles.plusIcon} src="/images/plus_icon.png"
                   alt="추가 아이콘"/>
              작성
            </button>
          </div>

          {/* 게시글 목록 */}
          <div className={styles.boardListView}>
            <div className={styles.boardListHeader}>
              <span>카테고리</span>
              <span>제목</span>
              <span>작성자</span>
              <span>조회수</span>
              <span>게시일</span>
            </div>
            <div className={styles.boardListItems}>
              {currentItems.map((item) => (
                  <div
                      key={item.post_id}
                      className={styles.boardListItem}
                      onClick={() => navigateTo("BoardDetail",
                          {postId: item.post_id})}
                      style={{cursor: "pointer"}}
                  >
                    <span
                        className={styles.boardCategory}>{item.post_category}</span>
                    <span className={styles.boardTitle}>{item.post_title}</span>
                    <span
                        className={styles.boardAuthor}>{item.user_email}</span>
                    <span className={styles.boardViews}>{item.views}</span>
                    <span className={styles.boardDate}>
                  {new Date(item.post_time).toLocaleDateString()}
                </span>
                  </div>
              ))}
            </div>
          </div>

          {/* 페이지네이션 */}
          {totalPages > 1 && (
              <div className={styles.pagination}>
                <button onClick={() => goToPage(currentPage - 1)}
                        disabled={currentPage === 1} className={styles.pageBtn}>
                  이전
                </button>
                {Array.from({length: totalPages}, (_, index) => (
                    <button
                        key={index + 1}
                        onClick={() => goToPage(index + 1)}
                        className={`${styles.pageBtn} ${currentPage === index
                        + 1 ? styles.activePage : ""}`}
                    >
                      {index + 1}
                    </button>
                ))}
                <button
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={styles.pageBtn}
                >
                  다음
                </button>
              </div>
          )}
        </div>
      </div>
  );
};

export default Board;
