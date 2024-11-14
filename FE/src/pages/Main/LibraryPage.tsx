import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, FlatList } from 'react-native';
import RNFS from 'react-native-fs';
import { useNavigation } from '@react-navigation/native';
import MainHeader from '../../components/MainHeader';
import MainFooter from '../../components/MainFooter';
import Tab from '../../components/Library/Tab';
import Sidebar from '../../components/Library/Sidebar';
import AccessibilityBookList from '../../components/Library/AccessibilityBookList';
import GeneralBookList from '../../components/Library/GeneralBookList';
import CurrentReadingStatus from '../../components/Library/CurrentReadingStatus';
import Btn from '../../components/Btn';
import { resetLocalDatabase } from '../../utils/readLocalDatabase';

type Book = {
  id: number;
  title: string;
  author: string;
  cover: string;
  publisher: string;
  category: string;
  downloadDate: string;
  dtype: 'PUBLISHED' | 'REGISTERED';
};

const LibraryPage: React.FC = () => {
  const navigation = useNavigation();
  const [allBooks, setAllBooks] = useState<Book[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [filter, setFilter] = useState<'전체' | '출판도서' | '등록도서'>('전체');
  const [selectedFilter, setSelectedFilter] = useState('다운로드 순');
  const [searchText, setSearchText] = useState('');
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [isAccessibilityMode, setIsAccessibilityMode] = useState(false);

  // 데이터 로드 함수
  const loadBooks = async () => {
    try {
      const dbPath = `${RNFS.DocumentDirectoryPath}/library.json`;
      const fileExists = await RNFS.exists(dbPath);

      if (fileExists) {
        const fileContent = await RNFS.readFile(dbPath, 'utf8');
        const parsedBooks = JSON.parse(fileContent).map((book: any, index: number) => ({
          ...book,
          id: book.id || index,
        }));
        setAllBooks(parsedBooks);
        setBooks(parsedBooks);

        const uniqueCategories = Array.from(new Set(parsedBooks.map((book: Book) => book.category)));
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
    loadBooks(); // 컴포넌트가 처음 로드될 때 로컬 데이터 로드
  }, []);

  useEffect(() => {
    applyFilterAndSearch(filter, searchText, selectedFilter);
  }, [filter, searchText, selectedFilter, allBooks]); // allBooks가 업데이트되면 필터 다시 적용

  const applyFilterAndSearch = (
    filterType: '전체' | '출판도서' | '등록도서',
    searchText: string,
    selectedFilter: string
  ) => {
    let filteredBooks = [...allBooks];

    if (filterType === '출판도서') {
      filteredBooks = filteredBooks.filter((book) => book.dtype === 'PUBLISHED');
    } else if (filterType === '등록도서') {
      filteredBooks = filteredBooks.filter((book) => book.dtype === 'REGISTERED');
    }

    if (searchText) {
      const lowercasedSearch = searchText.toLowerCase().trim();
      filteredBooks = filteredBooks.filter(
        (book) =>
          book.title.toLowerCase().includes(lowercasedSearch) ||
          book.author.toLowerCase().includes(lowercasedSearch) ||
          book.publisher.toLowerCase().includes(lowercasedSearch)
      );
    }

    if (selectedFilter === '다운로드 순') {
      filteredBooks.sort((a, b) => new Date(b.downloadDate).getTime() - new Date(a.downloadDate).getTime());
    } else if (selectedFilter === '사전 순') {
      filteredBooks.sort((a, b) => a.title.localeCompare(b.title));
    } else if (categories.includes(selectedFilter)) {
      filteredBooks = filteredBooks.filter((book) => book.category === selectedFilter);
    }

    setBooks(filteredBooks);
  };

  const toggleSidebar = () => {
    setIsSidebarVisible((prev) => !prev);
  };

  const handleDatabaseReset = async () => {
    try {
      await resetLocalDatabase();
      setBooks([]);
      setAllBooks([]);
      Alert.alert('성공', '로컬 데이터베이스가 초기화되었습니다.');
    } catch (error) {
      Alert.alert('오류', '로컬 데이터베이스 초기화 중 문제가 발생했습니다.');
    }
  };

  return (
    <View style={styles.container}>
      <MainHeader
        title="내 서재"
        isAccessibilityMode={isAccessibilityMode}
        onModeToggle={() => setIsAccessibilityMode((prev) => !prev)}
      />
      <View style={styles.buttonContainer}>
        <Btn title="로컬 DB 초기화" btnSize={1} onPress={handleDatabaseReset} />
        <Btn
          title="로컬 DB 보기"
          btnSize={1}
          onPress={() => navigation.navigate('DatabaseViewer')}
        />
      </View>
      <FlatList
        data={books}
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={
          <View style={styles.contentContainer}>
            <Tab onMenuPress={toggleSidebar} onTabClick={setFilter} onSearch={setSearchText} />
            <CurrentReadingStatus />
            {isAccessibilityMode ? (
              <AccessibilityBookList books={books} />
            ) : (
              <GeneralBookList books={books} />
            )}
          </View>
        }
        extraData={books} // 상태 변경 감지
      />
      {isSidebarVisible && (
        <Sidebar
          onClose={toggleSidebar}
          onFilterSelect={(filter) => {
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
