import React, { useState, useEffect } from "react";
import styles from "../styles/Inquire.module.css";
import { io } from "socket.io-client";

const webSocketUrl = "http://localhost:3000";
const socket = io(webSocketUrl);

const Inquire = () => {
  const [isModalOpen, setIsModalOpen] = useState(false); // 문의 작성
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false); // 상세 모달 상태
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("데이터 문의"); // 카테고리 디폴트
  const [inquireItems, setInquireItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null); // 선택된 항목 데이터
  const [adminAnswer, setAdminAnswer] = useState(""); // 관리자가 작성한 답변
  const [isAdmin, setIsAdmin] = useState(true); // 관리자 인증 여부

  useEffect(() => {
    // 관리자 토큰
    const token = localStorage.getItem("authToken"); // 예시로 토큰을 로컬 스토리지에서 가져옴
    if (token) {
      const decoded = decodeJwt(token); // JWT 디코딩하여 사용자 정보 확인 (예: 사용자 역할)
      if (decoded.role === "admin") {
        setIsAdmin(true); // 관리자로 인증되었을 경우
      }
    }

    // socket 로직
    const handleInitPosts = (posts) => {
      console.log("Initial posts:", posts);
      setInquireItems(posts);
    };

    const handleNewPost = (newPost) => {
      console.log("New post received:", newPost);
      setInquireItems((prevItems) => [...prevItems, newPost]);
    };

    const handleUpdatedPost = (updatedPost) => {
      console.log("Updated post received:", updatedPost);
      setInquireItems((prevItems) =>
        prevItems.map((item) => (item.id === updatedPost.id ? updatedPost : item))
      );
    };

    socket.on("initPosts", handleInitPosts);
    socket.on("newPost", handleNewPost);
    socket.on("updatedPost", handleUpdatedPost);

    return () => {
      socket.off("initPosts", handleInitPosts);
      socket.off("newPost", handleNewPost);
      socket.off("updatedPost", handleUpdatedPost);
    };
  }, []);

  // 작성 팝업창
  const openCreate = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setIsDetailModalOpen(false);
    setSelectedItem(null); // 선택 초기화
    setAdminAnswer(""); // 관리자 답변 초기화
  };

  // 작성 로직
  const handleCreate = (e) => {
    e.preventDefault();

    if (!title || !content) {
      alert("제목과 내용을 입력해주세요.");
      return;
    }

    const newPost = {
      id: Date.now(), // 고유 ID 생성
      category,
      title,
      content,
      author: "사용자",
      date: new Date().toISOString().split("T")[0],
      answer: "",
    };

    socket.emit("createPost", newPost);
    alert("문의가 접수되었습니다!");

    setCategory("데이터 문의");
    setTitle("");
    setContent("");
    closeModal();
  };

  // 문의글 선택 로직
  const handleItemClick = (item) => {
    setSelectedItem(item); // 선택된 항목 설정
    setIsDetailModalOpen(true); // 상세 모달 열기
    setAdminAnswer(item.answer || ""); // 기존 답변이 있다면 초기화
  };

  // 관리자 답변 로직
  const handleAnswerSubmit = () => {
    if (!adminAnswer.trim()) {
      alert("답변 내용을 입력하세요.");
      return;
    }

    const updatedPost = {
      ...selectedItem,
      answer: adminAnswer, // 답변 업데이트
    };

    // 클라이언트에서 즉시 상태 업데이트
    setInquireItems((prevItems) =>
        prevItems.map((item) =>
            item.id === updatedPost.id ? updatedPost : item
        )
    );

    alert("답변이 전송되었습니다.");
    closeModal();
  };

  return (
    <div className="container">
      <div className={styles.inquire}>
        <div className={styles.inquireForm}>
          <div className={styles.create}>
            <button className={styles.inquireCreateBtn} onClick={openCreate}>
              <img
                className={styles.plusIcon}
                src="/images/plus_icon.png"
                alt="추가 아이콘"
              />
              작성
            </button>
          </div>
          {/* 문의하기 게시판 */}
          <div className={styles.inquireListView}>
            <div className={styles.inquireListHeader}>
              <span>문의내역</span>
              <span>제목</span>
              <span>부서명</span>
              <span>문의일</span>
              <span>답변</span>
            </div>
            {/* 문의 내용 */}
            <div className={styles.inquireListItems}>
              {inquireItems.map((item) => (
                <div
                  key={item.id}
                  className={styles.inquireListItem}
                  onClick={() => handleItemClick(item)} // 클릭 시 상세 모달 열기
                >
                  <span className={styles.inquireCategory}>{item.category}</span>
                  <span className={styles.inquireTitle}>{item.title}</span>
                  <span className={styles.inquireAuthor}>{item.author}</span>
                  <span className={styles.inquireDate}>{item.date}</span>
                  <span className={styles.inquireAnswer}>
                    {item.answer ? "Y" : "N"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 문의내용 작성 팝업창 */}
        {isModalOpen && (
          <div className={styles.modalOverlay}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
              <h2>문의 작성</h2>
              <form>
                <div className={styles.formGroup}>
                  <label>문의내역</label>
                  <select
                    className={styles.select}
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    <option value="데이터 문의">데이터 문의</option>
                    <option value="기술관련 문의">기술관련 문의</option>
                    <option value="서비스 추가 문의">서비스 추가 문의</option>
                    <option value="시스템 오류">시스템 오류</option>
                    <option value="기타">기타</option>
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label>제목</label>
                  <input
                    type="text"
                    value={title}
                    placeholder="제목을 입력하세요"
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>내용</label>
                  <textarea
                    value={content}
                    placeholder="내용을 입력하세요"
                    onChange={(e) => setContent(e.target.value)}
                  ></textarea>
                </div>
                <div className={styles.modalActions}>
                  <button type="button" onClick={closeModal} className={styles.closeBtn}>
                    닫기
                  </button>
                  <button type="submit" onClick={handleCreate} className={styles.submitBtn}>
                    확인
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* 문의 상세 보기 팝업창 */}
        {isDetailModalOpen && selectedItem && (
          <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
              <h2>문의 상세</h2>
              <p><strong>문의 일자</strong> | {selectedItem.date}</p>
              <p><strong>작성자</strong> | {selectedItem.author}</p>
              <p><strong>문의내역</strong> | {selectedItem.category}</p>
              <div className={styles.line}></div>
              <p><strong>제목</strong></p>
              <p>{selectedItem.title}</p>
              <p><strong>내용</strong></p>
              <p>{selectedItem.content}</p>
              <div className={styles.line}></div>
              <p><strong>답변</strong></p>
              <p>{selectedItem.answer || "답변 대기 중"}</p>

              {/* 관리자 답변작성 */}
              {isAdmin && (
                <div className={styles.formGroup}>
                  <div className={styles.line}></div>
                  <label>답변 작성</label>
                  <textarea
                    value={adminAnswer}
                    placeholder="답변을 입력하세요"
                    onChange={(e) => setAdminAnswer(e.target.value)}
                  ></textarea>
                </div>
              )}

              <div className={styles.modalActions}>
                <button type="button" onClick={closeModal} className={styles.closeBtn}>
                  닫기
                </button>
                {isAdmin && (
                  <button
                    type="button"
                    onClick={handleAnswerSubmit}
                    className={styles.submitBtn}
                  >
                    답변 전송
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Inquire;
