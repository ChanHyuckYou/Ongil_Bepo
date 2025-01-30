import React, { useState, useRef, useEffect } from "react";
import { io } from "socket.io-client";
import styles from "../styles/BoardCreate.module.css";
import useNavigations from "../components/Navigation/Navigations.jsx";
import axios from "axios";
import { useLocation } from "react-router-dom";

const webSocketUrl = "http://localhost:3000";
const socket = io(webSocketUrl);

const BoardCreate = () => {
  const location = useLocation();
  const postDetail = location.state?.postDetail || null; // 수정 데이터

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("데이터 문의");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [fileUrls, setFileUrls] = useState([]); // 기존 업로드된 파일 URL
  const navigateTo = useNavigations(); // 페이지 이동
  const jwt = localStorage.getItem("jwt");

  const ref = useRef(null);

  // ✅ 기존 게시글 데이터를 불러와서 상태 초기화
  useEffect(() => {
    if (postDetail) {
      setTitle(postDetail.title);
      setContent(postDetail.content.replace(/<br\s*\/?>/g, "\n"));
      setCategory(postDetail.category);
      setFileUrls(postDetail.files || []); // 기존 파일 URL 저장
    }
  }, [postDetail]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const fileUrlList = files.map((file) => URL.createObjectURL(file));

    setSelectedFiles((prevFiles) => [...prevFiles, ...files]); // 새 파일 추가
    setFileUrls((prevUrls) => [...prevUrls, ...fileUrlList]); // 미리보기 URL 추가
  };

  const handleRemoveFile = (index) => {
    setSelectedFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    setFileUrls((prevUrls) => prevUrls.filter((_, i) => i !== index));
  };

  const handleCreate = async () => {
    if (!title || !content) {
      alert("제목과 내용을 입력해주세요.");
      return;
    }

    navigateTo("BoardMain");

    const formattedContent = content.replace(/\n/g, "<br />");

    // ✅ 파일 업로드 로직
    const uploadFiles = async () => {
      const uploadedFileUrls = [...fileUrls]; // 기존 파일 유지
      for (let file of selectedFiles) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("type", "boardPost");

        try {
          const response = await axios.post("서버 업로드 API URL", formData, {
            headers: {
              Authorization: `Bearer ${jwt}`,
              "Content-Type": "multipart/form-data",
            },
          });
          uploadedFileUrls.push(response.data.fileUrl);
        } catch (error) {
          console.error("파일 업로드 실패:", error);
        }
      }
      return uploadedFileUrls;
    };

    const newPost = {
      id: Date.now(),
      category,
      title,
      content: formattedContent,
      author: "사용자",
      views: 0,
      date: new Date().toISOString().split("T")[0],
      files: await uploadFiles(), // 업로드된 파일 URL 포함
    };

    socket.emit("createPost", newPost);
    alert("게시글이 작성되었습니다!");

    setTitle("");
    setContent("");
    setSelectedFiles([]);
    setFileUrls([]);
  };

  // ✅ 게시글 수정 로직
  const handleSave = async () => {
    if (!title || !content) {
      alert("제목과 내용을 입력해주세요.");
      return;
    }

    const updatedPost = {
      postId: postDetail.id, // 🔥 `postId`를 명확하게 지정
      category,
      title,
      content: content.replace(/\n/g, "<br />"),
      author: postDetail.author,
      files: selectedFiles,
    };

    // 서버에 게시글 수정 요청
    socket.emit("updatePost", updatedPost, (response) => {
      if (response.success) {
        alert("게시글이 수정되었습니다!");

        // 🚀 navigate가 제대로 실행되도록 setTimeout 사용
        setTimeout(() => {
          navigateTo("BoardDetail", { postId: postDetail.id })
        }, 100);
      } else {
        console.error("게시글 수정 실패:", response.message);
      }
    });
  };

  return (
    <div className={styles.boardcreate}>
      <div className={styles.boardForm}>
        <div className={styles.formGroup}>
          <h2>{postDetail ? "게시글 수정" : "게시판 글쓰기"}</h2>
          <label>게시글 유형</label>
          <select className={styles.select} value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="데이터 문의">데이터 문의</option>
            <option value="기술관련 문의">기술관련 문의</option>
            <option value="서비스 추가 문의">서비스 추가 문의</option>
            <option value="시스템 오류">시스템 오류</option>
            <option value="기타">기타</option>
          </select>
        </div>

        <div className={styles.postForm}>
          <label>제목</label>
          <input type="text" placeholder="제목을 입력하세요" value={title} onChange={(e) => setTitle(e.target.value)} className={styles.inputField} />
        </div>

        <div className={styles.contentForm}>
          <label>내용</label>
          <textarea placeholder="내용을 입력하세요" value={content} onChange={(e) => setContent(e.target.value)} className={styles.textArea}></textarea>
        </div>

        <div className={styles.fileForm}>
          <label htmlFor="file_input" className={styles.file_label}>파일업로드</label>
          <input type="file" ref={ref} id="file_input" onChange={handleFileChange} className={styles.file_input} multiple />
          <div className={styles.fileList}>
            {fileUrls.map((url, index) => (
              <div key={index} className={styles.fileItem}>
                <span className={styles.fileName}>{selectedFiles[index]?.name || "첨부 파일"}</span>
                <button type="button" className={styles.removeButton} onClick={() => handleRemoveFile(index)}>X</button>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.createBtnWrapper}>
          <button className={styles.createBtn} onClick={postDetail ? handleSave : handleCreate}>
            {postDetail ? "수정 완료" : "작성"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BoardCreate;
