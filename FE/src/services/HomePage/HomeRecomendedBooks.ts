import apiAuth from '../../utils/apiAuth';

const handleApiError = async (error: any) => {
  if (error.response) {
    const { status, data } = error.response;

    switch (status) {
      case 204:
        // 204 No Content: 추천 결과가 없는 경우 빈 리스트와 메시지 반환
        return Promise.resolve({
          bookList: [],
          criterion: '추천 결과가 없습니다.',
        });

      case 404:
        // 404 Not Found: 해당 조건의 추천 도서가 없을 경우 처리
        return Promise.resolve({
          bookList: [],
          criterion: '해당 조건의 추천 도서를 찾을 수 없습니다.',
        });

      case 400:
        // 400 Bad Request: 잘못된 요청에 대한 오류 메시지 처리
        return Promise.reject({
          code: data.code,
          message: data.message || '요청이 잘못되었습니다. 다시 시도해주세요.',
        });

      case 403:
        // 403 Forbidden: 권한 없는 요청에 대한 오류 메시지 처리
        return Promise.reject({
          code: data.code,
          message: data.message || '접근 권한이 없습니다. 로그인 상태를 확인하세요.',
        });

      case 500:
        // 500 Internal Server Error: 서버 오류에 대한 메시지 처리
        return Promise.reject({
          code: data.code,
          message: data.message || '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
          errorMessage: data.errorMessage || '서버 내부 문제로 인해 요청을 처리할 수 없습니다.',
        });

      default:
        // 기타 상태 코드에 대한 기본 처리
        return Promise.reject({
          message: `알 수 없는 오류가 발생했습니다. (상태 코드: ${status})`,
        });
    }
  }

  // 네트워크 오류 처리
  return Promise.reject({ 
    message: '네트워크 연결 상태를 확인해주세요. 서버와의 통신에 실패했습니다.' 
  });
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
