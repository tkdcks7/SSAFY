import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, ScrollView, AccessibilityInfo, Dimensions } from 'react-native';
import MyPageHeader from '../../components/MyPage/MyPageHeader';
import MainFooter from '../../components/MainFooter';
import { handleScrollEndAnnouncement } from '../../utils/announceScrollEnd';
import MyBooksTab from '../../components/MyPage/MyBooksTab';
import AccessibilityMyBooksList from '../../components/MyPage/AccessibilityMyBooksList';
import GeneralMyBooksList from '../../components/MyPage/GeneralMyBooksList';
import { getMyBooks } from '../../services/Mypage/MyBooks';
import { getAccessibilityMode, toggleAccessibilityMode } from '../../utils/accessibilityMode'; // 접근성 모드 함수

const { width, height } = Dimensions.get('window');

const MyBooksPage: React.FC = () => {
  const [isAccessibilityMode, setIsAccessibilityMode] = useState<boolean>(false); // 접근성 모드
  const [selectedTab, setSelectedTab] = useState<'출판도서' | '등록도서'>('출판도서');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredBooks, setFilteredBooks] = useState<any[]>([]);
  const [allBooks, setAllBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchAccessibilityMode = async () => {
      const mode = await getAccessibilityMode(); // 접근성 모드 상태 가져오기
      setIsAccessibilityMode(mode);
    };

    fetchAccessibilityMode(); // 초기 접근성 모드 설정
  }, []);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const books = await getMyBooks();
        setAllBooks(books);
      } catch (error: any) {
        console.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  useEffect(() => {
    let filtered = allBooks.filter((book) =>
      selectedTab === '출판도서' ? book.dtype === 'PUBLISHED' : book.dtype === 'REGISTERED'
    );

    if (searchQuery) {
      const lowerCaseQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (book) =>
          book.title.toLowerCase().includes(lowerCaseQuery) ||
          book.author.toLowerCase().includes(lowerCaseQuery)
      );
    }

    setFilteredBooks(filtered);
  }, [selectedTab, searchQuery, allBooks]);

  const handleModeToggle = async () => {
    const newMode = await toggleAccessibilityMode(); // 접근성 모드 토글
    setIsAccessibilityMode(newMode);
    AccessibilityInfo.announceForAccessibility(
      newMode ? '접근성 모드로 전환되었습니다.' : '일반 모드로 전환되었습니다.'
    );
  };

  const handleTabChange = (tab: '출판도서' | '등록도서') => {
    setSelectedTab(tab);
    AccessibilityInfo.announceForAccessibility(`${tab} 탭이 선택되었습니다.`);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <View style={styles.container}>
      <MyPageHeader
        title="담은 도서"
        onModeToggle={handleModeToggle} // 접근성 모드 토글 핸들러
      />
      <MyBooksTab onTabClick={handleTabChange} onSearch={handleSearch} />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        onScroll={handleScrollEndAnnouncement}
        scrollEventThrottle={16}
      >
        <View style={styles.innerContainer}>
          {loading ? (
            <Text>로딩 중...</Text>
          ) : isAccessibilityMode ? (
            <AccessibilityMyBooksList books={filteredBooks} searchQuery={searchQuery} />
          ) : (
            <GeneralMyBooksList books={filteredBooks} searchQuery={searchQuery} />
          )}
        </View>
      </ScrollView>
      <MainFooter />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: height * 0.05,
  },
  innerContainer: {
    flex: 1,
    paddingHorizontal: width * 0.02,
  },
});

export default MyBooksPage;
