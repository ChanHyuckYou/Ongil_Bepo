import {useState, useEffect, useRef} from "react";
import {useParams, useNavigate} from "react-router-dom";
import {
  getPostDetail,
  createPost,
  updatePost,
  deletePost,
  uploadFile,
  deleteFile, getSocket
} from "../components/ApiRoute/board.jsx";
import styles from "../styles/BoardCreate.module.css";

const BoardCreate = () => {
  const {postId} = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("데이터 문의");
  const [isPublic, setIsPublic] = useState(true);
  const [newFiles, setNewFiles] = useState([]);
  const isEdit = !!postId;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const socketRef = useRef(null);
  // (2) board 페이지에서만 socket 연결 생성 및 이벤트 처리
  useEffect(() => {
    socketRef.current = getSocket();
    const socket = socketRef.current;
    // 페이지 언마운트 시 소켓 연결 해제
    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (isEdit) {
      (async () => {
        try {
          const data = await getPostDetail(postId);
          const postData = data.post;
          setTitle(postData.post_title);
          setContent(postData.post_text);
          setCategory(postData.post_category || "데이터 문의");
          setIsPublic(postData.board_id === 1);
        } catch (error) {
          console.error("게시글 불러오기 오류:", error);
          alert(error.message);
        }
      })();
    }
  }, [isEdit, postId]);

  const handleFileChange = (e) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setNewFiles((prev) => [...prev, ...filesArray]);
    }
  };

  const handleRemoveFile = (index) => {
    setNewFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!title || !content) {
      setErrorMessage("제목과 내용을 입력해주세요.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      let postIdResult;
      if (!isEdit) {
        const payload = {
          board_id: isPublic ? 1 : 0,
          post_title: title,
          post_category: category,
          post_text: content,
        };

        const createResult = await createPost(payload);
        const newPost = createResult.post;
        if (!newPost || !newPost.post_id) {
          throw new Error("게시글 ID를 확인할 수 없습니다.");
        }
        postIdResult = newPost.post_id;
      } else {
        const payload = {
          post_title: title,
          post_category: category,
          post_text: content,
        };

        await updatePost(postId, payload);
        postIdResult = postId;
      }

      for (const file of newFiles) {
        await uploadFile(postIdResult, file);
      }

      alert(isEdit ? "게시글이 수정되었습니다." : "게시글이 작성되었습니다.");
      navigate("/board-main");
    } catch (error) {
      console.error(isEdit ? "게시글 수정 오류:" : "게시글 작성 오류:", error);
      setErrorMessage(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("정말로 게시글을 삭제하시겠습니까?")) {
      return;
    }
    try {
      await deletePost(postId);
      alert("게시글이 삭제되었습니다.");
      navigate("/board-main");
    } catch (error) {
      console.error("게시글 삭제 오류:", error);
      alert(error.message);
    }
  };

  const handleDeleteFileServer = async (fileId) => {
    if (!window.confirm("파일을 삭제하시겠습니까?")) {
      return;
    }
    try {
      await deleteFile(fileId);
      alert("파일이 삭제되었습니다.");
    } catch (error) {
      console.error("파일 삭제 오류:", error);
      alert(error.message);
    }
  };

  return (
      <div className={styles.boardcreate}>
        <div className={styles.boardForm}>
          <h2>{isEdit ? "게시글 수정" : "게시글 작성"}</h2>

          <div className={styles.formGroup}>
            <label>공개 여부</label>
            <select
                className={styles.select}
                value={isPublic ? "1" : "0"}
                onChange={(e) => setIsPublic(e.target.value === "1")}
            >
              <option value="1">공개글</option>
              <option value="0">비밀글</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label>게시글 유형</label>
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

          <div className={styles.postForm}>
            <label>제목</label>
            <input
                type="text"
                placeholder="제목을 입력하세요"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={styles.inputField}
            />
          </div>

          <div className={styles.contentForm}>
            <label>내용</label>
            <textarea
                placeholder="내용을 입력하세요"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className={styles.textArea}
            ></textarea>
          </div>

          <div className={styles.fileForm}>
            <label htmlFor="file_input"
                   className={styles.file_label}>파일업로드</label>
            <input
                type="file"
                id="file_input"
                onChange={handleFileChange}
                className={styles.file_input}
                multiple
            />
            <div className={styles.fileList}>
              {newFiles.map((file, index) => (
                  <div key={index} className={styles.fileItem}>
                    <span className={styles.fileName}>{file.name}</span>
                    <button type="button" className={styles.removeButton}
                            onClick={() => handleRemoveFile(index)}>
                      X
                    </button>
                  </div>
              ))}
            </div>
          </div>

          {errorMessage && <div
              className={styles.errorMessage}>{errorMessage}</div>}

          <div className={styles.createBtnWrapper}>
            <button
                className={styles.createBtn}
                onClick={handleSubmit}
                disabled={isSubmitting}
            >
              {isEdit ? "수정" : "작성"}
            </button>

            {isEdit && (
                <button className={styles.deleteBtn} onClick={handleDelete}>
                  삭제
                </button>
            )}
          </div>
        </div>
      </div>
  );
};

export default BoardCreate;
