import apiAuth from '../../utils/apiAuth';

const handleApiError = (error: any) => {
  if (error.response) {
    const { status, data } = error.response;

    switch (status) {
      case 400:
        return Promise.reject({ code: data.code, message: data.message || '잘못된 요청입니다.' });

      case 403:
        return Promise.reject({ code: data.code, message: data.message || '페이지에 접근할 권한이 없습니다.' });

      case 500:
        return Promise.reject({
          code: data.code,
          message: data.message || '서버 오류가 발생했습니다.',
          errorMessage: data.errorMessage || '알 수 없는 서버 내부 오류입니다.',
        });

      default:
        return Promise.reject({
          message: `알 수 없는 오류가 발생했습니다. (상태 코드: ${status})`,
        });
    }
  }

  return Promise.reject({ message: '네트워크 오류가 발생했습니다. 인터넷 연결을 확인해주세요.' });
};

// 도서 추천 - 인기 도서 조회
export const getPopularBooks = async () => {
  try {
    const response = await apiAuth.get('/book-recommendation/popular');
    return response.data; // { bookList, criterion }
  } catch (error) {
    throw await handleApiError(error);
  }
};

// 도서 추천 - 성별, 나이별 인기 도서 조회
export const getDemographicsPopularBooks = async () => {
  try {
    const response = await apiAuth.get('/book-recommendation/demographics');
    return response.data; // { bookList, criterion }
  } catch (error) {
    throw await handleApiError(error);
  }
};

// 도서 추천 - 많이 읽은 카테고리 인기 도서 조회
export const getFavoriteCategoryBooks = async () => {
  try {
    const response = await apiAuth.get('/book-recommendation/favorite-category');
    return response.data; // { bookList, criterion }
  } catch (error) {
    throw await handleApiError(error);
  }
};

// 도서 추천 - 나와 비슷한 유저들이 좋아한 도서
export const getSimilarMembersBooks = async () => {
  try {
    const response = await apiAuth.get('/book-recommendation/similar-members');
    return response.data; // { bookList, criterion }
  } catch (error) {
    throw await handleApiError(error);
  }
};

// 도서 추천 - 가장 최근 본 도서와 비슷한 도서 추천
export const getRecentSimilarBooks = async () => {
  try {
    const response = await apiAuth.get('/book-recommendation/recent');
    return response.data; // { bookList, criterion }
  } catch (error) {
    throw await handleApiError(error);
  }
};
