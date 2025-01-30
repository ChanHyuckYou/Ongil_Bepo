import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import styles from "../styles/BoardDetail.module.css";

const webSocketUrl = "http://localhost:3000";
const socket = io(webSocketUrl);

const BoardDetail = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [postDetail, setPostDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    socket.emit("getPostDetail", Number(postId), (response) => {
      if (response.success) {
        setPostDetail(response.data);
        setComments(response.data.comments || []);
      } else {
        console.error(response.message);
      }
      setLoading(false);
    });

    socket.off("newComment").on("newComment", (comment) => {
      setComments((prev) => [...prev, comment]);
    });

    socket.off("deletedComment").on("deletedComment", ({ postId: deletedPostId, commentDate }) => {
      if (deletedPostId === Number(postId)) {
        setComments((prev) =>
          prev.filter((comment) => new Date(comment.date).toISOString() !== new Date(commentDate).toISOString())
        );
      }
    });

    return () => {
      socket.off("newComment");
      socket.off("deletedComment");
    };
  }, [postId]);

  // 수정 버튼
  const handleEditPost = () => {
    navigate(`/board-create`, { state: { postDetail } });
  };

  const handleDeletePost = () => {
    const currentUser = "사용자"; // 로그인한 사용자 (이 값을 실제 로그인한 사용자로 설정해야 함)

    if (postDetail.author !== currentUser) {
      alert("본인이 작성한 게시글만 삭제할 수 있습니다.");
      return;
    }

    if (!window.confirm("게시글을 삭제하시겠습니까?")) return;

    socket.emit("deletePost", { postId: Number(postId), author: currentUser }, (response) => {
      if (response.success) {
        alert("게시글이 삭제되었습니다.");
        navigate("/board-main");
      } else {
        console.error("게시글 삭제 실패:", response.message);
      }
    });
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;

    const comment = {
      postId: Number(postId),
      author: "사용자",
      content: newComment,
      date: new Date().toISOString(),
    };

    socket.emit("createComment", comment, (response) => {
      if (response.success) {
        setNewComment("");
      } else {
        console.error("댓글 등록 실패:", response.message);
      }
    });
  };

  // 댓글 삭제
  const handleDeleteComment = (commentDate, author) => {
    const currentUser = "사용자"; // 로그인한 사용자 (실제 연동 필요)

    if (author !== currentUser) {
      alert("본인 댓글만 삭제할 수 있습니다.");
      return;
    }

    console.log("삭제 요청 데이터:", { postId, commentDate, author });

    socket.emit("deleteComment", { postId: Number(postId), commentDate, author }, (response) => {
      if (response.success) {
        alert("댓글이 삭제되었습니다.");
        setComments((prev) =>
          prev.filter((comment) => new Date(comment.date).toISOString() !== new Date(commentDate).toISOString())
        );
      } else {
        console.error("댓글 삭제 실패:", response.message);
      }
    });
  };

  if (loading) return <div>Loading...</div>;
  if (!postDetail) return <div>게시글을 찾을 수 없습니다.</div>;

  return (
    <div className={styles.boarddetail}>
      {/* 수정 및 삭제 버튼: 게시글 작성자와 로그인한 사용자가 같을 때만 표시 */}
      {postDetail.author === "사용자" && (
        <div className={styles.buttonInput}>
          <button className={styles.editButton} onClick={handleEditPost}>수정</button>
          <button className={styles.deleteButton} onClick={handleDeletePost}>게시글 삭제</button>
        </div>
      )}
      <div className={styles.board}>
        <h2 className={styles.titleForm}>{postDetail.title}</h2>
        <div className={styles.metaInfo}>
          <p>작성자: {postDetail.author}</p>
          <p>카테고리: {postDetail.category}</p>
          <p>조회수: {postDetail.views}</p>
          <p>작성일: {postDetail.date}</p>
        </div>
        <div className={styles.line} />
        {/* 내용 띄어쓰기 */}
        <div className={styles.contentForm} dangerouslySetInnerHTML={{ __html: postDetail.content }}/>
        <div className={styles.line} />
        {postDetail.files?.length > 0 ? (
          <div className={styles.fileList}>
            {postDetail.files.map((file, index) => (
              <div key={index} className={styles.fileItem}>
                <span className={styles.fileName}>{file.name}</span>
                {file.downloadUrl && <a href={file.downloadUrl} download>다운로드</a>}
              </div>
            ))}
          </div>
        ) : (
          <p>파일이 없습니다.</p>
        )}
      </div>
      <div className={styles.commentsView}>
        <h3>댓글</h3>
        <div className={styles.commentInput}>
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddComment();
              }
            }}
            placeholder="댓글을 입력하세요"
          />
          <button onClick={handleAddComment}>등록</button>
        </div>
        {/* 추가되는 댓글 폼 */}
        <ul className={styles.commentList}>
          {comments.map((comment, index) => (
            <li key={index} className={styles.commentItem}>
              {/* 댓글 내용 */}
              <strong>{comment.author}</strong>
              <p className={styles.commentContent}>{comment.content}</p>
              <span className={styles.commentDate}>
                {new Date(comment.date).toLocaleString()}
              </span>
                {/* 삭제 버튼 */}
                {comment.author === "사용자" && (
                  <button
                    className={styles.deleteButton}
                    onClick={() => handleDeleteComment(comment.date, comment.author)}
                  >
                    삭제
                  </button>
                )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default BoardDetail;
