// src/pages/MyBooksPage.tsx
// 미구현기능 : api 연동, 다운로드(백엔드 요청 + 메타데이터 추출 & 로컬 데이터베이스에 저장)
// 다운로드 조회(로컬 데이터베이스), 상세보기 라우팅

import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, ScrollView, AccessibilityInfo, Dimensions } from 'react-native';
import MyPageHeader from '../../components/MyPage/MyPageHeader';
import MainFooter from '../../components/MainFooter';
import { handleScrollEndAnnouncement } from '../../utils/announceScrollEnd';
import MyBooksTab from '../../components/MyPage/MyBooksTab';
import AccessibilityMyBooksList from '../../components/MyPage/AccessibilityMyBooksList';
import GeneralMyBooksList from '../../components/MyPage/GeneralMyBooksList';
import { myBooks } from '../../data/dummyBooks';

const { width, height } = Dimensions.get('window');

const MyBooksPage: React.FC = () => {
  const [isAccessibilityMode, setIsAccessibilityMode] = useState(false);
  const [isUserVisuallyImpaired, setIsUserVisuallyImpaired] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'출판도서' | '등록도서'>('출판도서');
  const [searchQuery, setSearchQuery] = useState(''); // 검색어 상태 추가
  const [filteredBooks, setFilteredBooks] = useState<any[]>([]);

  useEffect(() => {
    // 실제 유저 정보에서 가져오는 로직을 구현
    const userIsVisuallyImpaired = false;
    setIsUserVisuallyImpaired(userIsVisuallyImpaired);
    setIsAccessibilityMode(userIsVisuallyImpaired); // 시각장애인이라면 접근성 모드를 기본으로 설정
    if (userIsVisuallyImpaired) {
      AccessibilityInfo.announceForAccessibility('접근성 모드가 활성화되었습니다. 화면 요소들이 더 쉽게 접근 가능합니다.');
    }
  }, []);

  // 로컬 데이터베이스에서 다운로드 여부 확인 (더미 데이터로 대체)
  const booksWithDownloadStatus = myBooks.map((book) => ({
    ...book,
    isDownloaded: Math.random() > 0.5, // 랜덤으로 다운로드 여부 지정 (더미)
  }));

  useEffect(() => {
    // 탭에 따라 도서 필터링
    let filtered = booksWithDownloadStatus.filter((book) =>
      selectedTab === '출판도서' ? book.dtype === 'PUBLISHED' : book.dtype === 'REGISTERED'
    );

    // 검색어에 따른 도서 필터링
    if (searchQuery) {
      filtered = filtered.filter(
        (book) =>
          book.title.includes(searchQuery) || book.author.includes(searchQuery)
      );
    }

    setFilteredBooks(filtered);
  }, [selectedTab, searchQuery]);

  const handleModeToggle = () => {
    setIsAccessibilityMode((prev) => !prev);
    AccessibilityInfo.announceForAccessibility(
      isAccessibilityMode ? '일반 모드로 전환되었습니다.' : '접근성 모드로 전환되었습니다.'
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
        isUserVisuallyImpaired={isUserVisuallyImpaired}
        onModeToggle={handleModeToggle}
      />
      <MyBooksTab onTabClick={handleTabChange} onSearch={handleSearch} />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        onScroll={handleScrollEndAnnouncement}
        scrollEventThrottle={16} // 스크롤 이벤트 빈도 조절
      >
        <View style={styles.innerContainer}>
          {isAccessibilityMode ? (
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
    marginBottom: height * 0.05,
  },
  innerContainer: {
    flex: 1,
    paddingHorizontal: width * 0.02,
    marginBottom: height * 0.05,
  },
});

export default MyBooksPage;
