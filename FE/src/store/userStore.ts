import {create} from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {persist, createJSONStorage} from 'zustand/middleware';

// 상태 인터페이스 정의
interface UserState {
  isLoggedIn: boolean;
  email: string;
  name: string;
  nickname: string;
  birthdate: string;
  isDisabled: boolean;
  isMale: boolean;
  cookie: string; // 쿠키 상태 추가
  updateUser: (
    data: Partial<Omit<UserState, 'email' | 'updateUser' | 'login' | 'logout'>>,
  ) => void;
  login: (
    data: Omit<
      UserState,
      'isLoggedIn' | 'updateUser' | 'login' | 'logout' | 'cookie'
    >,
  ) => void;
  logout: () => void;
  setCookie: (cookie: string) => void;
  clearCookie: () => void;
}

// Zustand 스토어 생성
const useUserStore = create<UserState>()(
  persist(
    set => ({
      isLoggedIn: false,
      email: '',
      name: '',
      nickname: '',
      birthdate: '',
      isDisabled: false,
      isMale: true,
      cookie: '', // 쿠키 초기값

      // 단일 업데이트 함수
      updateUser: data =>
        set(state => ({
          ...state,
          ...data,
        })),

      // 로그인 함수 - isLoggedIn을 true로 설정하고 나머지 값을 입력받아 설정
      login: ({email, name, nickname, birthdate, isDisabled, isMale}) =>
        set({
          isLoggedIn: true,
          email,
          name,
          nickname,
          birthdate,
          isDisabled,
          isMale,
        }),

      // 로그아웃 함수 - isLoggedIn을 false로 설정하고 모든 값을 기본값으로 재설정
      logout: () =>
        set({
          isLoggedIn: false,
          email: '',
          name: '',
          nickname: '',
          birthdate: '',
          isDisabled: false,
          isMale: true,
          cookie: '', // 로그아웃 시 쿠키 삭제
        }),

      // 쿠키 설정 함수 - 쿠키를 설정하거나 업데이트
      setCookie: cookie =>
        set({
          cookie,
        }),

      // 쿠키 삭제 함수 - 로그아웃 시 쿠키 삭제를 위해
      clearCookie: () =>
        set({
          cookie: '',
        }),
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);

export default useUserStore;
