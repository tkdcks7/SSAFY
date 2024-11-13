// src/services/BookDetail/RecommendedBooks.ts
import apiAuth from '../../utils/apiAuth';

interface BookItem {
  bookId: number;
  cover: string;
  coverAlt: string;
  title: string;
  author: string;
  publisher: string;
  story: string;
}

interface RecommendedBooksResponse {
  bookList: BookItem[];
  criterion: string;
}

// 비슷한 도서 추천 함수
export const fetchSimilarBooks = async (bookId: number): Promise<BookItem[]> => {
  try {
    const response = await apiAuth.get<RecommendedBooksResponse>(`/book-recommendation/${bookId}/by-content`);
    return response.data.bookList;
  } catch (error) {
    console.error('Failed to fetch similar books:', error);
    throw new Error('비슷한 도서 정보를 가져오는 데 실패했습니다.');
  }
};

// 이 도서를 좋아한 사용자가 좋아한 도서 추천 함수
export const fetchBooksLikedByUsers = async (bookId: number): Promise<BookItem[]> => {
  try {
    const response = await apiAuth.get<RecommendedBooksResponse>(`/book-recommendation/${bookId}/by-likes`);
    return response.data.bookList;
  } catch (error) {
    console.error('Failed to fetch books liked by users:', error);
    throw new Error('다른사용자가 좋아한 도서 정보를 가져오는 데 실패했습니다.');
  }
};
