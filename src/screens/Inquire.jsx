import React, { useState, useEffect } from 'react';
import styles from '../styles/Inquire.module.css';

import {io} from "socket.io-client";
const webSocketUrl = "http://localhost:3000";

const socket = io(webSocketUrl);

const Inquire = () => {
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 열림 상태
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState(""); // 기본값 설정
  const [inquireItems, setInquireItems] = useState([]);

  useEffect(() => {
    // (1) 서버에서 초기 게시글 데이터를 받아옴
    const handleInitPosts = (posts) => {
      console.log("Initial posts:", posts);
      setInquireItems(posts);
    };

    // (2) 서버에서 새 게시글이 생성되었다고 브로드캐스트가 오면 받음
    const handleNewPost = (newPost) => {
      console.log("New post received:", newPost);
      setInquireItems((prevItems) => [...prevItems, newPost]);
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

  const openCreate = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleCreate = (e) => {
    e.preventDefault(); // 페이지 새로고침 방지

    if (!title || !content) {
      alert("제목과 내용을 입력해주세요.");
      return;
    }

    const newPost = {
      category,
      title,
      content,
      author: "사용자",
      date: new Date().toISOString().split("T")[0],
      answer: "Y",
    };

    socket.emit("createPost", newPost);
    alert("문의가 접수되었습니다!");

    // 상태 초기화
    setCategory("");
    setTitle("");
    setContent("");
    closeModal(); // 모달 닫기
  };

  return (
    <div className="container">
      <div className={styles.inquire}>
        <div className={styles.inquireForm}>
          {/* 작성 버튼 */}
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

          {/* 문의게시판 리스트 */}
          <div className={styles.inquireListView}>
            <div className={styles.inquireListHeader}>
              <span>문의내역</span>
              <span>제목</span>
              <span>부서명</span>
              <span>문의일</span>
              <span>답변</span>
            </div>
            <div className={styles.inquireListItems}>
              {inquireItems.map((item) => (
                <div key={item.id} className={styles.inquireListItem}>
                  <span className={styles.inquireCategory}>{item.category}</span>
                  <span className={styles.inquireTitle}>{item.title}</span>
                  <span className={styles.inquireAuthor}>{item.author}</span>
                  <span className={styles.inquireDate}>{item.date}</span>
                  <span className={styles.inquireAnswer}>{item.answer}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 모달 */}
        {isModalOpen && (
          <div className={styles.modalOverlay}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
              <h2>문의 작성</h2>
              <form>
                <div className={styles.formGroup}>
                  <label>문의내역</label>
                    <select
                      className={styles.select}
                      value={category} // 상태로 값 제어
                      onChange={(e) => setCategory(e.target.value)} // 값 변경 시 상태 업데이트
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
                  <input type="text"
                         value={title}
                         placeholder="제목을 입력하세요"
                         onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>내용</label>
                  <textarea value={content}
                            placeholder="내용을 입력하세요"
                            onChange={(e) => setContent(e.target.value)}>
                  </textarea>
                </div>
                <div className={styles.modalActions}>
                  <button type="button" onClick={closeModal} className={styles.closeBtn}>
                    닫기
                  </button>
                  <button type="submit" onClick={handleCreate} className={styles.submitBtn}>
                    저장
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Inquire;
