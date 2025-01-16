// server/index.js
import {Server} from "socket.io"; // socket.io 서버
import express from "express";
import * as http from "http";
import ViteExpress from "vite-express"; // ViteExpress를 사용하는 경우(옵션)

const io = new Server(server, {
  cors: {
    origin: process.env.WEB_SOCKET_URL,
    methods: ["GET", "POST"]
  }
});

const app = express();
const server = http.createServer(app);

// Socket.IO 서버 인스턴스 생성
const io = new Server(server);

// 게시글 데이터를 저장할 메모리 데이터베이스
let posts = [];

io.on("connection", (socket) => {
  console.log("A client connected:", socket.id);

  // 1) 클라이언트에 현재 posts 데이터 전달 (초기화 작업)
  socket.emit("initPosts", posts);

  // 2) 클라이언트로부터 새 게시글이 들어오면 처리
  socket.on("createPost", (data) => {
    console.log("Received new post:", data);
    // 메모리에 저장 (DB를 대체)
    posts.push(data);
    // 모든 클라이언트에게 새 게시글 데이터 브로드캐스팅
    io.emit("newPost", data);
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

  // 3) 연결 해제
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
