import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  Dimensions,
  TouchableOpacity,
  Modal,
  Alert,
  AccessibilityInfo,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LibraryContext } from '../../contexts/LibraryContext';

const { width, height } = Dimensions.get('window');

type Book = {
  id: number;
  bookId: number;
  title: string;
  author: string;
  cover: string;
};

type GeneralBookListProps = {
  books: Book[];
};

const GeneralBookList: React.FC<GeneralBookListProps> = ({ books }) => {
  const { removeBook } = useContext(LibraryContext)!; // LibraryContext에서 removeBook 가져오기
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const navigation = useNavigation();

  const handleDelete = (book: Book) => {
    setSelectedBook(book);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (selectedBook) {
      try {
        await removeBook(selectedBook.bookId);
        AccessibilityInfo.announceForAccessibility('도서가 삭제되었습니다.');
        Alert.alert('성공', `${selectedBook.title}이(가) 삭제되었습니다.`);
      } catch (error) {
        Alert.alert('오류', '도서를 삭제하는 중 문제가 발생했습니다.');
      } finally {
        setShowDeleteModal(false);
        setSelectedBook(null);
      }
    }
  };

  return (
    <View style={styles.bookContainer}>
      <Text style={styles.bookContainerTitleText}>내 서재</Text>
      <FlatList
        data={books}
        keyExtractor={(item) => item.id.toString()}
        numColumns={3}
        renderItem={({ item }) => (
          <View style={styles.bookItem}>
            <TouchableOpacity
              onPress={() => {
                AccessibilityInfo.announceForAccessibility(`${item.title} 상세보기 페이지로 이동합니다.`);
                navigation.navigate('EBookViewer', { bookId: item.bookId });
              }}
              accessibilityLabel={`${item.title} 선택됨`}
              accessibilityHint="상세 정보를 확인하려면 두 번 탭하세요."
            >
              <Image
                source={{ uri: item.cover.startsWith('http') ? item.cover : `file://${item.cover}` }}
                style={styles.bookImage}
                accessibilityLabel={`표지 이미지: ${item.title}`}
              />
              <Text style={styles.bookTitle} numberOfLines={2} ellipsizeMode="tail">
                {item.title}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => handleDelete(item)}
              accessibilityLabel="삭제 버튼"
            >
              <Text style={styles.deleteButtonText}>삭제</Text>
            </TouchableOpacity>
          </View>
        )}
        contentContainerStyle={styles.flatListContent}
      />

      {/* 삭제 확인 모달 */}
      <Modal transparent={true} visible={showDeleteModal} animationType="slide">
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalText}>이 도서를 책장에서 제거할까요?</Text>
            <TouchableOpacity
              style={styles.submitButton}
              onPress={confirmDelete}
              accessibilityRole="button"
              accessibilityLabel="도서 삭제 확인"
            >
              <Text style={styles.submitButtonText}>확인</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setShowDeleteModal(false)}
              accessibilityRole="button"
              accessibilityLabel="도서 삭제 취소"
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
  bookContainer: {
    marginHorizontal: width * 0.03,
  },
  bookContainerTitleText: {
    fontSize: width * 0.06,
    fontWeight: 'bold',
    color: '#3943B7',
    marginBottom: height * 0.02,
  },
  flatListContent: {
    paddingHorizontal: width * 0.02,
  },
  bookItem: {
    width: width * 0.3, // 각 아이템이 3분의 1 공간을 차지
    marginBottom: height * 0.02,
    marginRight: width * 0.02,
    alignItems: 'center',
    position: 'relative',
  },
  bookImage: {
    width: width * 0.28,
    height: width * 0.34,
    resizeMode: 'contain',
    borderRadius: width * 0.02,
  },
  bookTitle: {
    marginTop: height * 0.005,
    fontSize: width * 0.04,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  deleteButton: {
    position: 'absolute',
    top: height * 0.005,
    right: width * 0.01,
    backgroundColor: 'red',
    paddingVertical: height * 0.006,
    paddingHorizontal: width * 0.03,
    borderRadius: width * 0.015,
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: width * 0.035,
    fontWeight: 'bold',
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: width * 0.9,
    padding: width * 0.07,
    backgroundColor: '#fff',
    borderRadius: width * 0.03,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#3943B7',
  },
  modalText: {
    fontSize: width * 0.05,
    fontWeight: 'bold',
    marginBottom: height * 0.02,
  },
  submitButton: {
    width: width * 0.7,
    height: height * 0.06,
    backgroundColor: '#3943B7',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: width * 0.02,
    marginVertical: height * 0.01,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: width * 0.045,
  },
  cancelButton: {
    width: width * 0.7,
    height: height * 0.06,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: width * 0.02,
    borderWidth: 2,
    borderColor: '#3943B7',
    marginVertical: height * 0.01,
  },
  cancelButtonText: {
    color: '#000',
    fontSize: width * 0.045,
  },
});

export default GeneralBookList;
