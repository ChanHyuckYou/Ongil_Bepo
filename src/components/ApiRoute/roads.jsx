import axios from 'axios';

// axios 설정
const api = axios.create({
  baseURL: "http://localhost:8000/roads", // 기본 URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터 설정 (토큰 자동 추가)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token'); // 토큰 가져오기
    if (token) {
      config.headers['token'] = `${token}`; // Authorization 헤더에 Bearer 토큰 추가
      console.log(config.headers);
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ 지역 지정 (읍면동 확인)
export const getDistrict = async (district) => {
  try {
    const response = await api.get(`/get_district`, {
      params: { district },
    });
    return response.data.message;
  } catch (error) {
    if (error.response) {
      // 서버에서 보내는 오류 응답 처리
      console.error("서버 응답 오류:", error.response);
      alert(`${error.response.data.detail || error.response.statusText}`);
    } else if (error.request) {
      console.error("요청 오류:", error.request);
      alert("서버와의 연결이 실패했습니다.");
    } else {
      console.error("오류 발생:", error.message);
      alert(`오류 발생: ${error.message}`);
    }
    throw error; // 필요에 따라 error를 다시 던져서 호출한 곳에서 처리할 수도 있습니다.
  }
};

// ✅ 열선 도로 추천
export const recommendRoads = async (userWeights) => {
  try {
    const response = await api.post(`/recommend`, userWeights);
    return response.data;
  } catch (error) {
    console.error("도로 추천 실패:", error);
    throw error;
  }
};

// ✅ 추천 로그 확인
export const getRecommendationLogs = async () => {
  try {
    const response = await api.get(`/recommendations/log`);
    return response.data;
  } catch (error) {
    console.error("추천 로그 조회 실패:", error);
    throw error;
  }
};

// ✅ 파일 요청
export const requestRoadFile = async (logId) => {
  try {
    const response = await api.post(`/file-request/${logId}`);
    return response.data;
  } catch (error) {
    console.error("파일 요청 실패:", error);
    throw error;
  }
};

export default {
  getDistrict,
  recommendRoads,
  getRecommendationLogs,
  requestRoadFile,
};
