import {useState, useEffect} from "react";
import {useParams} from "react-router-dom"; // 게시글 ID를 URL에서 추출

import styles from "../styles/BoardDetail.module.css";

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

          {/* 작성자 및 날짜 */}
          <div className={styles.metaInfo}>
            <p className={styles.author}>
              <strong>작성자:</strong> {postDetail.author}
            </p>
            <p className={styles.date}>
              <strong>작성일:</strong> {postDetail.date}
            </p>
            <p className={styles.views}>
              <strong>조회수:</strong> {postDetail.views}
            </p>
            <p className={styles.category}>
              <strong>카테고리:</strong> {postDetail.category}
            </p>
          </div>
          <div className={styles.line}/>
          {/* 제목 */}
          <div className={styles.postForm}>
            {postDetail.title}
          </div>
          <div className={styles.line}/>
          {/* 내용 */}
          <div className={styles.contentForm}>
            {postDetail.content}
          </div>

        </div>

        {/* 파일 다운로드 링크 표시 */}
        <div className={styles.fileList}>
          {postDetail.files && postDetail.files.map((file, index) => (
              <div key={index} className={styles.fileItem}>
                <span className={styles.fileName}>{file.name}</span>
                {file.downloadUrl && (
                    <a href={file.downloadUrl} download>다운로드</a>
                )}
              </div>
          ))}
        </div>
        {/* 댓글 영역 (추후 확장 가능) */}
        <div className={styles.commentsView}>
          <h3>댓글</h3>
          <p>댓글 기능은 여기에 구현됩니다.</p>
        </div>
      </div>
  );
};

export default BoardDetail;
