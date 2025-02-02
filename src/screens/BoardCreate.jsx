// src/components/BoardCreate.jsx
import {useState, useEffect, useRef} from "react";
import styles from "../styles/BoardCreate.module.css";
import useNavigations from "../components/Navigation/Navigations.jsx";
import {getSocket} from "../components/ApiRoute/board.jsx"; // getSocket() 사용

const BoardCreate = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("데이터 문의");
  const [files, setFiles] = useState([]);
  const navigateTo = useNavigations();
  const socketRef = useRef(null);

  // 페이지 마운트 시 소켓 연결 생성
  useEffect(() => {
    socketRef.current = getSocket();
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, []);

  const handleFileChange = async (e) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles((prevFiles) => [...prevFiles, ...newFiles]);

      // 파일 업로드 API 호출 예시 (필요 시 활성화)
      /*
      const formData = new FormData();
      newFiles.forEach(file => {
        formData.append('files', file);
      });
      try {
        const response = await fetch('http://localhost:3000/upload', {
          method: 'POST',
          body: formData,
        });
        const data = await response.json();
        if (data.success) {
          setFiles(prevFiles => prevFiles.map((file, index) => ({
            ...file,
            downloadUrl: data.fileUrls[index],
          })));
        } else {
          throw new Error('파일 업로드 실패');
        }
      } catch (error) {
        console.error('Error uploading files:', error);
        alert('파일 업로드에 실패했습니다. 다시 시도해주세요.');
      }
      */
    }
  };

  const handleRemoveFile = (index) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const handleNavigation = (page) => {
    navigateTo(page);
  };

  const handleCreate = () => {
    if (!title || !content) {
      alert("제목과 내용을 입력해주세요.");
      return;
    }

    // BoardMain 페이지로 이동하기 전에 게시글 생성 이벤트 emit
    const newPost = {
      // id는 서버에서 생성되거나, 임시로 Date.now()로 처리
      id: Date.now(),
      category,
      title,
      content,
      author: "사용자", // 실제 로그인 사용자 정보로 대체 필요
      views: 0,
      date: new Date().toISOString().split("T")[0],
      files,
    };

    // 소켓을 통해 createPost 이벤트 전송 (응답 처리는 서버에 따라 구현)
    if (socketRef.current) {
      socketRef.current.emit("createPost", newPost, (response) => {
        if (response.success) {
          alert("게시글이 작성되었습니다!");
          setTitle("");
          setContent("");
          setFiles([]);
          handleNavigation("BoardMain");
        } else {
          console.error("게시글 작성 실패:", response.message);
        }
      });
    }
  };

  return (
      <div className={styles.boardcreate}>
        <div className={styles.boardForm}>
          <div className={styles.formGroup}>
            <h2>게시판 글쓰기</h2>
            <label>게시글 유형</label>
            <select className={styles.select} value={category}
                    onChange={(e) => setCategory(e.target.value)}>
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
            <label htmlFor="file_input" className={styles.file_label}>
              파일업로드
            </label>
            <input
                type="file"
                id="file_input"
                onChange={handleFileChange}
                className={styles.file_input}
                multiple
            />
            <div className={styles.fileList}>
              {files.map((file, index) => (
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
