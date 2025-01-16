import {useState} from "react";
import {io} from "socket.io-client";
import styles from "../styles/BoardCreate.module.css";

// WebSocket 연결
const socket = io("http://localhost:3000");

const BoardCreate = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleCreate = () => {
    if (!title || !content) {
      alert("제목과 내용을 입력해주세요.");
      return;
    }

    // 서버로 게시글 데이터 전송
    const newPost = {
      title,
      content,
      author: "사용자", // 예시
      views: 0,
      date: new Date().toISOString().split("T")[0], // YYYY-MM-DD 형식
    };

    socket.emit("createPost", newPost);
    alert("게시글이 작성되었습니다!");

    // 입력 필드 초기화
    setTitle("");
    setContent("");
  };

  return (
      <div className={styles.boardcreate}>
        <div className={styles.boardForm}>
          <div className={styles.postForm}>
            <input
                type="text"
                placeholder="제목을 입력하세요"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={styles.inputField}
            />
          </div>

          <div className={styles.contentForm}>
          <textarea
              placeholder="내용을 입력하세요"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className={styles.textArea}
          ></textarea>
          </div>

          <div className={styles.createBtnWrapper}>
            <button className={styles.createBtn} onClick={handleCreate}>
              작성
            </button>
          </div>
        </div>
      </div>
  );
};

export default BoardCreate;
