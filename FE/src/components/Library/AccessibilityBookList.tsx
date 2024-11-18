import React, {useEffect, useState, useContext} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  Dimensions,
  AccessibilityInfo,
  TouchableOpacity,
  Modal,
} from 'react-native';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {RootStackParamList} from '../../navigation/AppNavigator';
import {LibraryContext} from '../../contexts/LibraryContext';

const {width, height} = Dimensions.get('window');

type Book = {
  id: number;
  title: string;
  author: string;
  publisher: string;
  cover: string;
  progressRate?: number; // 진행도
  bookId: number;
};

type AccessibilityBookListProps = {
  books: Book[];
  currentBook: Book | null;
};

const AccessibilityBookList: React.FC<AccessibilityBookListProps> = ({
  books,
  currentBook,
}) => {
  const {removeBook} = useContext(LibraryContext)!;
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  useEffect(() => {
    if (currentBook) {
      AccessibilityInfo.announceForAccessibility(
        `현재 읽고 있는 책은 ${currentBook.title}입니다.`,
      );
    }
  }, [currentBook]);

  const handleDelete = (book: Book) => {
    setSelectedBook(book);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (selectedBook) {
      removeBook(selectedBook.bookId)
        .then(() => {
          AccessibilityInfo.announceForAccessibility(
            `${selectedBook.title}이(가) 책장에서 삭제되었습니다.`,
          );
          setShowDeleteModal(false);
          setSelectedBook(null);
        })
        .catch(() => {
          AccessibilityInfo.announceForAccessibility(
            '삭제에 실패했습니다. 다시 시도해주세요.',
          );
        });
    }
  };

  return (
    <>
      <FlatList
        data={books}
        keyExtractor={item => item.id.toString()}
        style={styles.bookContainer}
        ListHeaderComponent={
          <View>
            {currentBook ? (
              <View style={styles.currentBookContainer}>
                <Text
                  style={styles.currentBookTitle}
                  accessibilityLabel={`현재 읽고 있는 책: ${currentBook.title}`}>
                  현재 읽고 있는 책
                </Text>
                <TouchableOpacity
                  style={[styles.bookItem, styles.currentBookItem]}
                  onPress={() => {
                    AccessibilityInfo.announceForAccessibility(
                      `${currentBook.title} 도서 뷰어로 이동합니다.`,
                    );
                    navigation.navigate('EBookViewer', {
                      bookId: currentBook.bookId,
                    });
                  }}
                  accessibilityLabel={`현재 읽고 있는 도서 ${currentBook.title}. 표지 이미지: ${currentBook.title}. 저자: ${currentBook.author}.`}
                  accessibilityHint="뷰어로 이동하려면 두 번 탭하세요.">
                  <Image
                    source={{
                      uri: currentBook.cover.startsWith('http')
                        ? currentBook.cover
                        : `file://${currentBook.cover}`,
                    }}
                    style={styles.bookImage}
                    accessibilityLabel={`표지 이미지: ${currentBook.title}`}
                  />
                  <View style={styles.bookInfo}>
                    <Text
                      style={styles.bookTitle}
                      numberOfLines={2}
                      ellipsizeMode="tail"
                      accessibilityLabel={`제목: ${currentBook.title}`}>
                      {currentBook.title}
                    </Text>
                    <View style={styles.container}>
                      <Text style={styles.containerText}>{`진행률: ${
                        currentBook.progressRate * 100
                      }%`}</Text>
                    </View>
                    <Text
                      style={styles.bookAuthor}
                      numberOfLines={1}
                      ellipsizeMode="tail"
                      accessibilityLabel={`저자: ${currentBook.author}`}>
                      저자: {currentBook.author}
                    </Text>
                    {/* {
                      <Text
                        style={styles.bookProgress}
                        accessibilityLabel={`진행도: ${currentBook.progressRate}%`}>
                        진행도: {currentBook.progressRate}%
                      </Text>
                    } */}
                  </View>
                </TouchableOpacity>
              </View>
            ) : null}
            <Text
              style={styles.bookContainerTitle}
              accessibilityLabel="내 서재 도서 목록">
              내 서재
            </Text>
          </View>
        }
        renderItem={({item}) => (
          <View style={styles.bookItemContainer}>
            <TouchableOpacity
              style={styles.bookItem}
              onPress={() => {
                AccessibilityInfo.announceForAccessibility(
                  `${item.title} 도서 뷰어로 이동합니다.`,
                );
                navigation.navigate('EBookViewer', {bookId: item.bookId});
              }}
              accessibilityLabel={`${item.title} 도서 표지. 저자: ${item.author}.`}
              accessibilityHint="뷰어로 이동하려면 두 번 탭하세요.">
              <Image
                source={{
                  uri: item.cover.startsWith('http')
                    ? item.cover
                    : `file://${item.cover}`,
                }}
                style={styles.bookImage}
                accessibilityLabel={`표지 이미지: ${item.title}`}
              />
              <View style={styles.textContainer}>
                <View style={styles.titleRow}>
                  <Text
                    style={styles.bookTitle}
                    numberOfLines={2}
                    ellipsizeMode="tail"
                    accessibilityLabel={`제목: ${item.title}`}>
                    {item.title}
                  </Text>
                  <TouchableOpacity
                    onPress={() => handleDelete(item)}
                    accessibilityLabel={`${item.title} 도서 삭제 버튼`}
                    accessibilityHint="항목을 삭제하려면 두 번 탭하세요."
                    style={styles.deleteButton}>
                    <Text style={styles.deleteButtonText}>삭제</Text>
                  </TouchableOpacity>
                </View>
                <Text
                  style={styles.bookAuthor}
                  numberOfLines={2}
                  ellipsizeMode="tail"
                  accessibilityLabel={`저자: ${item.author}`}>
                  저자: {item.author}
                </Text>
                <Text
                  style={styles.publisher}
                  numberOfLines={2}
                  ellipsizeMode="tail"
                  accessibilityLabel={`출판사: ${item.publisher}`}>
                  출판사: {item.publisher}
                </Text>
              </View>
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
              accessibilityLabel="도서 삭제 확인">
              <Text style={styles.submitButtonText}>확인</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setShowDeleteModal(false)}
              accessibilityRole="button"
              accessibilityLabel="도서 삭제 취소">
              <Text style={styles.cancelButtonText}>취소</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  bookContainer: {
    marginHorizontal: width * 0.02,
    marginBottom: height * 0.2,
  },
  bookContainerTitle: {
    fontSize: width * 0.07,
    fontWeight: 'bold',
    color: '#3943B7',
    marginBottom: height * 0.01,
  },
  currentBookContainer: {
    marginBottom: height * 0.02,
  },
  currentBookTitle: {
    fontSize: width * 0.07,
    fontWeight: 'bold',
    color: '#3943B7',
    marginBottom: height * 0.01,
  },
  bookProgress: {
    fontSize: width * 0.04,
    color: '#3943B7',
    fontWeight: 'bold',
    marginTop: height * 0.005,
  },
  currentBookItem: {
    borderRadius: width * 0.03,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: height * 0.005},
    shadowOpacity: 0.3,
    shadowRadius: width * 0.02,
    elevation: 5,
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#fff',
    padding: width * 0.02,
  },
  bookItemContainer: {
    marginBottom: height * 0.02,
  },
  bookItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: width * 0.02,
    backgroundColor: '#ffffff',
    borderRadius: width * 0.03,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: height * 0.005},
    shadowOpacity: 0.3,
    shadowRadius: width * 0.02,
    elevation: 5,
  },
  bookImage: {
    width: width * 0.25,
    height: height * 0.2,
    borderRadius: width * 0.02,
    marginRight: width * 0.03,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: height * 0.005,
  },
  bookTitle: {
    fontSize: width * 0.05,
    fontWeight: 'bold',
    color: '#000000',
    flex: 1,
    flexShrink: 1,
    marginRight: width * 0.02,
    // marginBottom: height * 0.04,
  },
  deleteButton: {
    backgroundColor: '#FF6347',
    paddingVertical: height * 0.02,
    paddingHorizontal: width * 0.03,
    marginBottom: height * 0.04,
    borderRadius: width * 0.02,
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: width * 0.04,
    fontWeight: 'bold',
  },
  bookAuthor: {
    fontSize: width * 0.04,
    color: '#666666',
    marginBottom: height * 0.005,
    flexShrink: 1,
  },
  publisher: {
    fontSize: width * 0.04,
    color: '#666666',
    marginBottom: height * 0.005,
    flexShrink: 1,
  },
  flatListContent: {
    paddingBottom: height * 0.02,
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
    borderRadius: 10,
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
    borderRadius: 5,
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
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#3943B7',
    marginVertical: height * 0.01,
  },
  cancelButtonText: {
    color: '#000',
    fontSize: width * 0.045,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: width * 0.02,
    paddingHorizontal: width * 0.03,
    backgroundColor: '#3943B7',
    marginVertical: height * 0.01,
    borderRadius: 8,
    elevation: 5,
    height: height * 0.12,
    width: width * 0.6,
  },
  containerText: {
    fontSize: width * 0.08,
    color: 'white',
    fontWeight: 'bold',
  },
});

export default AccessibilityBookList;
