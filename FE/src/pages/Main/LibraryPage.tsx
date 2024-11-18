import React, {useState, useEffect, useContext, useCallback} from 'react';
import {View, StyleSheet, Alert, FlatList} from 'react-native';
import RNFS from 'react-native-fs';
import {useNavigation, useFocusEffect} from '@react-navigation/native'; // useFocusEffect 추가
import MainHeader from '../../components/MainHeader';
import MainFooter from '../../components/MainFooter';
import Tab from '../../components/Library/Tab';
import Sidebar from '../../components/Library/Sidebar';
import AccessibilityBookList from '../../components/Library/AccessibilityBookList';
import GeneralBookList from '../../components/Library/GeneralBookList';
import CurrentReadingStatus from '../../components/Library/CurrentReadingStatus';
import Btn from '../../components/Btn';
import useEpubStore from '../../store/epubStore';
import {resetLocalDatabase} from '../../utils/readLocalDatabase';
import {getAccessibilityMode} from '../../utils/accessibilityMode'; // 접근성 모드 함수
import {LibraryContext} from '../../contexts/LibraryContext';

const LibraryPage: React.FC = () => {
  const navigation = useNavigation();
  const {allBooks, setAllBooks} = useContext(LibraryContext)!;
  const [books, setBooks] = useState<Book[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [filter, setFilter] = useState<'전체' | '출판도서' | '등록도서'>(
    '전체',
  );
  const [selectedFilter, setSelectedFilter] = useState('다운로드 순');
  const [searchText, setSearchText] = useState('');
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [isAccessibilityMode, setIsAccessibilityMode] = useState(false);

  const {lastAccessedBookId} = useEpubStore();

  const loadBooks = async () => {
    try {
      const dbPath = `${RNFS.DocumentDirectoryPath}/library.json`;
      const fileExists = await RNFS.exists(dbPath);

      if (fileExists) {
        const fileContent = await RNFS.readFile(dbPath, 'utf8');
        const parsedBooks = JSON.parse(fileContent).map(
          (book: any, index: number) => ({
            ...book,
            id: book.bookId || index,
          }),
        );
        setAllBooks(parsedBooks);

        const uniqueCategories = Array.from(
          new Set(parsedBooks.map(book => book.category)),
        );
        setCategories(uniqueCategories);
      } else {
        Alert.alert('알림', '로컬 데이터베이스에 저장된 도서가 없습니다.');
      }
    } catch (error) {
      console.error('도서 데이터를 불러오는 중 오류 발생:', error);
      Alert.alert('오류', '도서 데이터를 불러오는 데 실패했습니다.');
    }
  };

  useEffect(() => {
    loadBooks();
  }, []);

  useEffect(() => {
    const uniqueCategories = Array.from(
      new Set(allBooks.map(book => book.category)),
    );
    setCategories(uniqueCategories);
    applyFilterAndSearch(filter, searchText, selectedFilter);
  }, [allBooks, filter, searchText, selectedFilter]);

  const applyFilterAndSearch = (
    filterType: '전체' | '출판도서' | '등록도서',
    searchText: string,
    selectedFilter: string,
  ) => {
    let filteredBooks = [...allBooks];

    if (filterType === '출판도서') {
      filteredBooks = filteredBooks.filter(book => book.dtype === 'PUBLISHED');
    } else if (filterType === '등록도서') {
      filteredBooks = filteredBooks.filter(book => book.dtype === 'REGISTERED');
    }

    if (searchText) {
      const lowercasedSearch = searchText.toLowerCase().trim();
      filteredBooks = filteredBooks.filter(
        book =>
          book.title.toLowerCase().includes(lowercasedSearch) ||
          book.author.toLowerCase().includes(lowercasedSearch) ||
          book.publisher.toLowerCase().includes(lowercasedSearch),
      );
    }

    if (selectedFilter === '다운로드 순') {
      filteredBooks.sort(
        (a, b) =>
          new Date(b.downloadDate).getTime() -
          new Date(a.downloadDate).getTime(),
      );
    } else if (selectedFilter === '사전 순') {
      filteredBooks.sort((a, b) => a.title.localeCompare(b.title));
    } else if (categories.includes(selectedFilter)) {
      filteredBooks = filteredBooks.filter(
        book => book.category === selectedFilter,
      );
    }

    setBooks(filteredBooks);
  };

  useFocusEffect(
    useCallback(() => {
      const fetchAccessibilityMode = async () => {
        const mode = await getAccessibilityMode();
        setIsAccessibilityMode(mode);
      };
      fetchAccessibilityMode();
    }, []),
  );

  const toggleSidebar = () => {
    setIsSidebarVisible(prev => !prev);
  };

  const handleDatabaseReset = async () => {
    try {
      await resetLocalDatabase();
      setAllBooks([]);
      Alert.alert('성공', '로컬 데이터베이스가 초기화되었습니다.');
    } catch (error) {
      Alert.alert('오류', '로컬 데이터베이스 초기화 중 문제가 발생했습니다.');
    }
  };

  const getCurrentBookData = (): any | null => {
    const val: any | null = books.find(
      book => book.bookId === lastAccessedBookId,
    );
    if (val) {
      return val;
    }
    return null;
  };

  return (
    <View style={styles.container}>
      <MainHeader title="내 서재" />
      {/* <View style={styles.buttonContainer}>
        <Btn title="로컬 DB 초기화" btnSize={1} onPress={handleDatabaseReset} />
        <Btn
          title="로컬 DB 보기"
          btnSize={1}
          onPress={() => navigation.navigate('DatabaseViewer')}
        />
      </View> */}
      <FlatList
        data={books}
        keyExtractor={item => item.id.toString()}
        ListHeaderComponent={
          <View style={styles.contentContainer}>
            <Tab
              onMenuPress={toggleSidebar}
              onTabClick={setFilter}
              onSearch={setSearchText}
            />
            {isAccessibilityMode ? (
              <AccessibilityBookList
                books={books}
                currentBook={getCurrentBookData()}
              />
            ) : (
              <View>
                <CurrentReadingStatus book={getCurrentBookData()} />
                <GeneralBookList books={books} />
              </View>
            )}
          </View>
        }
        extraData={books}
      />
      {isSidebarVisible && (
        <Sidebar
          onClose={toggleSidebar}
          onFilterSelect={filter => {
            setSelectedFilter(filter);
            toggleSidebar();
          }}
          selectedFilter={selectedFilter}
          categories={categories}
        />
      )}
      <MainFooter />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 5,
    width: '60%',
  },
  contentContainer: {
    flex: 1,
    paddingBottom: 100,
  },
});

export default LibraryPage;
