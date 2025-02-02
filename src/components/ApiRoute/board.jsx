// src/components/ApiRoute/boardapi.jsx
import axios from 'axios';
import {io} from 'socket.io-client';

// Axios 인스턴스 생성
const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/board', // FastAPI 서버의 게시판 API 기본 URL (예시)
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터 설정 (토큰 자동 추가)
api.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('access_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
);

// REST API 함수들

export const getAllPosts = async () => {
  try {
    const response = await api.get('/');
    return response.data;
  } catch (error) {
    throw error.response?.data || {message: '게시글 조회 중 오류가 발생했습니다.'};
  }
};

export const getPost = async (post_id) => {
  try {
    const response = await api.get(`/${post_id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || {message: '게시글 조회 중 오류가 발생했습니다.'};
  }
};

export const createPost = async (postData) => {
  try {
    const response = await api.post('/', postData);
    return response.data;
  } catch (error) {
    throw error.response?.data || {message: '게시글 등록 중 오류가 발생했습니다.'};
  }
};

export const updatePost = async (post_id, postData) => {
  try {
    const response = await api.put(`/${post_id}`, postData);
    return response.data;
  } catch (error) {
    throw error.response?.data || {message: '게시글 수정 중 오류가 발생했습니다.'};
  }
};

export const deletePost = async (post_id) => {
  try {
    const response = await api.delete(`/${post_id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || {message: '게시글 삭제 중 오류가 발생했습니다.'};
  }
};

export const searchPosts = async (params) => {
  try {
    const response = await api.get('/search/', {params});
    return response.data;
  } catch (error) {
    throw error.response?.data || {message: '게시글 검색 중 오류가 발생했습니다.'};
  }
};

export const addComment = async (post_id, comment) => {
  try {
    const response = await api.post(`/${post_id}/comment`, {comment});
    return response.data;
  } catch (error) {
    throw error.response?.data || {message: '댓글 등록 중 오류가 발생했습니다.'};
  }
};

export const addAnswer = async (post_id, answer) => {
  try {
    const response = await api.post(`/${post_id}/answer`, {answer});
    return response.data;
  } catch (error) {
    throw error.response?.data || {message: '관리자 답변 등록 중 오류가 발생했습니다.'};
  }
};

export const uploadFile = async (post_id, file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post(`/${post_id}/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || {message: '파일 업로드 중 오류가 발생했습니다.'};
  }
};

export const getPostFiles = async (post_id) => {
  try {
    const response = await api.get(`/${post_id}/files`);
    return response.data;
  } catch (error) {
    throw error.response?.data || {message: '파일 목록 조회 중 오류가 발생했습니다.'};
  }
};

export const downloadFile = async (file_id) => {
  try {
    const response = await api.get(`/files/${file_id}/download`, {
      responseType: 'blob',
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || {message: '파일 다운로드 중 오류가 발생했습니다.'};
  }
};

export const deleteFile = async (file_id) => {
  try {
    const response = await api.delete(`/files/${file_id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || {message: '파일 삭제 중 오류가 발생했습니다.'};
  }
};

let socketInstance = null;

export const getSocket = () => {
  // 이미 연결된 소켓 인스턴스가 있고 연결이 유지되고 있다면 그대로 반환
  if (socketInstance && socketInstance.connected) {
    return socketInstance;
  }

  // 새로운 소켓 연결 생성
  socketInstance = io('http://127.0.0.1:8000', {
    path: '/ws/socket.io', // 서버에 mount한 Socket.IO 경로
    query: {token: localStorage.getItem('access_token')},
  });

  // 연결 오류 발생 시 소켓 해제 및 인스턴스 초기화
  socketInstance.on('connect_error', (error) => {
    console.error('Socket connection error:', error);
    socketInstance.disconnect();
    socketInstance = null;
  });

  return socketInstance;
};

// 전역 socket 대신, socket 인스턴스를 생성하는 함수를 export
export const createSocket = () => {
  return io('http://127.0.0.1:8000', {
    path: '/ws/socket.io', // 서버에 mount한 socket.io 경로
    query: {token: localStorage.getItem('access_token')},
  });
};

export default {
  getAllPosts,
  createSocket,
  getPost,
  createPost,
  updatePost,
  deletePost,
  searchPosts,
  addComment,
  addAnswer,
  uploadFile,
  getPostFiles,
  downloadFile,
  deleteFile,
  getSocket,
};
