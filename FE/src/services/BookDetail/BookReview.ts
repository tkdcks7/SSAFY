import apiAuth from '../../utils/apiAuth';

// 리뷰 등록
export const createReview = async (bookId: number, score: number, content: string) => {
  try {
    const response = await apiAuth.post('/reviews', {
      bookId,
      score,
      content,
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// 리뷰 삭제
export const deleteReview = async (reviewId: number) => {
  try {
    const response = await apiAuth.delete(`/reviews/${reviewId}`);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// 리뷰 수정
export const updateReview = async (reviewId: number, score: number, content: string) => {
  try {
    const response = await apiAuth.patch(`/reviews/${reviewId}`, {
      score,
      content,
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// 리뷰 조회
export const fetchReviews = async (bookId: number, lastId: number | null = null, pageSize: number = 10) => {
  try {
    const params = {
      lastId: lastId || undefined,
      pageSize,
    };
    const response = await apiAuth.get(`/reviews/${bookId}`, { params });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// 에러 핸들링 함수
const handleError = (error: any) => {
  if (error.response) {
    console.error('API Error:', error.response.data);
    throw error.response.data;
  } else {
    console.error('Unexpected Error:', error.message);
    throw error;
  }
};
