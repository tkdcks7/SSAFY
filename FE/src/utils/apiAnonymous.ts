import axios from 'axios';

const apiAnonymous = axios.create({
  baseURL: 'https://audisay.kr/api',
  timeout: 3000,
});

// 요청 인터셉터 설정. 우리는 토큰 방식 사용 안할거라 방법 결정되면 수정해야함.
apiAnonymous.interceptors.request.use(
  (config) => { return config; },
  (error) => Promise.reject(error)
);

// 응답 인터셉터 설정
apiAnonymous.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log(error);
    return Promise.reject(error);
  }
);

export default apiAnonymous;