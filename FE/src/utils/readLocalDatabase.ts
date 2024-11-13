import RNFS from 'react-native-fs';

/**
 * 로컬 데이터베이스 파일의 내용을 읽고 콘솔에 출력합니다.
 */
export const readLocalDatabase = async () => {
  try {
    const dbPath = `${RNFS.DocumentDirectoryPath}/library.json`;
    const fileExists = await RNFS.exists(dbPath);
    if (fileExists) {
      const fileContent = await RNFS.readFile(dbPath, 'utf8');
      const parsedData = JSON.parse(fileContent);
      console.log('로컬 데이터베이스 내용:', parsedData);
    } else {
      console.log('로컬 데이터베이스 파일이 존재하지 않습니다.');
    }
  } catch (error) {
    console.error('로컬 데이터베이스 읽기 실패:', error);
  }
};

/**
 * 로컬 데이터베이스 초기화 (빈 배열로 덮어쓰기)
 */
export const resetLocalDatabase = async () => {
  try {
    const dbPath = `${RNFS.DocumentDirectoryPath}/library.json`;
    const fileExists = await RNFS.exists(dbPath);

    if (fileExists) {
      // 기존 데이터 읽기
      const fileContent = await RNFS.readFile(dbPath, 'utf8');
      const parsedData = JSON.parse(fileContent);

      // 다운로드된 파일 삭제
      for (const book of parsedData) {
        if (book.filePath) {
          const fileExists = await RNFS.exists(book.filePath);
          if (fileExists) {
            await RNFS.unlink(book.filePath); // 파일 삭제
            console.log(`삭제된 파일 경로: ${book.filePath}`);
          }
        }
      }
    }

    // library.json을 빈 배열로 초기화
    await RNFS.writeFile(dbPath, JSON.stringify([]), 'utf8');
    console.log('로컬 데이터베이스가 초기화되었으며 다운로드된 파일이 모두 삭제되었습니다.');
  } catch (error) {
    console.error('로컬 데이터베이스 초기화 실패:', error);
  }
};
