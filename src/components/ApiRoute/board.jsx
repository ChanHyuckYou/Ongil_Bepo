// src/components/ApiRoute/board.js
import {io} from "socket.io-client";

const API_BASE_URL = "http://localhost:8000/board"; // FastAPI board 라우터 베이스 URL

// 헬퍼 함수: 로컬 스토리지에서 토큰 가져오기
const getToken = () => localStorage.getItem("access_token");

// API 요청 시 기본 헤더 생성 함수
const getHeaders = (isJson = true) => {
  const token = getToken();
  const headers = {};

  // 만약 token 값이 있으면 "token" 헤더로 실어 보냄
  if (token) {
    headers["token"] = token;
  }

  if (isJson) {
    headers["Content-Type"] = "application/json";
  }
  return headers;
};

// 전체 게시글 조회 API 호출
export const getAllPosts = async () => {
  const response = await fetch(`${API_BASE_URL}/`, {
    headers: getHeaders(),
  });
  if (!response.ok) {
    throw new Error("게시글 조회에 실패하였습니다.");
  }
  return await response.json();
};

// 검색 API 호출 (FastAPI /search/ 엔드포인트 사용)
export const searchPosts = async (searchQuery) => {
  const params = new URLSearchParams();
  if (searchQuery) {
    params.append("text", searchQuery);
  }
  const response = await fetch(`${API_BASE_URL}/search/?${params.toString()}`, {
    headers: getHeaders(),
  });
  if (!response.ok) {
    throw new Error("검색에 실패하였습니다.");
  }
  return await response.json();
};

// 게시글 상세 조회 (GET /board/{post_id})
export const getPostDetail = async (postId) => {
  const response = await fetch(`${API_BASE_URL}/${postId}`, {
    headers: getHeaders(),
  });
/*   if (!response.ok) {
    throw new Error("게시글 상세 조회에 실패하였습니다.");
  } */
  return await response.json();
};

export const createPost = async (payload, file) => {
    const formData = new FormData();
    formData.append("file", file);
  // 쿼리 파라미터로 보내는 데이터
  const queryParams = new URLSearchParams({
    board_id: payload.board_id,
    post_title: payload.post_title,
    post_category: payload.post_category,
    post_text: payload.post_text,
  }).toString();

  // POST 요청 보내기
  const response = await fetch(`${API_BASE_URL}/?${queryParams}`, {
    method: "POST",
    headers: getHeaders(),
    body: formData,  // 파일과 함께 폼 데이터 전송
  });

  if (!response.ok) {
    const errData = await response.json();
    throw new Error(errData.detail || "게시글 작성에 실패하였습니다.");
  }

  return await response.json();
};



// 게시글 수정 (PUT /board/{post_id})
export const updatePost = async (postId, payload) => {
  const response = await fetch(`${API_BASE_URL}/${postId}`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const errData = await response.json();
    throw new Error(errData.detail || "게시글 수정에 실패하였습니다.");
  }
  return await response.json();
};

// 게시글 삭제 (DELETE /board/{post_id})
export const deletePost = async (postId) => {
  const response = await fetch(`${API_BASE_URL}/${postId}`, {
    method: "DELETE",
    headers: getHeaders(),
  });
  if (!response.ok) {
    const errData = await response.json();
    throw new Error(errData.detail || "게시글 삭제에 실패하였습니다.");
  }
  return await response.json();
};

// 게시글의 댓글 및 관리자 답변 조회 (GET /board/{post_id}/comments-answers)
export const getCommentsAndAnswers = async (postId) => {
  const response = await fetch(`${API_BASE_URL}/${postId}/comments-answers`, {
    headers: getHeaders(),
  });
  if (!response.ok) {
    throw new Error("댓글 및 관리자 답변 조회에 실패하였습니다.");
  }
  return await response.json();
};

// 댓글 작성 (POST /board/{post_id}/comment)
export const addComment = async (postId, comment) => {
  const response = await fetch(`${API_BASE_URL}/${postId}/comment`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({comment}),
  });
  if (!response.ok) {
    const errData = await response.json();
    throw new Error(errData.detail || "댓글 작성에 실패하였습니다.");
  }
  return await response.json();
};

// 관리자 답변 작성 (POST /board/{post_id}/answer)
export const addAnswer = async (postId, answer) => {
  const response = await fetch(`${API_BASE_URL}/${postId}/answer`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({answer}),
  });
  if (!response.ok) {
    const errData = await response.json();
    throw new Error(errData.detail || "답변 작성에 실패하였습니다.");
  }
  return await response.json();
};

// 댓글 삭제 (DELETE /board/{post_id}/comment/{comment_id})
export const deleteComment = async (postId, commentId) => {
  const response = await fetch(`${API_BASE_URL}/${postId}/comment/${commentId}`, {
    method: "DELETE",
    headers: getHeaders(),
  });

  if (!response.ok) {
    const errData = await response.json();
    throw new Error(errData.detail || "댓글 삭제에 실패하였습니다.");
  }

  return await response.json();
};


// 파일 업로드 (POST /board/{post_id}/upload)
export const uploadFile = async (postId, file) => {
  const formData = new FormData();
  formData.append("file", file);
  const response = await fetch(`${API_BASE_URL}/${postId}/upload`, {
    method: "POST",
    headers: {
      "token": getToken(), // multipart/form-data는 Content-Type 자동 설정
    },
    body: formData,
  });
  if (!response.ok) {
    const errData = await response.json();
    throw new Error(errData.detail || "파일 업로드에 실패하였습니다.");
  }
  return await response.json();
};

// 게시글의 파일 목록 조회 (GET /board/{post_id}/files)
export const getPostFiles = async (postId) => {
  const response = await fetch(`${API_BASE_URL}/${postId}/files`, {
    headers: getHeaders(),
  });
//   if (!response.ok) {
//     throw new Error("파일 목록 조회에 실패하였습니다.");
//   }
  return await response.json();
};

// 파일 다운로드 (GET /board/files/{file_id}/download)
// 다운로드의 경우 브라우저에서 직접 URL 이동 방식 사용
export const downloadFile = (fileId) => {
  window.location.href = `${API_BASE_URL}/files/${fileId}/download`;
};

// 파일 삭제 (DELETE /board/files/{file_id})
export const deleteFile = async (fileId) => {
  const response = await fetch(`${API_BASE_URL}/files/${fileId}`, {
    method: "DELETE",
    headers: getHeaders(),
  });
  if (!response.ok) {
    const errData = await response.json();
    throw new Error(errData.detail || "파일 삭제에 실패하였습니다.");
  }
  return await response.json();
};

// Socket.IO 클라이언트 생성 (연결 시 JWT 토큰을 query 파라미터에 포함)
export const getSocket = () => {
  const token = getToken() || "";
  const socket = io("http://localhost:8000", {
    transports: ["websocket"],
    query: {token},
  });
  return socket;
};
