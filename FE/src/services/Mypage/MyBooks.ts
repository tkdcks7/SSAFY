import apiAuth from '../../utils/apiAuth';

/**
 * 담은 도서 목록 조회 함수
 * @returns {Promise} 담은 도서 목록 데이터
 */
export const getMyBooks = async () => {
  try {
    const response = await apiAuth.get('/published-books/book-cart');
    return response.data.bookList;
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
