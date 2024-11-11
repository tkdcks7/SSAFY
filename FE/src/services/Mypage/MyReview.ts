// src/services/Mypage/MyReview.ts
import apiAuth from '../../utils/apiAuth';

interface Review {
  reviewId: number;
  bookId: number;
  title: string;
  score: number;
  content: string;
  updatedAt: string;
}

interface GetMyReviewsResponse {
  reviewList: Review[];
  lastUpdatedAt: string | null;
  lastReviewId: number | null;
}

/** 나의 리뷰 조회 함수 */
export const getMyReviews = async (params?: { lastDateTime?: string; lastId?: number; pageSize?: number }) => {
  try {
    const { lastDateTime, lastId, pageSize = 10 } = params || {};

    const response = await apiAuth.get<GetMyReviewsResponse>('/reviews/mypage', {
      params: {
        lastDateTime,
        lastId,
        pageSize,
      },
    });

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

/** 리뷰 삭제 함수 */
export const deleteReview = async (reviewId: number) => {
    try {
      const response = await apiAuth.delete(`/reviews/${reviewId}`);
      return response.data;
    } catch (error: any) {
      if (error.response) {
        const { status, data } = error.response;

        if (status === 400 || status === 403) {
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

  /** 리뷰 수정 함수 */
  export const updateReview = async (reviewId: number, data: { score?: number; content?: string }) => {
    try {
      const response = await apiAuth.patch(`/reviews/${reviewId}`, data);
      return response.data;
    } catch (error: any) {
      if (error.response) {
        const { status, data } = error.response;

        if (status === 400 || status === 403) {
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
