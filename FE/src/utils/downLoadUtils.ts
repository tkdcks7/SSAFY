import RNFS from 'react-native-fs';

// 파일 다운로드 함수
export const downloadFile = async (url: string, fileName: string): Promise<string | undefined> => {
  try {
    const filePath = `${RNFS.DocumentDirectoryPath}/${fileName}`;
    const downloadResult = await RNFS.downloadFile({ fromUrl: url, toFile: filePath }).promise;
    if (downloadResult.statusCode === 200) {
      return filePath;
    } else {
      throw new Error('파일 다운로드 실패');
    }
  } catch (error) {
    console.error('파일 다운로드 오류:', error);
  }
};