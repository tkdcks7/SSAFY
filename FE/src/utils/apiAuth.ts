import axios from 'axios';
import useUserStore from '../store/userStore';

const apiAuth = axios.create({
  baseURL: 'https://api.example.com',
  timeout: 1000,
});

// 요청 인터셉터 설정
apiAuth.interceptors.request.use(
  (config) => {
    // userStore에서 cookie 값 가져오기
    const { cookie } = useUserStore.getState();
    if (cookie) {
      config.headers.Cookie = cookie;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 응답 인터셉터 설정
apiAuth.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // 예: 인증 실패 처리
      console.log('Unauthorized!');
    }
    return Promise.reject(error);
  }
);