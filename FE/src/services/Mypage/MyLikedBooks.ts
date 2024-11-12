import apiAuth from '../../utils/apiAuth';

interface LikedBook {
  cover: string;
  coverAlt: string;
  title: string;
  author: string;
  bookId: number;
  dtype: string;
}

interface LikedBooksResponse {
  bookList: LikedBook[];
  lastDateTime: string | null;
  lastId: number | null;
}

interface LikedBooksParams {
  lastDateTime?: string; // 이전 요청에서 받은 마지막 DateTime, 첫 요청 시에는 필요 없음
  lastId?: number; // 이전 요청에서 받은 마지막 Book ID, 첫 요청 시에는 필요 없음
  pageSize?: number; // 페이지 사이즈, 기본값 10
}

/**
 * 좋아요한 도서 목록 조회 함수
 * @param params {LikedBooksParams} - lastDateTime, lastId, pageSize 등의 파라미터
 * @returns {Promise<LikedBooksResponse>} - 좋아요한 도서 목록과 마지막 데이터 정보
 */
export const getLikedBooks = async (params?: LikedBooksParams): Promise<LikedBooksResponse> => {
  try {
    const response = await apiAuth.get('/published-books/liked-books', { params });
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
 * 좋아요 취소 요청 함수
 * @param bookId {number} - 좋아요를 취소할 도서의 ID
 * @returns {Promise<void>}
 */
export const unlikeBook = async (bookId: number): Promise<void> => {
    try {
      await apiAuth.post('/published-books/liked-books', {
        bookId,
        likedFlag: false, // 좋아요 취소를 의미하는 false
      });
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
