// src/pages/MyPage/MyLikedBooksPage.tsx
// 미구현기능 : api 연동(좋아요 취소, 상세페이지 라우팅)

import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Dimensions, AccessibilityInfo } from 'react-native';
import MyPageHeader from '../../components/MyPage/MyPageHeader';
import MainFooter from '../../components/MainFooter';
import MyLikedBooksTab from '../../components/MyPage/MyLikedBooksTab';
import AccessibilityMyLikedBooksList from '../../components/MyPage/AccessibilityMyLikedBooksList';
import GeneralMyLikedBooksList from '../../components/MyPage/GeneralMyLikedBooksList';
import { myLikedBooks } from '../../data/dummyBooks';

const { width, height } = Dimensions.get('window');

const MyLikedBooksPage: React.FC = () => {
  const [isAccessibilityMode, setIsAccessibilityMode] = useState(false);
  const [isUserVisuallyImpaired, setIsUserVisuallyImpaired] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredBooks, setFilteredBooks] = useState<any[]>(myLikedBooks.bookList); // 초기 상태를 bookList로 설정

  useEffect(() => {
    // 실제 유저 정보에서 시각장애인 여부를 가져오는 로직 구현 (여기서는 false로 가정)
    const userIsVisuallyImpaired = false;
    setIsUserVisuallyImpaired(userIsVisuallyImpaired);
    setIsAccessibilityMode(userIsVisuallyImpaired); // 시각장애인이라면 접근성 모드를 기본으로 설정
  }, []);

  useEffect(() => {
    // 검색어에 따라 도서 목록 필터링
    let filtered = myLikedBooks.bookList;
    if (searchQuery) {
      filtered = filtered.filter(
        (book) =>
          book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          book.author.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    setFilteredBooks(filtered);
    AccessibilityInfo.announceForAccessibility(`검색 결과: ${filtered.length}개의 도서가 검색되었습니다.`);
  }, [searchQuery]);

  const handleModeToggle = () => {
    setIsAccessibilityMode((prev) => !prev);
    AccessibilityInfo.announceForAccessibility(
      `접근성 모드가 ${!isAccessibilityMode ? '활성화' : '비활성화'}되었습니다.`
    );
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <View style={styles.container}>
      <MyPageHeader
        title="좋아요한 도서"
        isUserVisuallyImpaired={isUserVisuallyImpaired}
        onModeToggle={handleModeToggle}
        accessibilityLabel="좋아요한 도서 페이지 헤더"
      />
      <MyLikedBooksTab onSearch={handleSearch} />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        accessibilityLabel="좋아요한 도서 목록"
        accessibilityHint="좋아요한 도서들을 스크롤하여 확인하세요"
      >
        <View style={styles.innerContainer}>
          {isAccessibilityMode ? (
            <AccessibilityMyLikedBooksList books={filteredBooks} searchQuery={searchQuery} />
          ) : (
            <GeneralMyLikedBooksList books={filteredBooks} searchQuery={searchQuery} />
          )}
        </View>
      </ScrollView>
      <MainFooter accessibilityLabel="메인 페이지로 돌아가기 버튼이 있는 하단 메뉴" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: height * 0.1,
  },
  innerContainer: {
    flex: 1,
    paddingHorizontal: width * 0.03,
  },
});

export default MyLikedBooksPage;
