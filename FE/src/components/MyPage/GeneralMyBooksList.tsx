import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions, AccessibilityInfo, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { downloadBook, saveBookToLocalDatabase, downloadFileFromUrl, isBookAlreadyDownloaded } from '../../services/BookDetail/BookDetail';
import DownloadModal from '../../components/BookDetail/DownloadModal';

interface Book {
  bookId: number;
  title: string;
  author: string;
  cover: string;
  isDownloaded: boolean;
  epubFlag: boolean; // 다운로드 가능 여부
}

interface GeneralMyBooksListProps {
  books: Book[];
  searchText: string;
}

type BookDetailNavigationProp = StackNavigationProp<RootStackParamList, 'BookDetail'>;

const GeneralMyBooksList: React.FC<GeneralMyBooksListProps> = ({ books, searchText }) => {
  const [downloadedBooks, setDownloadedBooks] = useState<{ [key: number]: boolean }>({});
  const [showOnlyNotDownloaded, setShowOnlyNotDownloaded] = useState(false);
  const [downloading, setDownloading] = useState<{ [key: number]: boolean }>({});
  const [isModalVisible, setModalVisible] = useState(false);
  const [currentBookId, setCurrentBookId] = useState<number | null>(null);
  const navigation = useNavigation<BookDetailNavigationProp>();

  useEffect(() => {
    const checkDownloadedStatus = async () => {
      const status: { [key: number]: boolean } = {};
      for (const book of books) {
        const isDownloaded = await isBookAlreadyDownloaded(book.bookId, book.title);
        status[book.bookId] = isDownloaded;
      }
      setDownloadedBooks(status);
    };

    checkDownloadedStatus();
  }, [books]);

  const normalizedSearchText = searchText ? searchText.toLowerCase() : '';

  const filteredBooks = books.filter((book) => {
    // "다운로드되지 않은 도서만 보기"가 활성화된 경우
    if (showOnlyNotDownloaded) {
      return book.epubFlag && !downloadedBooks[book.bookId]; // 파일은 있지만 아직 다운로드되지 않은 도서만
    }

    // 검색어 필터링 포함
    return (
      book.title.toLowerCase().includes(normalizedSearchText) ||
      book.author.toLowerCase().includes(normalizedSearchText)
    );
  });

  const handleDownload = async (book: Book) => {
    try {
      if (downloading[book.bookId]) return;

      setDownloading((prev) => ({ ...prev, [book.bookId]: true }));

      const metadata = await downloadBook(book.bookId);
      const filePath = await downloadFileFromUrl(metadata.url, `${metadata.title}.epub`);

      const bookData = {
        bookId: metadata.bookId,
        title: metadata.title,
        cover: metadata.cover,
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
      setDownloadedBooks((prev) => ({ ...prev, [book.bookId]: true }));
      setDownloading((prev) => ({ ...prev, [book.bookId]: false }));
      setCurrentBookId(book.bookId);
      setModalVisible(true);

      AccessibilityInfo.announceForAccessibility(`${book.title} 다운로드가 완료되었습니다.`);
    } catch (error) {
      setDownloading((prev) => ({ ...prev, [book.bookId]: false }));
      Alert.alert('다운로드 실패', '도서를 다운로드할 수 없습니다.');
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.filterButton}
        onPress={() => setShowOnlyNotDownloaded((prev) => !prev)}
        accessibilityLabel={showOnlyNotDownloaded ? '모든 도서 보기' : '다운로드되지 않은 도서만 보기'}
      >
        <Text style={styles.filterButtonText}>
          {showOnlyNotDownloaded ? '모든 도서 보기' : '다운로드되지 않은 도서만 보기'}
        </Text>
      </TouchableOpacity>
      {filteredBooks.map((book) => (
        <View key={book.bookId} style={styles.card}>
          <Image
            source={{ uri: book.cover }}
            style={styles.bookCover}
            accessibilityLabel={`${book.title} 표지`}
          />
          <TouchableOpacity
            style={styles.textContainer}
            onPress={() => {
              AccessibilityInfo.announceForAccessibility(`${book.title} 상세보기 페이지로 이동합니다.`);
              navigation.navigate('BookDetail', { bookId: book.bookId });
            }}
            accessibilityLabel={`${book.title} 상세보기 버튼`}
          >
            <Text
              style={styles.title}
              accessibilityLabel={`제목: ${book.title}`}
              numberOfLines={2}
              ellipsizeMode="tail"
            >
              {book.title}
            </Text>
            <Text
              style={styles.author}
              accessibilityLabel={`저자: ${book.author}`}
              numberOfLines={2}
              ellipsizeMode="tail"
            >
              {book.author}
            </Text>
          </TouchableOpacity>
          {!book.epubFlag ? (
            <View style={styles.unavailableSection} accessibilityLabel={`${book.title} 다운로드 불가`}>
              <Text style={styles.unavailableText}>다운불가</Text>
            </View>
          ) : downloadedBooks[book.bookId] ? (
            <View
              style={styles.middleSectionDownloaded}
              accessibilityLabel={`${book.title} 다운로드 완료`}
            >
              <Image source={require('../../assets/icons/checked.png')} style={styles.downloadIcon} />
            </View>
          ) : (
            <TouchableOpacity
              style={styles.middleSection}
              onPress={() => handleDownload(book)}
              disabled={downloading[book.bookId]}
              accessibilityLabel={`${book.title} 다운로드 버튼`}
              accessibilityHint={
                downloading[book.bookId] ? '다운로드 중입니다.' : '이 도서를 다운로드합니다.'
              }
            >
              <Image source={require('../../assets/icons/download2.png')} style={styles.downloadIcon} />
            </TouchableOpacity>
          )}
        </View>
      ))}
      <DownloadModal
        isVisible={isModalVisible}
        onClose={() => setModalVisible(false)}
        onConfirm={() => {
          setModalVisible(false);
          navigation.navigate('EBookReader', { bookId: currentBookId });
        }}
      />
    </View>
  );
};

const { width, height } = Dimensions.get('window');

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
    color: 'white',
    fontSize: width * 0.05,
    fontWeight: 'bold',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 8,
    padding: width * 0.02,
    marginVertical: height * 0.01,
    marginHorizontal: height * 0.01,
    backgroundColor: '#fff',
  },
  bookCover: {
    width: width * 0.15,
    height: height * 0.1,
    marginRight: width * 0.04,
  },
  textContainer: {
    flex: 3,
  },
  title: {
    fontSize: width * 0.06,
    fontWeight: 'bold',
    marginBottom: height * 0.005,
  },
  author: {
    fontSize: width * 0.05,
    color: '#555',
  },
  unavailableSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F44336', // Red for unavailable
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
  },
  unavailableText: {
    color: '#fff',
    fontSize: width * 0.08,
    fontWeight: 'bold',
  },
  middleSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  middleSectionDownloaded: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  downloadIcon: {
    width: width * 0.12,
    height: width * 0.12,
  },
});

export default GeneralMyBooksList;
