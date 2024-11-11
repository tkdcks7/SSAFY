import apiAuth from '../../utils/apiAuth';

/**
 * 유저 독서 통계 정보 조회 함수
 * @returns {Promise} 유저 독서 통계 데이터
 */
export const getUserReadingStats = async () => {
  try {
    const response = await apiAuth.get('/members/book-analysis');
    return response.data;
  } catch (error: any) {
    if (error.response) {
      const { status, data } = error.response;

      if (status === 400) {
        return Promise.reject({ code: data.code, message: data.message });
      }

      if (status === 500) {
        return Promise.reject({
          code: data.code,
          message: data.message,
          errorMessage: data.errorMessage || '서버 내부 오류가 발생했습니다.',
        });
      }

      return Promise.reject({
        message: `알 수 없는 오류가 발생했습니다. (상태 코드: ${status})`,
      });
    }

    return Promise.reject({ message: '네트워크 오류가 발생했습니다. 인터넷 연결을 확인해주세요.' });
  }
};

/**
 * 유저 세부 정보 조회 함수
 * @returns {Promise} 유저 기본 정보 데이터
 */
export const getUserDetails = async () => {
  try {
    const response = await apiAuth.get('/members');
    return response.data;
  } catch (error: any) {
    if (error.response) {
      const { status, data } = error.response;

      if (status === 400) {
        return Promise.reject({ code: data.code, message: data.message });
      }

      if (status === 500) {
        return Promise.reject({
          code: data.code,
          message: data.message,
          errorMessage: data.errorMessage || '서버 내부 오류가 발생했습니다.',
        });
      }

      return Promise.reject({
        message: `알 수 없는 오류가 발생했습니다. (상태 코드: ${status})`,
      });
    }

    return Promise.reject({ message: '네트워크 오류가 발생했습니다. 인터넷 연결을 확인해주세요.' });
  }
};

/**
 * 유저 일반 정보 수정 함수
 * @param data {nickname?: string; blindFlag: boolean}
 * @returns {Promise} 수정된 유저 정보
 */
export const updateGeneralInfo = async (data: { nickname?: string; blindFlag: boolean }) => {
  try {
    const response = await apiAuth.patch('/members', data);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      const { status, data } = error.response;

      if (status === 400) {
        return Promise.reject({ code: data.code, message: data.message });
      }

      if (status === 500) {
        return Promise.reject({
          code: data.code,
          message: data.message,
          errorMessage: data.errorMessage || '서버 내부 오류가 발생했습니다.',
        });
      }

      return Promise.reject({
        message: `알 수 없는 오류가 발생했습니다. (상태 코드: ${status})`,
      });
    }

    return Promise.reject({ message: '네트워크 오류가 발생했습니다. 인터넷 연결을 확인해주세요.' });
  }
};

/**
 * 비밀번호 변경 함수
 * @param data {oldPassword: string; newPassword: string}
 * @returns {Promise} 비밀번호 변경 결과
 */
export const changePassword = async (data: { oldPassword: string; newPassword: string }) => {
  try {
    const response = await apiAuth.patch('/members/password-change', data); // PATCH 메서드 사용
    return response.data;
  } catch (error: any) {
    if (error.response) {
      const { status, data } = error.response;

      if (status === 400) {
        return Promise.reject({ code: data.code, message: data.message });
      }

      if (status === 500) {
        return Promise.reject({
          code: data.code,
          message: data.message,
          errorMessage: data.errorMessage || '서버 내부 오류가 발생했습니다.',
        });
      }

      return Promise.reject({
        message: `알 수 없는 오류가 발생했습니다. (상태 코드: ${status})`,
      });
    }

    return Promise.reject({ message: '네트워크 오류가 발생했습니다. 인터넷 연결을 확인해주세요.' });
  }
};
