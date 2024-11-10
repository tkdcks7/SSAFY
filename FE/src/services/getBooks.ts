import apiAuth from "../utils/apiAuth";


interface IUserProfile {
    email: string;
    name: string;
    nickname: string;
    birth: string; // "YYYY-MM-DD" 형식
    gender: 'M' | 'F'; // 성별을 'M' 또는 'F'로 제한
    blindFlag: boolean;
  };

interface Book {
    bookId: number;
    title: string;
    cover: string;
    coverAlt: string;
    author: string;
    publisher: string;
    publishedAt: string; // 날짜 형식: "YYYY-MM-DD"
    dtype: "PUBLISHED" | "DRAFT" | string; // 특정 값이거나 기타 문자열
}

interface BookSearchResult {
    keyword: string | null; // 검색 키워드 (없을 경우 null)
    bookList: Book[]; // 도서 목록
    lastDateTime: string | null; // 마지막 날짜 (전체 목록 마지막이면 null)
    lastId: number | null; // 마지막 도서 ID (전체 목록 마지막이면 null)
}

interface BookListItem extends Omit<Book, 'publisher' | 'publishedAt'> {};

interface LikedBook {
    bookList: BookListItem[];
    lastDateTime: string | null; // 전체 목록의 마지막이면 null
    lastId: number | null; // 마지막 도서 ID (전체 목록의 마지막이면 null)
  }

interface CartBook {
    bookList: LikedBook[];
}




const getMyProfile = (): Promise<IUserProfile> => {
    return apiAuth.get('/members')
        .then(response => response.data as IUserProfile)
        .catch((error) => { throw error; });
    };


const getBookSearhResult = (lastDateTime?: string, lastId?: number, pageSize?: number ): Promise<BookSearchResult> => {
    return apiAuth.get(`/published-books/liked-books?
        ${
            lastDateTime ? 'lastDateTime=' + lastDateTime : ''}
            &lastId=${lastId}
            &pageSize=${pageSize ? pageSize : 1}`
        )
        .then(response => response.data as BookSearchResult)
        .catch((error) => { throw error; });
    };

const getLikedBooks = ( lastDateTime?: string, lastId?: number, pageSize?: number ): Promise<LikedBook> => {
    return apiAuth.get(`/published-books/liked-books?${
        lastDateTime ? 'lastDateTime=' + lastDateTime : ''}
        &lastId=${lastId}
        &pageSize=${pageSize ? pageSize : 1}`)
    .then(response => response.data as LikedBook)
    .catch((error) => { throw error; });
};


// 리뷰 관련
interface Review {
    reviewId: number;
    nickname?: string; // `memberReview`에는 nickname이 없으므로 optional로 설정
    content: string;
    score: number;
    updatedAt: string; // "YYYY-MM-DD HH:MM" 형식의 날짜 문자열
  }
  
  interface ReviewResponse {
    reviewList: Review[];
    lastDateTime: string; // 마지막 조회 시간 (전체 목록의 마지막이면 null)
    lastId: number | null; // 마지막 리뷰 ID (전체 목록의 마지막이면 null)
    memberReview?: Omit<Review, 'nickname'>; // 회원 리뷰에는 nickname이 없으므로 제외
  }

  const getBookReview = (): Promise<ReviewResponse> => {

  }