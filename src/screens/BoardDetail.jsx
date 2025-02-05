import React, {useState, useEffect} from "react";
import {useParams, useNavigate} from "react-router-dom";
import {
  getPostDetail,
  addComment,
  addAnswer,
  getPostFiles,
  deleteFile,
  downloadFile,
  deletePost,
} from "../components/ApiRoute/board.jsx";

import styles from "../styles/BoardDetail.module.css";

const BoardDetail = () => {
  const {postId} = useParams();
  const navigate = useNavigate();

  const [postDetail, setPostDetail] = useState(null);
  const [files, setFiles] = useState([]);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  const [newComment, setNewComment] = useState("");
  const [adminAnswer, setAdminAnswer] = useState("");

  const currentUser = localStorage.getItem("user") || "사용자";
  const isAdmin = localStorage.getItem('is_admin') === '1';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getPostDetail(postId);
        const postData = data.post;
        setPostDetail(postData);
        console.log(isAdmin)

        if (postData.comments) {
          setComments(postData.comments);
        }

        try {
          const filesData = await getPostFiles(postId);
          setFiles(filesData.files);
        } catch (err) {
          if (err.message.includes("No files found")) {
            setFiles([]);
          } else {
            alert(err.message);
          }
        }
      } catch (error) {
        console.error("게시글 조회 오류:", error);
        navigate("/not-found");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [postId, navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!postDetail) {
    return null;
  }

  // 댓글 작성
  const handleAddComment = async () => {
    if (!newComment.trim()) {
      return;
    }
    try {
      await addComment(postId, newComment);
      alert("댓글이 등록되었습니다.");

      const newComm = {
        author: currentUser,
        content: newComment,
        date: new Date().toISOString(),
      };
      setComments((prev) => [...prev, newComm]); // 댓글 목록 업데이트
      setNewComment("");
    } catch (error) {
      console.error("댓글 작성 오류:", error);
      alert(error.message);
    }
  };

  // 관리자 답변 작성
  const handleAdminAnswer = async () => {
    if (!adminAnswer.trim()) {
      return;
    }
    try {
      await addAnswer(postId, adminAnswer);
      alert("관리자 답변이 등록되었습니다.");

      const adminComment = {
        author: "관리자",
        content: adminAnswer,
        date: new Date().toISOString(),
      };
      setComments((prev) => [...prev, adminComment]); // 댓글 목록에 관리자 답변 추가
      setAdminAnswer("");
    } catch (error) {
      console.error("관리자 답변 작성 오류:", error);
      alert(error.message);
    }
  };

  // 게시글 삭제
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

  // 파일 다운로드
  const handleDownloadFile = (fileId) => {
    downloadFile(fileId);
  };

  // 파일 삭제
  const handleDeleteFile = async (fileId) => {
    if (!window.confirm("파일을 삭제하시겠습니까?")) {
      return;
    }
    try {
      await deleteFile(fileId);
      alert("파일이 삭제되었습니다.");

      try {
        const updatedFiles = await getPostFiles(postId);
        setFiles(updatedFiles.files);
      } catch (err) {
        if (err.message.includes("No files found")) {
          setFiles([]);
        } else {
          alert(err.message);
        }
      }
    } catch (error) {
      console.error("파일 삭제 오류:", error);
      alert(error.message);
    }
  };

  // 게시글 수정 페이지 이동
  const goToEditPage = () => {
    navigate(`/board-create/${postId}`);
  };

  // "T" → 공백 으로 대체해 출력
  const displayTime = postDetail.post_time ? postDetail.post_time.replace("T",
      " ") : "";

  return (
      <div className={styles.boarddetail}>
        <div className={styles.board}>
          {/* 제목 */}
          <div className={styles.titleForm}>{postDetail.post_title}</div>

          {/* 메타 정보 */}
          <div className={styles.metaInfo}>
            <p>작성자: {postDetail.user_email}</p>
            <p>카테고리: {postDetail.post_category}</p>
            <p>조회수: {postDetail.views}</p>
            {/* 작성일: T를 공백으로 치환 */}
            <p>작성일: {displayTime}</p>
          </div>

          <div className={styles.line}></div>

          {/* 내용 */}
          <div className={styles.contentForm}>{postDetail.post_text}</div>

          <div className={styles.line}></div>

          {/* 파일 목록 */}
          <div className={styles.fileList}>
            <h3>파일 목록</h3>

            {files && files.length > 0 ? (
                files.map((file) => (
                    <div key={file.file_id}>
                      <span>{file.file_name}</span>
                      <button
                          onClick={() => handleDownloadFile(file.file_id)}>다운로드
                      </button>
                      <button
                          onClick={() => handleDeleteFile(file.file_id)}>삭제
                      </button>
                    </div>
                ))
            ) : (
                <p>파일이 없습니다.</p>
            )}
          </div>

          {/* 댓글 영역 */}
          <div className={styles.commentsView}>
            <h3>댓글</h3>
            <ul className={styles.commentList}>
              {comments.map((comment, idx) => (
                  <li key={idx} className={styles.commentItem}>
                    <strong>{comment.author}</strong>
                    <span className="commentContent">{comment.content}</span>
                    <span className="commentDate">
                  {new Date(comment.date).toLocaleString()}
                </span>
                  </li>
              ))}
            </ul>

              {!isAdmin && (
                <div className={styles.commentInput}>
                  <input
                    type="text"
                    value={newComment}
                    placeholder="댓글 입력"
                    onChange={(e) => setNewComment(e.target.value)}
                  />
                  <button onClick={handleAddComment}>등록</button>
                </div>
              )}
              {isAdmin && (
                  <div className={styles.commentInput}>
                    <input
                      type="text"
                      value={adminAnswer}
                      placeholder="답변 입력"
                      onChange={(e) => setAdminAnswer(e.target.value)}
                    />
                    <button onClick={handleAdminAnswer}>답변 등록</button>
                  </div>
              )}
          </div>

          {/* 수정/삭제 버튼을 .board 내부로 배치 */}
          <div className={styles.buttonInput}>
            {postDetail.user_email === currentUser && (
                <div>
                  <button className={styles.editButton} onClick={goToEditPage}>
                    수정
                  </button>
                  <button className={styles.deleteButton}
                          onClick={handleDelete}>
                    삭제
                  </button>
                </div>
            )}
          </div>
        </div>
      </div>
  );
};

export default BoardDetail;
