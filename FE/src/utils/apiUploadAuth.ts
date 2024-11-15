import axios from 'axios';
import useUserStore from '../store/userStore';

// 파일 업로드에만 사용할 Axios 인스턴스 생성
const apiUploadAuth = axios.create({
  baseURL: 'https://audisay.kr/api',
  timeout: 600000, // 10분 (600,000ms)
});

// 요청 인터셉터 설정
apiUploadAuth.interceptors.request.use(
  (config) => {
    const { cookie } = useUserStore.getState();
    if (cookie) {
      config.headers.Cookie = cookie;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 응답 인터셉터 설정
apiUploadAuth.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.log('Unauthorized!');
    }
    return Promise.reject(error);
  }
);

export default apiUploadAuth;
