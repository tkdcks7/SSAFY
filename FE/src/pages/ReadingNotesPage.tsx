import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Dimensions,
  Modal,
} from 'react-native';
import { getReadingNotes, deleteReadingNote } from '../services/ReadingNotes'; // 삭제 함수 추가
import CustomHeader from '../components/CustomHeader';
import MainFooter from '../components/MainFooter';
import { handleScrollEndAnnouncement } from '../utils/announceScrollEnd';

const { width, height } = Dimensions.get('window');

const responsiveFontSize = (factor: number) => width * (factor / 100);
const responsiveHeight = (factor: number) => height * (factor / 100);
const responsiveWidth = (factor: number) => width * (factor / 100);

const ReadingNotesPage: React.FC = () => {
  const [notes, setNotes] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [selectedNoteId, setSelectedNoteId] = useState<number | null>(null);

  useEffect(() => {
    fetchReadingNotes();
  }, []);

  const fetchReadingNotes = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getReadingNotes();
      setNotes(data.noteList);
    } catch (err: any) {
      setError(err.message);
      Alert.alert('오류', err.message);
    } finally {
      setLoading(false);
    }
  };

  const openDeleteModal = (noteId: number) => {
    setSelectedNoteId(noteId);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (selectedNoteId) {
      try {
        await deleteReadingNote(selectedNoteId); // 서버에 삭제 요청
        setNotes((prevNotes) => prevNotes.filter((note) => note.noteId !== selectedNoteId)); // UI에서 삭제
        Alert.alert('삭제 완료', '독서 노트가 삭제되었습니다.');
      } catch (err: any) {
        Alert.alert('오류', err.message); // 오류 메시지 표시
      }
    }
    setShowDeleteModal(false);
  };

  if (loading) {
    return <Text style={styles.loadingText}>로딩 중...</Text>;
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>오류 발생: {error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CustomHeader title="독서노트" />
      <ScrollView
        contentContainerStyle={styles.scrollViewContent}
        onScroll={handleScrollEndAnnouncement}
        scrollEventThrottle={16}
      >
        {notes.map((note) => (
          <View key={note.noteId} style={styles.noteContainer}>
            <Text style={styles.title}>{note.title}</Text>
            <Text style={styles.sentence}>{`"${note.sentence}"`}</Text>
            <View style={styles.noteFooter}>
              <View style={styles.noteDetails}>
                <Text style={styles.progress}>{`진행률: ${note.progressRate}%`}</Text>
                <Text style={styles.date}>{note.createdAt}</Text>
              </View>
              {/* 삭제 버튼 */}
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => openDeleteModal(note.noteId)}
                accessibilityRole="button"
                accessibilityLabel={`"${note.title}" 노트를 삭제합니다.`}
                accessibilityHint="삭제 확인 모달이 열립니다."
              >
                <Text style={styles.deleteButtonText}>삭제</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
        <View style={styles.scrollBottomSpace} />
      </ScrollView>
      <MainFooter />

      {/* 삭제 확인 모달 */}
      <Modal transparent={true} visible={showDeleteModal} animationType="slide">
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalText}>정말 삭제할까요?</Text>
            <TouchableOpacity
              style={styles.submitButton}
              onPress={confirmDelete}
              accessibilityRole="button"
              accessibilityLabel="노트 삭제 확인"
            >
              <Text style={styles.submitButtonText}>확인</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setShowDeleteModal(false)}
              accessibilityRole="button"
              accessibilityLabel="노트 삭제 취소"
            >
              <Text style={styles.cancelButtonText}>취소</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollViewContent: {
    padding: responsiveWidth(4),
    paddingBottom: responsiveHeight(3),
  },
  noteContainer: {
    backgroundColor: '#f9f9f9',
    padding: responsiveWidth(4),
    marginBottom: responsiveHeight(2),
    borderRadius: responsiveWidth(2),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: responsiveWidth(1),
    elevation: 3,
  },
  title: {
    fontSize: responsiveFontSize(7),
    fontWeight: 'bold',
    marginBottom: responsiveHeight(1),
  },
  sentence: {
    fontSize: responsiveFontSize(6),
    fontStyle: 'italic',
    marginBottom: responsiveHeight(1.5),
  },
  noteFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  noteDetails: {
    flex: 1,
  },
  progress: {
    fontSize: responsiveFontSize(5.5),
    color: '#666',
  },
  date: {
    fontSize: responsiveFontSize(5),
    color: '#aaa',
  },
  deleteButton: {
    backgroundColor: '#FF6347',
    paddingVertical: responsiveHeight(1),
    paddingHorizontal: responsiveWidth(10),
    borderRadius: responsiveWidth(2),
  },
  deleteButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: responsiveFontSize(6),
  },
  loadingText: {
    fontSize: responsiveFontSize(5),
    textAlign: 'center',
    marginTop: responsiveHeight(5),
  },
  errorContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: responsiveHeight(5),
  },
  errorText: {
    color: 'red',
    fontSize: responsiveFontSize(5),
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: responsiveWidth(90),
    padding: responsiveWidth(7),
    backgroundColor: '#fff',
    borderRadius: responsiveWidth(2),
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#3943B7',
  },
  modalText: {
    fontSize: responsiveFontSize(5),
    fontWeight: 'bold',
    marginBottom: responsiveHeight(2),
  },
  submitButton: {
    width: responsiveWidth(70),
    height: responsiveHeight(6),
    backgroundColor: '#3943B7',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: responsiveWidth(1),
    marginVertical: responsiveHeight(1),
  },
  submitButtonText: {
    color: '#fff',
    fontSize: responsiveFontSize(4),
  },
  cancelButton: {
    width: responsiveWidth(70),
    height: responsiveHeight(6),
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: responsiveWidth(1),
    borderWidth: 2,
    borderColor: '#3943B7',
    marginVertical: responsiveHeight(1),
  },
  cancelButtonText: {
    color: '#000',
    fontSize: responsiveFontSize(4),
  },
  scrollBottomSpace: {
    height: responsiveHeight(8), // 스크롤 끝 부분 여백
  },
});

export default ReadingNotesPage;
