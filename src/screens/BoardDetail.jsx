import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { deleteFile, downloadFile, getPostDetail, getCommentsAndAnswers, deleteComment, getPostFiles, deletePost, addComment, addAnswer, deleteAnswer } from "../components/ApiRoute/board.jsx";
import {loadUserInfo} from '../components/ApiRoute/mypage.jsx';
import styles from "../styles/BoardDetail.module.css";
import axios from 'axios';

const BoardDetail = () => {
  const { postId } = useParams();
  const navigate = useNavigate();

  const [postDetail, setPostDetail] = useState(null);
  const [files, setFiles] = useState([]);
  const [comments, setComments] = useState([]);
  const [adminAnswers, setAdminAnswers] = useState([]);  // 관리자 답변 상태 추가
  const [loading, setLoading] = useState(true);
  const [adminAnswer, setAdminAnswer] = useState("");  // 관리자 답변 상태 추가
  const [newComment, setNewComment] = useState("");
  const [userInfo, setUserInfo] = useState(
        {user_email: "", user_name: "", user_dept: "", jurisdiction: ""});

  const accessToken = localStorage.getItem("access_token");
  const isAdmin = localStorage.getItem('is_admin') === '1';

  // 유저 정보 불러오기
  const fetchUserInfo = async () => {
    const data = await loadUserInfo(accessToken);  // loadUserInfo 호출하여 데이터 가져오기
    if (data) {
      setUserInfo(data.user_info[0]);  // 데이터 저장
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {

        // 게시글 데이터 불러오기
        const data = await getPostDetail(postId);
        setPostDetail(data.post);

        // 댓글과 답변 불러오기
        const commentsData = await getCommentsAndAnswers(postId);
        setComments(commentsData.comments || []);
        const answersData = await getCommentsAndAnswers(postId);
        setAdminAnswers(answersData.admin_answers || []);

        // 파일 데이터 불러오기
        const filesData = await getPostFiles(postId);
        setFiles(filesData.files || []);
      } catch (error) {
        console.error("게시글 조회 오류:", error);
        navigate("/not-found");
      } finally {
        setLoading(false);
      }
    };
    fetchUserInfo();
    fetchData();
  }, [postId, navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!postDetail) {
    return null;
  }

  // -- 유저 기능 --
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

  // 댓글 작성
  const handleAddComment = async () => {
    if (!newComment.trim()) {
      return;
    }
    try {
      await addComment(postId, newComment);
      setNewComment("");  // 댓글 입력 필드 초기화

      // 댓글 목록 갱신
      const commentsData = await getCommentsAndAnswers(postId);
      setComments(commentsData.comments || []);
    } catch (error) {
      console.error("댓글 작성 오류:", error);
      alert(error.message);
    }
  };

  // 댓글 삭제
  const handleDeleteComment = async (commentId) => {
    if (window.confirm("정말로 댓글을 삭제하시겠습니까?")) {
      try {
        // 댓글 삭제 API 호출
        await deleteComment(postId, commentId);

        // 댓글 목록 갱신
        const commentsData = await getCommentsAndAnswers(postId);
        setComments(commentsData.comments || []);

        alert("댓글이 삭제되었습니다.");
      } catch (error) {
        console.error("댓글 삭제 오류:", error);
        alert(error.message);
      }
    }
  };

  // -- 관리자 기능 --
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

  // 관리자 답변 등록
  const handleAdminAnswer = async () => {
    if (!adminAnswer.trim()) {
      return;
    }
    try {
      await addAnswer(postId, adminAnswer);
      alert("관리자 답변이 등록되었습니다.");
      setAdminAnswer("");
      // 댓글 목록 갱신
      const answersData = await getCommentsAndAnswers(postId);
      setAdminAnswers(answersData.admin_answers || []);
    } catch (error) {
      console.error("관리자 답변 작성 오류:", error);
      alert(error.message);
    }
  };

  // 관리자 답변 삭제
  const handleDeleteAnswer = async (answerId) => {
    if (!window.confirm("정말로 이 답변을 삭제하시겠습니까?")) {
      return;
    }
    try {
      await deleteAnswer(postId, answerId);
      alert("답변이 삭제되었습니다.");

      // 삭제된 답변을 제외한 나머지 답변만 남기기
      setAdminAnswers((prev) => prev.filter((answer) => answer.answer_id !== answerId));
    } catch (error) {
      console.error("답변 삭제 오류:", error);
      alert(error.message);
    }
  };

  const displayTime = postDetail.post_time ? postDetail.post_time.replace("T", " ") : "";

  return (
    <div className={styles.boarddetail}>
      <div className={styles.buttonInput}>
        {(postDetail.user_email === userInfo.user_email || isAdmin) && (
          <div>
          {postDetail.user_email === userInfo.user_email && (
              <button className={styles.editButton} onClick={() => navigate(`/board-create/${postId}`)}>
                수정
              </button>
          )}

          {(postDetail.user_email === userInfo.user_email || isAdmin) && (
              <button className={styles.deleteButton} onClick={handleDelete}>
                삭제
              </button>
          )}
          </div>
        )}
      </div>

      <div className={styles.board}>
        <div className={styles.titleForm}>{postDetail.post_title}</div>
        <div className={styles.metaInfo}>
          <p>작성자: {postDetail.user_name}</p>
          <p>관할구역-부서: {postDetail.jurisdiction}-{postDetail.user_dept}</p>
          <p>카테고리: {postDetail.post_category}</p>
          <p>조회수: {postDetail.views}</p>
          <p>작성일: {displayTime}</p>
        </div>

        <div className={styles.line}></div>
        <div className={styles.contentForm} dangerouslySetInnerHTML={{ __html: postDetail.post_text }} />
        <div className={styles.line}></div>
        <div className={styles.fileList}>
          <h3>파일 목록</h3>
          {files.length > 0 ? (
            files.map((file) => (
              <div key={file.file_id}>
                <span>{file.file_name} </span>
                <button onClick={() => handleDownloadFile(file.file_id)}>다운로드</button>
                {isAdmin && <button onClick={() => handleDeleteFile(file.file_id)}>삭제</button>}
              </div>
            ))
          ) : (
            <p>파일이 없습니다.</p>
          )}
        </div>

        <div className={styles.commentsView}>
          <h3>댓글</h3>
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
                placeholder="관리자 답변 입력"
                onChange={(e) => setAdminAnswer(e.target.value)}
              />
              <button onClick={handleAdminAnswer}>답변 등록</button>
            </div>
          )}
          <h3>관리자 답변</h3>
          {adminAnswers.length > 0 ? (
            <ul className={styles.commentList}>
              {adminAnswers.map((answer) => (
                <li key={answer.answer_id} className={styles.answerItem}>
                  <strong>관리자</strong>
                  <p>{answer.answer_text}</p>
                  <span className="answerDate">
                    {new Date(answer.answer_date).toLocaleString()}
                  </span>
                  {isAdmin && (
                    <button
                      className={styles.deleteButton}
                      onClick={() => handleDeleteAnswer(answer.answer_id)}
                    >
                      삭제
                    </button>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p>등록된 답변이 없습니다.</p>
          )}
          <ul className={styles.commentList}>
            {comments.map((comment) => (
              <li key={comment.comment_id} className={styles.commentItem}>
                <strong>{comment.user_name} ({comment.jurisdiction}-{comment.user_dept}) </strong>
                <p className="commentContent">{comment.comment}</p>
                <span className="commentDate">
                  {new Date(comment.comment_date).toLocaleString()}
                </span>
                {(comment.user_email === userInfo.user_email || isAdmin) && (
                  <button
                    className={styles.deleteButton}
                    onClick={() => handleDeleteComment(comment.comment_id)}
                  >
                    삭제
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default BoardDetail;
