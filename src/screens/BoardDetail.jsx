// src/components/BoardDetail.jsx
import {useState, useEffect, useRef} from "react";
import {useParams, useNavigate} from "react-router-dom";
import {getSocket} from "../components/ApiRoute/board.jsx"; // getSocket() 사용
import styles from "../styles/BoardDetail.module.css";

const BoardDetail = () => {
  const {postId} = useParams();
  const navigate = useNavigate();
  const [postDetail, setPostDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  // socket 인스턴스를 저장할 ref
  const socketRef = useRef(null);

  useEffect(() => {
    // BoardDetail 페이지에 진입 시 소켓 연결 생성
    socketRef.current = getSocket();
    const socket = socketRef.current;

    // 게시글 상세정보 요청
    socket.emit("getPostDetail", Number(postId), (response) => {
      if (response.success) {
        setPostDetail(response.data);
        setComments(response.data.comments || []);
      } else {
        console.error(response.message);
      }
      setLoading(false);
    });

    // 새 댓글 이벤트 수신
    socket.on("newComment", (comment) => {
      setComments((prev) => [...prev, comment]);
    });

    // 삭제된 댓글 이벤트 수신
    socket.on("deletedComment", ({postId: deletedPostId, commentDate}) => {
      if (deletedPostId === Number(postId)) {
        setComments((prev) =>
            prev.filter(
                (comment) =>
                    new Date(comment.date).toISOString() !== new Date(
                        commentDate).toISOString()
            )
        );
      }
    });

    // 컴포넌트 언마운트 시 socket 연결 해제
    return () => {
      if (socketRef.current) {
        socketRef.current.off("newComment");
        socketRef.current.off("deletedComment");
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [postId]);

  // 수정 버튼 클릭 시 BoardCreate 페이지로 이동 (수정 시 현재 게시글 데이터를 전달)
  const handleEditPost = () => {
    navigate(`/board-create`, {state: {postDetail}});
  };

  // 게시글 삭제
  const handleDeletePost = () => {
    const currentUser = "사용자"; // 실제 로그인한 사용자 정보로 대체 필요
    if (postDetail.author !== currentUser) {
      alert("본인이 작성한 게시글만 삭제할 수 있습니다.");
      return;
    }
    if (!window.confirm("게시글을 삭제하시겠습니까?")) {
      return;
    }
    if (socketRef.current) {
      socketRef.current.emit("deletePost",
          {postId: Number(postId), author: currentUser}, (response) => {
            if (response.success) {
              alert("게시글이 삭제되었습니다.");
              navigate("/board-main");
            } else {
              console.error("게시글 삭제 실패:", response.message);
            }
          });
    }
  };

  // 댓글 등록
  const handleAddComment = () => {
    if (!newComment.trim()) {
      return;
    }
    const comment = {
      postId: Number(postId),
      author: "사용자", // 실제 로그인 사용자 정보로 대체 필요
      content: newComment,
      date: new Date().toISOString(),
    };
    if (socketRef.current) {
      socketRef.current.emit("createComment", comment, (response) => {
        if (response.success) {
          setNewComment("");
        } else {
          console.error("댓글 등록 실패:", response.message);
        }
      });
    }
  };

  // 댓글 삭제
  const handleDeleteComment = (commentDate, author) => {
    const currentUser = "사용자"; // 실제 로그인 사용자 정보로 대체 필요
    if (author !== currentUser) {
      alert("본인 댓글만 삭제할 수 있습니다.");
      return;
    }
    if (socketRef.current) {
      socketRef.current.emit(
          "deleteComment",
          {postId: Number(postId), commentDate, author},
          (response) => {
            if (response.success) {
              alert("댓글이 삭제되었습니다.");
              setComments((prev) =>
                  prev.filter(
                      (comment) =>
                          new Date(comment.date).toISOString() !== new Date(
                              commentDate).toISOString()
                  )
              );
            } else {
              console.error("댓글 삭제 실패:", response.message);
            }
          }
      );
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }
  if (!postDetail) {
    return <div>게시글을 찾을 수 없습니다.</div>;
  }

  return (
      <div className={styles.boarddetail}>
        {/* 수정 및 삭제 버튼: 작성자와 로그인한 사용자가 같을 때만 표시 */}
        {postDetail.author === "사용자" && (
            <div className={styles.buttonInput}>
              <button className={styles.editButton} onClick={handleEditPost}>
                수정
              </button>
              <button className={styles.deleteButton}
                      onClick={handleDeletePost}>
                게시글 삭제
              </button>
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
          <div className={styles.line}/>
          <div className={styles.contentForm}
               dangerouslySetInnerHTML={{__html: postDetail.content}}/>
          <div className={styles.line}/>
          {postDetail.files?.length > 0 ? (
              <div className={styles.fileList}>
                {postDetail.files.map((file, index) => (
                    <div key={index} className={styles.fileItem}>
                      <span className={styles.fileName}>{file.name}</span>
                      {file.downloadUrl && (
                          <a href={file.downloadUrl} download>
                            다운로드
                          </a>
                      )}
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
          <ul className={styles.commentList}>
            {comments.map((comment, index) => (
                <li key={index} className={styles.commentItem}>
                  <strong>{comment.author}</strong>
                  <p className={styles.commentContent}>{comment.content}</p>
                  <span className={styles.commentDate}>{new Date(
                      comment.date).toLocaleString()}</span>
                  {comment.author === "사용자" && (
                      <button
                          className={styles.deleteButton}
                          onClick={() => handleDeleteComment(comment.date,
                              comment.author)}
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
