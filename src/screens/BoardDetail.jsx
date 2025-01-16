import React, {useState, useEffect} from "react";
import {useParams} from "react-router-dom"; // 게시글 ID를 URL에서 추출
import {io} from "socket.io-client"; // WebSocket 클라이언트
import styles from "../styles/BoardDetail.module.css";

// WebSocket 연결
const socket = io("http://localhost:3000");

const BoardDetail = () => {
  const {postId} = useParams(); // URL에서 게시글 ID 가져오기
  const [postDetail, setPostDetail] = useState(null); // 게시글 상세 정보 상태
  const [loading, setLoading] = useState(true); // 로딩 상태

  useEffect(() => {
    // 서버로 게시글 상세 데이터 요청
    socket.emit("getPostDetail", Number(postId), (response) => {
      if (response.success) {
        setPostDetail(response.data); // 데이터 설정
      } else {
        console.error(response.message); // 에러 처리
      }
      setLoading(false); // 로딩 완료
    });

    // 클린업
    return () => socket.off("getPostDetail");
  }, [postId]);

  if (loading) {
    return <div>Loading...</div>; // 로딩 상태 표시
  }

  if (!postDetail) {
    return <div>게시글을 찾을 수 없습니다.</div>; // 게시글이 없을 때
  }

  return (
      <div className={styles.boarddetail}>
        <div className={styles.board}>
          {/* 제목 */}
          <div className={styles.postForm}>
            <b className={styles.boardPostTxt}>{postDetail.title}</b>
          </div>

          {/* 내용 */}
          <div className={styles.contentForm}>
            <b className={styles.boardContentTxt}>{postDetail.content}</b>
          </div>

          {/* 작성자 및 날짜 */}
          <b className={styles.createUser}>
            작성자: {postDetail.author}
          </b>
          <b className={styles.createDay}>{postDetail.date}</b>
        </div>

        {/* 댓글 영역 (추후 확장 가능) */}
        <div className={styles.commentsView}>
          <div className={styles.commentFf}>
            댓글 기능은 여기에 구현됩니다.
          </div>
        </div>
      </div>
  );
};

export default BoardDetail;
