import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Dimensions, AccessibilityInfo, Alert, Text } from 'react-native';
import MyPageHeader from '../../components/MyPage/MyPageHeader';
import MainFooter from '../../components/MainFooter';
import MyLikedBooksTab from '../../components/MyPage/MyLikedBooksTab';
import AccessibilityMyLikedBooksList from '../../components/MyPage/AccessibilityMyLikedBooksList';
import GeneralMyLikedBooksList from '../../components/MyPage/GeneralMyLikedBooksList';
import { getLikedBooks } from '../../services/Mypage/MyLikedBooks'; // 실제 API 함수 임포트
import { getAccessibilityMode, toggleAccessibilityMode } from '../../utils/accessibilityMode'; // 접근성 모드 함수

const { width, height } = Dimensions.get('window');

const MyLikedBooksPage: React.FC = () => {
  const [isAccessibilityMode, setIsAccessibilityMode] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [likedBooks, setLikedBooks] = useState<any[]>([]); // 좋아요한 도서 목록 상태
  const [filteredBooks, setFilteredBooks] = useState<any[]>([]); // 필터링된 도서 목록
  const [loading, setLoading] = useState<boolean>(true); // 로딩 상태
  const [lastDateTime, setLastDateTime] = useState<string | null>(null); // 페이지네이션을 위한 마지막 DateTime
  const [lastId, setLastId] = useState<number | null>(null); // 페이지네이션을 위한 마지막 Book ID

  useEffect(() => {
    const fetchAccessibilityMode = async () => {
      const mode = await getAccessibilityMode(); // 로컬에서 접근성 모드 가져오기
      setIsAccessibilityMode(mode);
    };

    fetchAccessibilityMode(); // 초기 접근성 모드 설정
    fetchLikedBooks(); // 첫 로드 시 좋아요한 도서 목록 가져오기
  }, []);

  const fetchLikedBooks = async (isLoadMore = false) => {
    setLoading(true);
    try {
      const params = isLoadMore ? { lastDateTime, lastId, pageSize: 10 } : { pageSize: 10 };
      const response = await getLikedBooks(params);
      
      setLikedBooks((prev) => (isLoadMore ? [...prev, ...response.bookList] : response.bookList));
      setFilteredBooks((prev) => (isLoadMore ? [...prev, ...response.bookList] : response.bookList));
      setLastDateTime(response.lastDateTime);
      setLastId(response.lastId);
    } catch (error: any) {
      Alert.alert('에러', error.message || '데이터를 불러오는 중 문제가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // 검색어에 따라 도서 목록 필터링
    let filtered = likedBooks;
    if (searchQuery) {
      filtered = filtered.filter(
        (book) =>
          book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          book.author.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredBooks(filtered);
    AccessibilityInfo.announceForAccessibility(`검색 결과: ${filtered.length}개의 도서가 검색되었습니다.`);
  }, [searchQuery, likedBooks]);

  const handleModeToggle = async () => {
    const newMode = await toggleAccessibilityMode(); // 접근성 모드 토글
    setIsAccessibilityMode(newMode);
    AccessibilityInfo.announceForAccessibility(
      `접근성 모드가 ${newMode ? '활성화' : '비활성화'}되었습니다.`
    );
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <View style={styles.container}>
      <MyPageHeader
        title="좋아요한 도서"
        onModeToggle={handleModeToggle}
        accessibilityLabel="좋아요한 도서 페이지 헤더"
      />
      <MyLikedBooksTab onSearch={handleSearch} />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        accessibilityLabel="좋아요한 도서 목록"
        accessibilityHint="좋아요한 도서들을 스크롤하여 확인하세요"
        onScroll={({ nativeEvent }) => {
          if (
            nativeEvent.contentOffset.y + nativeEvent.layoutMeasurement.height >=
            nativeEvent.contentSize.height - 20 &&
            !loading &&
            lastDateTime &&
            lastId
          ) {
            fetchLikedBooks(true); // 페이지네이션을 위한 추가 데이터 로드
          }
        }}
      >
        <View style={styles.innerContainer}>
          {loading ? (
            <Text>로딩 중...</Text>
          ) : filteredBooks.length === 0 ? (
            <Text>검색 결과가 없습니다.</Text>
          ) : isAccessibilityMode ? (
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
