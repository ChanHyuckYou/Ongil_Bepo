import {useState, useEffect, useRef} from "react";
import {useParams, useNavigate} from "react-router-dom";
import {
  getPostDetailForEdit,
  downloadFileAsBlob,
  getPostDetail,
  getPostFiles,
  createPost,
  updatePost,
  deletePost,
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
                  const data = await getPostDetailForEdit(postId);  // 게시글과 파일을 한번에 가져오기

                  const filesWithNames = await Promise.all(
                      data.files.map(async (file) => {
                          return await downloadFileAsBlob(file.file_id, file.file_name);
                      })
                  );

                  setNewFiles(filesWithNames || []); // 파일을 File 객체로 변환 후 state에 저장
                  setTitle(data.post.post_title);
                  setContent(data.post.post_text.replace(/<br\s*\/?>/g, "\n"));
                  setCategory(data.post.post_category || "데이터 문의");
                  setIsPublic(data.post.board_id === 1);

              } catch (error) {
                  console.error("게시글 불러오기 오류:", error);
                  setErrorMessage(error.message);  // error handling
              }
          })();
      }
  }, [isEdit, postId]);

  // 파일 선택
  const handleFileChange = (e) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setNewFiles((prevFiles) => [...prevFiles, ...filesArray]);
    }
  };

  // 파일 선택 취소
  const handleRemoveFile = (index) => {
    setNewFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // 게시글 작성
  const handleSubmit = async () => {
      if (!title || !content) {
          setErrorMessage("제목과 내용을 입력해주세요.");
          return;
      }
      setIsSubmitting(true);
      setErrorMessage("");

      try {
          // FormData 생성
          const formData = new FormData();
          formData.append("board_id", isPublic ? 1 : 0);
          formData.append("post_title", title);
          formData.append("post_category", category);
          formData.append("post_text", content.replace(/\n/g, "<br />"));

          // 파일 추가
          if (newFiles.length > 0) {
              newFiles.forEach((file) => {
                  console.log("Appending file:", file);
                  formData.append("files", file);
              });
          }

          if (!isEdit) {
              await createPost(formData);
          } else {
              await updatePost(postId, formData);
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
                  <span className={styles.fileName}>{file.name}
                  </span>
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
          </div>
        </div>
      </div>
  );
};

export default BoardCreate;
