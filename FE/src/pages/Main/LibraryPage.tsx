import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { LibraryStackParamList } from '../../navigation/LibraryNavigator';
import MainHeader from '../../components/MainHeader';
import MainFooter from '../../components/MainFooter';
import Tab from '../../components/Library/Tab';
import Sidebar from '../../components/Library/Sidebar';
import AccessibilityBookList from '../../components/Library/AccessibilityBookList';
import GeneralBookList from '../../components/Library/GeneralBookList';
import CurrentReadingStatus from '../../components/Library/CurrentReadingStatus';
import { dummyBooks } from '../../data/dummyBooks';
import { FlatList } from 'react-native';

// 더미 데이터 타입 정의
type Book = {
  id: number;
  title: string;
  author: string;
  downloadDate: string;
  category: string;
  type: '출판도서' | '등록도서';
  coverImage: any;
  publisher: string;
};

type LibraryPageNavigationProp = StackNavigationProp<LibraryStackParamList, 'LibraryMain'>;

type Props = {
  navigation: LibraryPageNavigationProp;
};

const LibraryPage: React.FC<Props> = ({ navigation }) => {
  const [isAccessibilityMode, setIsAccessibilityMode] = useState(false);
  const [isUserVisuallyImpaired, setIsUserVisuallyImpaired] = useState(false);
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [filter, setFilter] = useState<'전체' | '출판도서' | '등록도서'>('전체');
  const [books, setBooks] = useState<Book[]>(dummyBooks);
  const [searchText, setSearchText] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('다운로드 순');
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    const userIsVisuallyImpaired = false; // 실제 유저 정보에서 가져오는 로직을 구현
    setIsUserVisuallyImpaired(userIsVisuallyImpaired);
    setIsAccessibilityMode(userIsVisuallyImpaired); // 시각장애인이라면 접근성 모드를 기본으로 설정

    // 중복되지 않는 카테고리 추출
    const uniqueCategories = Array.from(new Set(dummyBooks.map((book) => book.category)));
    setCategories(uniqueCategories);
  }, []);

  useEffect(() => {
    applyFilterAndSearch(filter, searchText, selectedFilter);
  }, [filter, searchText, selectedFilter]);

  const handleModeToggle = () => {
    setIsAccessibilityMode((prev) => !prev);
  };

  const toggleSidebar = () => {
    setIsSidebarVisible((prev) => !prev);
  };

  const applyFilterAndSearch = (filterType: '전체' | '출판도서' | '등록도서', searchText: string, selectedFilter: string) => {
    let filteredBooks = [...dummyBooks];
    // 필터링 (출판도서/등록도서)
    if (filterType !== '전체') {
      filteredBooks = filteredBooks.filter((book) => book.type === filterType);
    }
    // 검색어 필터링
    if (searchText) {
      filteredBooks = filteredBooks.filter(
        (book) =>
          book.title.includes(searchText) ||
          book.author.includes(searchText) ||
          book.publisher.includes(searchText)
      );
    }

    // 정렬 필터 적용
    if (selectedFilter === '다운로드 순') {
      filteredBooks.sort((a, b) => new Date(b.downloadDate).getTime() - new Date(a.downloadDate).getTime());
    } else if (selectedFilter === '사전 순') {
      filteredBooks.sort((a, b) => a.title.localeCompare(b.title));
    } else if (categories.includes(selectedFilter)) {
      filteredBooks = filteredBooks.filter((book) => book.category === selectedFilter);
    }

    setBooks(filteredBooks);
  };

  const handleTabClick = (selectedTab: '전체' | '출판도서' | '등록도서') => {
    setFilter(selectedTab);
  };

  const handleSearch = (text: string) => {
    setSearchText(text);
  };

  const handleFilterSelect = (filter: string) => {
    setSelectedFilter(filter);
    setIsSidebarVisible(false); // 사이드바를 닫습니다.
  };

  return (
    <View style={styles.container}>
      <MainHeader
        title="내 서재"
        isAccessibilityMode={isAccessibilityMode}
        isUserVisuallyImpaired={isUserVisuallyImpaired}
        onModeToggle={handleModeToggle}
      />
      <FlatList
        data={[]}
        keyExtractor={() => 'dummy'} // 더미 키 설정
        ListHeaderComponent={
          <View style={styles.contentContainer}>
            <Tab onMenuPress={toggleSidebar} onTabClick={handleTabClick} onSearch={handleSearch} />
            {isAccessibilityMode ? (
              <AccessibilityBookList books={books.filter((book) => book.type === '등록도서')} />
            ) : (
              <>
                <CurrentReadingStatus />
                <GeneralBookList books={books} />
              </>
            )}
          </View>
        }
      />
      {isSidebarVisible && (
        <Sidebar
          onClose={toggleSidebar}
          onFilterSelect={handleFilterSelect}
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
  contentContainer: {
    flex: 1,
    paddingBottom: 100,
  },
  innerContainer: {
    flex: 1,
    paddingHorizontal: 4,
    paddingTop: 4,
  },
});

export default LibraryPage;
