import axios from 'axios';

// axios 경로
const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/mypage', // 기본 URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터 설정
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token'); // 토큰 가져오기
    if (token) {
      config.headers.Token = `${token}`; // Authorization 헤더에 Bearer 토큰 추가
    }
    return config;

  },
  (error) => Promise.reject(error)
);

// 1. 유저 정보 불러오기
export const loadUserInfo = async (access_token) => {
  try {
    const response = await api.get('/mypage_load')
    return response.data; // 데이터 반환
  } catch (error) {
    console.error(error.response?.data?.detail || error.message || 'Failed to load user information.');
    alert(error.response?.data?.detail || error.message || '사용자 정보를 불러오는데 실패했습니다.');
  }
};


// 2. 비밀번호 확인
export const checkPassword = async (password, access_token) => {
  try {
    const response = await api.get('/check_password', { // api 인스턴스를 사
      params: { password }, // 비밀번호를 파라미터로 전달
    });
    return response.data; // 데이터 반환
  } catch (error) {
    const errorMessage = error.response?.data?.detail || error.message || 'Password verification failed.';
    throw new Error(errorMessage); // 에러 메시지 던지기
  }
};

// 3. 유저 정보 수정
export const updateUserInfo = async (updateData) => {
  try {
    const response = await api.put('/update_user', updateData); // 'update_user' API 호출
    return response.data; // 데이터 반환
  } catch (error) {
    const errorMessage = error.response?.data?.detail || error.message || 'Failed to update user data.';
    throw new Error(errorMessage); // 에러 메시지 던지기
  }
};

// 4. 회원 탈퇴
export const deleteUser = async () => {
  try {
    const response = await api.delete('/delete_user'); // 'delete_user' API 호출
    // 로컬 스토리지에서 토큰과 사용자 관련 데이터 삭제
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('is_admin');
    return response.data; // 데이터 반환
  } catch (error) {
    const errorMessage = error.response?.data?.detail || error.message || 'Account deletion failed.';
    throw new Error(errorMessage); // 에러 메시지 던지기
  }
};

export default {
  loadUserInfo,
  checkPassword,
  updateUserInfo,
  deleteUser,
};
