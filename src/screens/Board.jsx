import {useState, useEffect} from "react";
import {io} from "socket.io-client";
import styles from "../styles/Board.module.css";
import useNavigations from "../components/Navigation/Navigations.jsx";

const webSocketUrl = "http://localhost:3000";
// WebSocket 연결
const socket = io(webSocketUrl);

const ITEMS_PER_PAGE = 10; // 페이지당 게시글 수

const Board = () => {
  const navigateTo = useNavigations();
  const [boardItems, setBoardItems] = useState([]);

  // 페이지네이션 상태
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(boardItems.length / ITEMS_PER_PAGE);

  // 검색 상태
  const [searchType, setSearchType] = useState("title"); // 'title' 또는 'content'
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    // (1) 서버에서 초기 게시글 데이터를 받아옴
    const handleInitPosts = (posts) => {
      console.log("Initial posts:", posts);
      setBoardItems(posts);
    };

    // (2) 서버에서 새 게시글이 생성되었다고 브로드캐스트가 오면 받음
    const handleNewPost = (newPost) => {
      console.log("New post received:", newPost);
      setBoardItems((prevItems) => [newPost, ...prevItems]); // 최신 게시글을 상단에 추가
      // 필요에 따라 페이지 조정
      if ((boardItems.length + 1) > ITEMS_PER_PAGE * currentPage) {
        setCurrentPage((prevPage) => prevPage + 1);
      }
    };

    // (3) WebSocket 이벤트 리스너 등록
    socket.on("initPosts", handleInitPosts);
    socket.on("newPost", handleNewPost);

    // (4) 컴포넌트 언마운트 시 이벤트 리스너 해제
    return () => {
      socket.off("initPosts", handleInitPosts);
      socket.off("newPost", handleNewPost);
    };
  }, [boardItems.length, currentPage]);

  const handleNavigation = (page) => {
    navigateTo(page); // 작성 페이지로 이동
  };

  // 페이지 변경 핸들러
  const goToPage = (page) => {
    if (page < 1 || page > totalPages) {
      return;
    }
    setCurrentPage(page);
  };

  // 검색 핸들러
  const handleSearch = () => {
    // 서버에 검색 요청을 보내거나 클라이언트 측에서 필터링을 수행
    // 여기서는 클라이언트 측 필터링 예제
    socket.emit("searchPosts", {type: searchType, query: searchQuery});
  };

  // 서버로부터 검색 결과를 받는 핸들러
  const handleSearchResults = (filteredPosts) => {
    console.log("Search results:", filteredPosts);
    setBoardItems(filteredPosts);
    setCurrentPage(1); // 검색 후 페이지 초기화
  };

  useEffect(() => {
    // 검색 결과 이벤트 리스너 등록
    socket.on("searchResults", handleSearchResults);

    // 언마운트 시 해제
    return () => {
      socket.off("searchResults", handleSearchResults);
    };
  }, []);

  // 현재 페이지에 해당하는 게시글 추출
  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentItems = boardItems.slice(indexOfFirstItem, indexOfLastItem);

  return (
      <div className="container">
        <div className={styles.board}>
          {/* 검색 및 필터 */}
          <div className={styles.boardHeader}>
            {/* 검색 기준 선택 */}
            <select
                className={styles.searchTypeSelect}
                value={searchType}
                onChange={(e) => setSearchType(e.target.value)}
            >
              <option value="title">제목</option>
              <option value="content">내용</option>
            </select>

            {/* 검색어 입력 */}
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

            {/* 검색 버튼 */}
            <button className={styles.searchBtn} onClick={handleSearch}>
              검색
            </button>

            {/* 작성 버튼 */}
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
              <span>카테고리</span>
              <span>제목</span>
              <span>작성자</span>
              <span>조회수</span>
              <span>게시일</span>
            </div>

            <div className={styles.boardListItems}>
              {currentItems.map((item) => (
                  <div
                      key={item.id}
                      className={styles.boardListItem}
                      onClick={() => navigateTo("BoardDetail", { postId: item.id })} // 동적 경로로 이동
                      style={{cursor: "pointer"}} // 클릭 가능 커서 추가
                  >
                    <span className={styles.boardCategory}>{item.category}</span>
                    <span className={styles.boardTitle}>{item.title}</span>
                    <span className={styles.boardAuthor}>{item.author}</span>
                    <span className={styles.boardViews}>{item.views}</span>
                    <span className={styles.boardDate}>{item.date}</span>
                  </div>
              ))}
            </div>
          </div>

          {/* 페이지네이션 컨트롤 */}
          {totalPages > 1 && (
              <div className={styles.pagination}>
                <button
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={styles.pageBtn}
                >
                  이전
                </button>
                {/* 페이지 번호 표시 */}
                {Array.from({length: totalPages}, (_, index) => (
                    <button
                        key={index + 1}
                        onClick={() => goToPage(index + 1)}
                        className={`${styles.pageBtn} ${
                            currentPage === index + 1 ? styles.activePage : ""
                        }`}
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
