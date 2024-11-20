import apiAuth from '../../utils/apiAuth';

interface SearchParams {
  keyword?: string;
  lastSearchId?: string | null;
  pageSize?: number;
  sortBy?: null | 'published_date' | 'title';
  sortOrder?: 'asc' | 'desc';
}

interface ReviewDistribution {
  average: number;
  totalCount: number;
}

interface Book {
  bookId: number;
  title: string;
  cover: string;
  coverAlt: string;
  category: string;
  author: string;
  publisher: string;
  publishedAt: string;
  reviewDistribution: ReviewDistribution;
  dtype: string;
}

interface SearchResponse {
  keyword: string;
  bookList: Book[];
  lastSearchId: string | null;
}

export const searchBooks = async ({
    keyword = '',
    lastSearchId = null,
    pageSize = 10,
    sortBy = null,
    sortOrder = 'desc',
  }: SearchParams): Promise<SearchResponse> => {
    try {
      const response = await apiAuth.get('/published-books', {
        params: {
          keyword,       // 검색 키워드
          lastSearchId,  // 마지막 검색 ID
          pageSize,      // 페이지 크기
          sortBy,        // 정렬 기준
          sortOrder,     // 정렬 순서
        },
      });

      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || '도서 검색에 실패했습니다.');
    }
  };
