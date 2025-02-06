// src/components/Board.jsx
import {useState, useEffect, useRef} from "react";
import {useNavigate} from "react-router-dom";
import styles from "../styles/Board.module.css";
import useNavigations from "../components/Navigation/Navigations.jsx";
import {getAllPosts, getSocket} from "../components/ApiRoute/board.jsx";
import {loadUserInfo} from '../components/ApiRoute/mypage.jsx';

const ITEMS_PER_PAGE = 10; // 페이지당 게시글 수

const Board = () => {
  const navigateTo = useNavigations();
  const navigate = useNavigate();
  const socketRef = useRef(null);
  const [boardItems, setBoardItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchType, setSearchType] = useState("title");
  const [searchQuery, setSearchQuery] = useState("");

  const accessToken = localStorage.getItem("access_token");
  const isAdmin = localStorage.getItem('is_admin') === '1';
  const [userInfo, setUserInfo] = useState(
          {user_email: "", user_name: "", user_dept: "", jurisdiction: ""});

  // 유저 정보 불러오기
  const fetchUserInfo = async () => {
    const data = await loadUserInfo(accessToken);  // loadUserInfo 호출하여 데이터 가져오기
    if (data) {
      setUserInfo(data.user_info[0]);  // 데이터 저장
    }
  };

  // 페이지네이션 계산용
  const totalPages = Math.ceil(boardItems.length / ITEMS_PER_PAGE);

  // 날짜 포맷 함수
  const formatDateTime = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now - date; // 밀리초 차이
    const diffSec = diff / 1000; // 초
    const diffMin = diffSec / 60; // 분
    const diffHour = diffMin / 60; // 시간

    // 24시간 이내 => "방금 전 / X분 전 / X시간 전"
    if (diffHour < 24) {
      if (diffMin < 1) {
        return "방금 전"; // 1분 미만
      } else if (diffMin < 60) {
        return `${Math.floor(diffMin)}분 전`;
      } else {
        return `${Math.floor(diffHour)}시간 전`;
      }
    }
    // 24시간 이상 => YYYY-MM-DD
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // (1) 초기 게시글 데이터 불러오기 + 최신순 정렬
  useEffect(() => {
    fetchUserInfo();
    getAllPosts()
    .then((data) => {
      if (!data.posts) {
        return;
      }
      // 최신순 내림차순 정렬
      const sorted = data.posts.sort(
          (a, b) => new Date(b.post_time) - new Date(a.post_time)
      );
      console.log("Initial posts(sorted):", sorted);
      setBoardItems(sorted);
    })
    .catch((err) => {
      console.error("Error fetching posts:", err);
    });
  }, []);

  // (2) board 페이지에서만 socket 연결 생성 및 이벤트 처리
  useEffect(() => {
    socketRef.current = getSocket();
    const socket = socketRef.current;
    const handleNewPost = (newPost) => {
      console.log("New post received:", newPost);
      // 가장 위로 추가 (최신글 맨 앞)
      setBoardItems((prevItems) => [newPost, ...prevItems]);
    };

    const handleSearchResults = (filteredPosts) => {
      console.log("Search results:", filteredPosts);
      // 검색 결과도 최신순 정렬해주고 싶다면:
      const sortedResults = filteredPosts.sort(
          (a, b) => new Date(b.post_time) - new Date(a.post_time)
      );
      setBoardItems(sortedResults);
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

  // 페이지 이동
  const goToPage = (page) => {
    if (page < 1 || page > totalPages) {
      return;
    }
    setCurrentPage(page);
  };

  // 검색 핸들러 (소켓 연결)
  const handleSearch = () => {
    if (socketRef.current) {
      socketRef.current.emit("searchPosts", {
        type: searchType,
        query: searchQuery,
      });
    }
  };

  // ✅ 비공개 게시글 필터링 (user일 경우 자신의 글이 비공개거나 공개 게시글만 표시)
  const filteredItems = boardItems.filter((item) => {
    return (
      isAdmin ||
      item.board_id === 1 ||
      item.user_email === userInfo.user_email // 본인 글이면 허용
    );
  });

  // 현재 페이지 게시글만 잘라서 보여주기
  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);

  // 게시글 작성 페이지 이동
  const handleCreate = () => {
    navigateTo("BoardCreate");
  };

  return (
      <div className="container">
        <div className={styles.board}>
          {/* 검색 영역 */}
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

            <button className={styles.createBtn} onClick={handleCreate}>
              <img
                  className={styles.plusIcon}
                  src="/images/plus_icon.png"
                  alt="추가 아이콘"
              />
              작성
            </button>
          </div>

          {/* 게시글 목록 */}
          <div className={styles.boardListView}>
            <div className={styles.boardListHeader}>
              <span>공개여부</span>
              <span>카테고리</span>
              <span>제목</span>
              <span>이메일</span>
              <span>관할구혁-부서명</span>
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
                    {/* 공개여부: board_id 0 -> 비공개, 1 -> 공개 */}
                    <span className={styles.boardCategory}>
                  {item.board_id === 1 ? "공개" : "비공개"}
                </span>
                    <span className={styles.boardCategory}>{item.post_category}</span>
                    <span className={styles.boardTitle}>{item.post_title}</span>
                    <span className={styles.boardAuthor}>{item.user_email}</span>
                    <span className={styles.boardDept}>{item.jurisdiction}-{item.user_dept}</span>
                    <span className={styles.boardViews}>{item.views}</span>
                    <span className={styles.boardDate}>
                  {formatDateTime(item.post_time)}
                </span>
                  </div>
              ))}
            </div>
          </div>

          {/* 페이지네이션 */}
          {totalPages > 1 && (
              <div className={styles.pagination}>
                <button
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={styles.pageBtn}
                >
                  이전
                </button>
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
