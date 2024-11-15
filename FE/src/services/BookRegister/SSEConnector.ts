import EventSource, { EventSourceListener } from "react-native-sse";
import useUserStore from '../../store/userStore'; // userStore에서 cookie 가져오기

interface ServerData {
  status: string;
  progress: number;
}

// SSE 연결 함수
export const connectToSSE = (
  channelId: string,
  onMessage: (data: ServerData) => void, // 데이터 파싱 후 전달
  onError?: (error: any) => void
) => {
  const { cookie } = useUserStore.getState(); // userStore에서 cookie 가져오기

  // 절대 경로로 수정
  const sse = new EventSource(`https://audisay.kr/api/registration/events/${channelId}`, {
    headers: {
      Authorization: `Bearer ${cookie}`, // cookie 값 사용
    },
  });

  const messageListener: EventSourceListener<'message'> = (event) => {
    if (event.data) {
      try {
        const data: ServerData = JSON.parse(event.data); // 메시지 데이터 파싱
        console.log('SSE Message Parsed:', data);
        onMessage(data); // 상태와 진행률 전달
      } catch (error) {
        console.error('Message parsing error:', error);
        onError?.(error);
      }
    }
  };

  const errorListener: EventSourceListener<'error'> = (event) => {
    console.error('SSE Error:', event);
    onError?.(event);
  };

  // 이벤트 리스너 추가
  sse.addEventListener('message', messageListener);
  sse.addEventListener('error', errorListener);

  sse.addEventListener('open', () => {
    console.log('SSE 연결이 열렸습니다.');
  });

  return () => {
    // 연결 해제
    console.log('SSE 연결을 닫습니다.');
    sse.close();
  };
};
