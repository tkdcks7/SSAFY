import React, {useState, useEffect, useContext} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  AccessibilityInfo,
  Alert,
} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../navigation/AppNavigator';
import {
  downloadBook,
  saveBookToLocalDatabase,
  downloadFileFromUrl,
  isBookAlreadyDownloaded,
} from '../../services/BookDetail/BookDetail';
import DownloadModal from '../../components/BookDetail/DownloadModal';
import {LibraryContext} from '../../contexts/LibraryContext'; // 전역 상태 관리

interface Book {
  bookId: number;
  title: string;
  author: string;
  cover: string;
  coverAlt: string; // 추가된 coverAlt
  isDownloaded: boolean;
  epubFlag: boolean; // 다운로드 가능 여부
}

interface AccessibilityMyBooksListProps {
  books: Book[];
  searchQuery: string;
  navigation: MyBooksNavigationProp;
}

type MyBooksNavigationProp = StackNavigationProp<RootStackParamList, 'MyBooks'>;

const {width, height} = Dimensions.get('window');

const AccessibilityMyBooksList: React.FC<AccessibilityMyBooksListProps> = ({
  books,
  searchQuery,
  navigation,
}) => {
  const {addBook} = useContext(LibraryContext)!; // 전역 상태 관리 함수
  const [downloadedBooks, setDownloadedBooks] = useState<{
    [key: number]: boolean;
  }>({});
  const [showOnlyNotDownloaded, setShowOnlyNotDownloaded] = useState(false);
  const [downloading, setDownloading] = useState<{[key: number]: boolean}>({});
  const [isModalVisible, setModalVisible] = useState(false);
  const [currentBookId, setCurrentBookId] = useState<number | null>(null);

  useEffect(() => {
    const checkDownloadedStatus = async () => {
      const status: {[key: number]: boolean} = {};
      for (const book of books) {
        const isDownloaded = await isBookAlreadyDownloaded(
          book.bookId,
          book.title,
        );
        status[book.bookId] = isDownloaded;
      }
      setDownloadedBooks(status);
    };

    checkDownloadedStatus();
  }, [books]);

  const filteredBooks = books.filter(book => {
    if (showOnlyNotDownloaded) {
      return book.epubFlag && !downloadedBooks[book.bookId];
    }
    return (
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const handleDownload = async (book: Book) => {
    try {
      if (downloading[book.bookId]) return;

      setDownloading(prev => ({...prev, [book.bookId]: true}));

      const metadata = await downloadBook(book.bookId);
      const filePath = await downloadFileFromUrl(
        metadata.url,
        `${metadata.title}.epub`,
      );

      const bookData = {
        id: Date.now(), // 고유 ID 생성
        bookId: metadata.bookId,
        title: metadata.title,
        cover: metadata.cover,
        coverAlt: metadata.coverAlt, // 추가된 coverAlt
        category: metadata.category,
        author: metadata.author,
        publisher: metadata.publisher,
        publishedAt: metadata.publishedAt,
        myTtsFlag: metadata.myTtsFlag,
        dtype: metadata.dtype,
        filePath,
        downloadDate: new Date().toISOString(),
        currentCfi: '',
        progressRate: 0,
      };

      await saveBookToLocalDatabase(bookData);
      addBook(bookData); // 전역 상태에 도서 추가
      setDownloadedBooks(prev => ({...prev, [book.bookId]: true}));
      setDownloading(prev => ({...prev, [book.bookId]: false}));
      setCurrentBookId(book.bookId);
      setModalVisible(true);

      AccessibilityInfo.announceForAccessibility(
        `${book.title} 다운로드가 완료되었습니다.`,
      );
    } catch (error) {
      setDownloading(prev => ({...prev, [book.bookId]: false}));
      Alert.alert('다운로드 실패', '도서를 다운로드할 수 없습니다.');
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.filterButton}
        onPress={() => setShowOnlyNotDownloaded(prev => !prev)}
        accessibilityLabel={
          showOnlyNotDownloaded
            ? '모든 도서 보기'
            : '다운로드되지 않은 도서만 보기'
        }>
        <Text style={styles.filterButtonText}>
          {showOnlyNotDownloaded
            ? '모든 도서 보기'
            : '다운로드되지 않은 도서만 보기'}
        </Text>
      </TouchableOpacity>
      {filteredBooks.map(book => (
        <View key={book.bookId} style={styles.card}>
          <View style={styles.leftSection}>
            <Text
              style={styles.title}
              accessibilityLabel={`제목: ${book.title}`}
              numberOfLines={2}
              ellipsizeMode="tail">
              {book.title}
            </Text>
            <Text
              style={styles.author}
              accessibilityLabel={`저자: ${book.author}`}
              numberOfLines={1}
              ellipsizeMode="tail">
              {book.author}
            </Text>
          </View>
          {!book.epubFlag ? (
            <View
              style={styles.unavailableSection}
              accessibilityLabel={`${book.title} 다운로드 불가`}>
              <Text style={styles.unavailableText}>다운불가</Text>
            </View>
          ) : !downloadedBooks[book.bookId] ? (
            <TouchableOpacity
              style={styles.middleSection}
              onPress={() => handleDownload(book)}
              disabled={downloading[book.bookId]}
              accessibilityLabel={`${book.title} 다운로드 버튼`}
              accessibilityHint={
                downloading[book.bookId]
                  ? '다운로드 중입니다.'
                  : '이 도서를 다운로드합니다.'
              }>
              <Text style={styles.downloadText}>다운로드</Text>
            </TouchableOpacity>
          ) : (
            <View
              style={styles.middleSectionDownloaded}
              accessibilityLabel={`${book.title} 다운로드 완료`}>
              <Text style={styles.downloadedText}>다운완료</Text>
            </View>
          )}
          <TouchableOpacity
            style={styles.rightSection}
            onPress={() => {
              AccessibilityInfo.announceForAccessibility(
                `${book.title} 상세보기 페이지로 이동합니다.`,
              );
              navigation.navigate('BookDetail', {bookId: book.bookId});
            }}
            accessibilityLabel={`${book.title} 상세보기 버튼`}>
            <Text style={styles.detailText}>상세보기</Text>
          </TouchableOpacity>
        </View>
      ))}
      <DownloadModal
        isVisible={isModalVisible}
        onClose={() => setModalVisible(false)}
        onConfirm={() => {
          setModalVisible(false);
          if (currentBookId) {
            navigation.navigate('EBookViewer', {bookId: currentBookId});
          }
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: height * 0.05,
  },
  filterButton: {
    alignSelf: 'center',
    backgroundColor: '#3943B7',
    paddingVertical: height * 0.01,
    paddingHorizontal: width * 0.05,
    borderRadius: 8,
    marginVertical: height * 0.02,
  },
  filterButtonText: {
    color: '#fff',
    fontSize: width * 0.05,
    fontWeight: 'bold',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'stretch',
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 8,
    marginVertical: height * 0.01,
    backgroundColor: '#fff',
    height: height * 0.12,
  },
  leftSection: {
    flex: 3,
    justifyContent: 'center',
    paddingLeft: width * 0.04,
  },
  title: {
    fontSize: width * 0.06,
    fontWeight: 'bold',
    marginBottom: height * 0.005,
  },
  author: {
    fontSize: width * 0.04,
    color: '#555',
  },
  unavailableSection: {
    flex: 1,
    backgroundColor: '#FF6347', // 밝은 빨간색으로 불가 상태 표시
    justifyContent: 'center',
    alignItems: 'center',
  },
  unavailableText: {
    color: '#fff',
    fontSize: width * 0.07,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  middleSection: {
    flex: 1,
    backgroundColor: '#0000ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  middleSectionDownloaded: {
    flex: 1,
    backgroundColor: '#aaa',
    justifyContent: 'center',
    alignItems: 'center',
  },
  downloadText: {
    color: '#fff',
    fontSize: width * 0.07,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  downloadedText: {
    color: '#fff',
    fontSize: width * 0.07,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  rightSection: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailText: {
    color: '#000',
    fontSize: width * 0.07,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default AccessibilityMyBooksList;
