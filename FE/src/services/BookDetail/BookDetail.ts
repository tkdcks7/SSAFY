import apiAuth from '../../utils/apiAuth';
import RNFS from 'react-native-fs';

// 도서 상세 조회 API
export const fetchBookDetail = async (bookId: number) => {
  try {
    const response = await apiAuth.get(`/published-books/${bookId}`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch book detail:', error);
    throw error;
  }
};

// 좋아요 요청/취소 API
export const toggleLikeBook = async (bookId: number, likedFlag: boolean) => {
  try {
    const response = await apiAuth.post('/published-books/liked-books', {
      bookId,
      likedFlag,
    });
    return response.data; // 서버에서 필요한 데이터 반환
  } catch (error) {
    console.error('Failed to toggle like status:', error);
    throw error;
  }
};

// 도서 담기/삭제 API
export const toggleBookCart = async (bookId: number, cartFlag: boolean) => {
  try {
    const response = await apiAuth.post('/published-books/book-cart', {
      bookId,
      cartFlag, // true: 담기, false: 삭제
    });
    return response.data;
  } catch (error) {
    console.error('Failed to toggle book cart status:', error);
    throw error;
  }
};


/**
 * 도서 다운로드 요청 API
 * @param bookId {number} - 다운로드할 도서 ID
 * @returns {Promise<any>} - 도서 메타데이터와 다운로드 URL 반환
 */
export const downloadBook = async (bookId: number) => {
  try {
    const response = await apiAuth.get(`/published-books/${bookId}/download`);
    return response.data; // 반환된 메타데이터와 다운로드 URL
  } catch (error) {
    console.error('Failed to request download:', error);
    throw error;
  }
};

/**
 * 파일 다운로드 함수
 * @param url {string} - 다운로드할 파일의 URL
 * @param fileName {string} - 저장할 파일 이름
 * @returns {Promise<string>} - 다운로드된 파일의 경로
 */
export const downloadFileFromUrl = async (url: string, fileName: string) => {
  try {
    const downloadPath = `${RNFS.DocumentDirectoryPath}/${fileName}`;
    const result = await RNFS.downloadFile({
      fromUrl: url,
      toFile: downloadPath,
    }).promise;

    if (result.statusCode === 200) {
      console.log('File downloaded successfully:', downloadPath);
      return downloadPath;
    } else {
      throw new Error('File download failed.');
    }
  } catch (error) {
    console.error('Failed to download file:', error);
    throw error;
  }
};

/**
 * 로컬 데이터베이스에 도서 메타데이터 저장
 * @param metadata {any} - 저장할 도서 메타데이터
 */
export const saveBookToLocalDatabase = async (metadata: any) => {
  try {
    const dbPath = `${RNFS.DocumentDirectoryPath}/library.json`;
    const dbExists = await RNFS.exists(dbPath);
    let library = [];

    if (dbExists) {
      const currentData = await RNFS.readFile(dbPath, 'utf8');
      library = JSON.parse(currentData);
    }

    // 중복 확인 및 추가
    const bookExists = library.some((book: any) => book.bookId === metadata.bookId);
    if (bookExists) {
      console.log('Book already exists in the local database.');
      return;
    }

    library.push(metadata); // 필요한 데이터만 추가
    await RNFS.writeFile(dbPath, JSON.stringify(library, null, 2), 'utf8');
    console.log('Book metadata saved successfully.');
  } catch (error) {
    console.error('Failed to save book metadata:', error);
  }
};


/**
 * 도서 다운로드 여부 확인
 * @param bookId {number} - 도서 ID
 * @param title {string} - 도서 제목
 * @returns {Promise<boolean>} - 다운로드 여부
 */
export const isBookAlreadyDownloaded = async (bookId: number, title: string): Promise<boolean> => {
  try {
    const dbPath = `${RNFS.DocumentDirectoryPath}/library.json`;
    const filePath = `${RNFS.DocumentDirectoryPath}/${title}.epub`;

    // 데이터베이스 확인
    if (await RNFS.exists(dbPath)) {
      const currentData = await RNFS.readFile(dbPath);
      const library = JSON.parse(currentData);
      const bookExists = library.some((book: any) => book.bookId === bookId);

      // 파일 존재 여부와 데이터베이스 등록 여부 둘 다 체크
      if (bookExists && await RNFS.exists(filePath)) {
        return true;
      }
    }

    return false;
  } catch (error) {
    console.error('Failed to check if book is already downloaded:', error);
    return false;
  }
};
