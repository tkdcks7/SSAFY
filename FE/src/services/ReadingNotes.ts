import apiAuth from '../utils/apiAuth';
import { Alert } from 'react-native';

interface ReadingNote {
  noteId: number;
  bookId: number;
  title: string;
  progressRate: number;
  createdAt: string;
  sentence: string;
  sentenceId: string;
}

interface ReadingNotesResponse {
  noteList: ReadingNote[];
}

/**
 * 독서 노트 조회 함수
 * @returns {Promise<ReadingNotesResponse>} - 독서 노트 목록
 */
export const getReadingNotes = async (): Promise<ReadingNotesResponse> => {
  try {
    const response = await apiAuth.get('/notes');
    return response.data; // { noteList: [...] }
  } catch (error: any) {
    if (error.response) {
      const { status, data } = error.response;

      if (status === 400) {
        throw new Error(`요청 오류: ${data.message} (코드: ${data.code})`);
      }

      if (status === 500) {
        throw new Error(
          `서버 오류: ${data.message} (코드: ${data.code}). 상세: ${data.errorMessage}`
        );
      }

      throw new Error(`알 수 없는 오류 발생 (상태 코드: ${status})`);
    } else {
      throw new Error('네트워크 오류: 인터넷 연결을 확인해주세요.');
    }
  }
};

/**
 * 독서 노트 삭제 함수
 * @param {number} noteId - 삭제할 노트의 ID
 * @returns {Promise<void>} - 성공적으로 삭제되면 아무것도 반환하지 않음
 */
export const deleteReadingNote = async (noteId: number): Promise<void> => {
  try {
    const response = await apiAuth.delete(`/notes/${noteId}`);

    if (response.status === 204 || response.status === 200) {
      Alert.alert('성공', '독서 노트가 삭제되었습니다.');
    } else {
      console.warn('예상치 못한 응답:', response);
    }
  } catch (error: any) {
    if (error.response) {
      const { status, data } = error.response;
      throw new Error(`요청 오류: ${data.message} (코드: ${data.code})`);
    } else {
      throw new Error('네트워크 오류: 인터넷 연결을 확인해주세요.');
    }
  }
};
