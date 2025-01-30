import {Server} from "socket.io"; // socket.io 서버
import express from "express";
import * as http from "http";
import ViteExpress from "vite-express"; // ViteExpress를 사용하는 경우(옵션)

const webSocketUrl = "http://localhost:3000";

console.log("WebSocket URL:", webSocketUrl);

// Express 애플리케이션 생성
const app = express();
const server = http.createServer(app);

// Socket.IO 서버 인스턴스 생성 (CORS 옵션 포함)
const io = new Server(server, {
  cors: {

    // eslint-disable-next-line no-undef
    origin: webSocketUrl, // 환경변수 또는 기본값 사용
    methods: ["GET", "POST"],
  },
});

// 게시글 데이터를 저장할 메모리 데이터베이스
let posts = [];

io.on("connection", (socket) => {
  console.log("A client connected:", socket.id);

  // 클라이언트에 현재 posts 데이터 전달 (초기화 작업)
  socket.emit("initPosts", posts);

  // 클라이언트로부터 새 게시글이 들어오면 처리
  socket.on("createPost", (data) => {
    console.log("Received new post:", data);
    posts.push(data); // 메모리에 저장 (DB를 대체)
    io.emit("newPost", data); // 모든 클라이언트에게 브로드캐스팅
  });

  // 클라이언트로부터 게시글 업데이트 요청
  socket.on("updatePost", (updatedPost, callback) => {
    console.log("게시글 수정 요청:", updatedPost);

    // `postId`로 기존 게시글 찾기
    const index = posts.findIndex((post) => post.id === updatedPost.postId);

    if (index !== -1) {
      // 기존 데이터 유지하면서 새로운 데이터 병합
      posts[index] = { ...posts[index], ...updatedPost };

      console.log("게시글 수정 완료:", posts[index]);

      // 모든 클라이언트에게 수정된 게시글 전달
      io.emit("updatedPost", posts[index]);

      // 클라이언트에 성공 응답 반환
      callback({ success: true, message: "게시글 수정 성공" });
    } else {
      console.log("게시글 수정 실패: 찾을 수 없음", updatedPost);
      callback({ success: false, message: "게시글을 찾을 수 없습니다." });
    }
  });

  // 특정 게시글 데이터 요청 처리
  socket.on("getPostDetail", (postId, callback) => {
    const post = posts.find((item) => item.id === postId);
    if (post) {
      callback({success: true, data: post});
    } else {
      callback({success: false, message: "Post not found"});
    }
  });

  // 게시글 삭제 처리
  socket.on("deletePost", ({ postId, author }, callback) => {
    const index = posts.findIndex((p) => p.id === postId);
    if (index !== -1) {
      if (posts[index].author !== author) {
        console.log("게시글 삭제 실패: 권한 없음");
        callback({ success: false, message: "게시글 삭제 권한이 없습니다." });
        return;
      }

      posts.splice(index, 1);
      io.emit("deletedPost", postId);
      console.log("게시글 삭제 성공:", postId);
      callback({ success: true });
    } else {
      console.log("게시글 삭제 실패: 찾을 수 없음", postId);
      callback({ success: false, message: "게시글을 찾을 수 없습니다." });
    }
  });

  // 댓글 요청 처리
  socket.on("createComment", (comment, callback) => {
    const post = posts.find((p) => p.id === comment.postId);
    if (post) {
      post.comments = post.comments || [];
      post.comments.push(comment);
      io.emit("newComment", comment);
      console.log("댓글 저장 성공:", comment);  // ← 이 로그가 뜨는지 확인!
      callback({ success: true });
    } else {
      console.log("댓글 저장 실패: 게시글이 없음");
      callback({ success: false, message: "게시글을 찾을 수 없습니다." });
    }
  });

  // 댓글 삭제 처리
  socket.on("deleteComment", ({ postId, commentDate, author }, callback) => {
    const post = posts.find((p) => p.id === postId);
    if (!post || !post.comments) {
      callback({ success: false, message: "게시글을 찾을 수 없습니다." });
      return;
    }

    // 🔥 `findIndex` 대신 `filter`를 사용해서 안전하게 삭제
    const updatedComments = post.comments.filter(
      (comment) => comment.date !== commentDate || comment.author !== author
    );

    // 댓글 개수가 줄어들었는지 확인 (삭제 성공 여부)
    if (updatedComments.length < post.comments.length) {
      post.comments = updatedComments;
      io.emit("deletedComment", { postId, commentDate }); // 모든 클라이언트에 삭제 정보 전달
      console.log("댓글 삭제 성공:", commentDate);
      callback({ success: true });
    } else {
      console.log("댓글 삭제 실패: 댓글을 찾을 수 없음");
      callback({ success: false, message: "댓글을 찾을 수 없습니다." });
    }
  });

  // 클라이언트 연결 해제
  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

server.listen(3000, () => {
  console.log("Server is running on port 3000");
});

// 간단한 REST 라우트 예시
app.get("/message", (_, res) => res.send("Hello TestWorld!"));

// ViteExpress를 사용중이라면 바인딩
ViteExpress.bind(app, server);
