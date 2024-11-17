import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
  Alert,
} from 'react-native';
import MainHeader from '../../components/MainHeader';
import MainFooter from '../../components/MainFooter';
import AccessibilityBookList from '../../components/Search/AccessibilityBookList';
import GeneralBookList from '../../components/Search/GeneralBookList';
import { searchBooks } from '../../services/SearchPage/SearchBook'; // API 호출 함수

const { width, height } = Dimensions.get('window');

const SearchPage: React.FC = () => {
  const [isAccessibilityMode, setIsAccessibilityMode] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [bookList, setBookList] = useState([]); // 검색 결과 리스트 상태
  const [lastSearchId, setLastSearchId] = useState<string | null>(null); // 추가 검색 위한 마지막 검색 ID
  const [hasSearched, setHasSearched] = useState(false);
  const [isAscending, setIsAscending] = useState(true); // 정렬 방향 상태 추가
  const [isFetchingMore, setIsFetchingMore] = useState(false); // 추가 검색 로딩 상태
  const scrollViewRef = useRef<ScrollView>(null); // 스크롤뷰 참조 설정
  const [scrollPosition, setScrollPosition] = useState(0); // 스크롤 위치 저장

  const handleModeToggle = () => {
    setIsAccessibilityMode((prev) => !prev);
  };

  const handleSearch = async () => {
    if (searchKeyword.trim() === '') {
      setBookList([]);
      setLastSearchId(null);
      setHasSearched(false);
      return;
    }

    try {
      const response = await searchBooks({
        keyword: searchKeyword,
        pageSize: 10,
        sortBy: isAccessibilityMode ? 'title' : 'published_date',
        sortOrder: isAscending ? 'asc' : 'desc',
      });
      setBookList(response.bookList);
      setLastSearchId(response.lastSearchId); // 마지막 검색 ID 설정
      setHasSearched(true);
    } catch (error) {
      Alert.alert('검색 실패', '검색 중 오류가 발생했습니다.');
      setBookList([]);
    }
  };

  const handleFetchMore = async () => {
    if (isFetchingMore || !lastSearchId) return; // 이미 로딩 중이거나 추가 데이터 없으면 종료
    setIsFetchingMore(true);

    try {
      const response = await searchBooks({
        keyword: searchKeyword,
        lastSearchId, // 마지막 검색 ID를 사용
        pageSize: 10,
        sortBy: isAccessibilityMode ? 'title' : 'published_date',
        sortOrder: isAscending ? 'asc' : 'desc',
      });

      setBookList((prevBooks) => [...prevBooks, ...response.bookList]); // 기존 리스트에 새 데이터 추가
      setLastSearchId(response.lastSearchId); // 새로운 lastSearchId로 업데이트
    } catch (error) {
      Alert.alert('오류', '추가 검색 중 문제가 발생했습니다.');
    } finally {
      setIsFetchingMore(false);
    }
  };

  const handleReset = () => {
    setSearchKeyword('');
    setBookList([]);
    setLastSearchId(null);
    setHasSearched(false);
  };

  const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }: any) => {
    return layoutMeasurement.height + contentOffset.y >= contentSize.height - 20;
  };

  return (
    <View style={styles.container}>
      <MainHeader
        title="도서검색"
        isAccessibilityMode={isAccessibilityMode}
        onModeToggle={handleModeToggle}
      />
      <View style={styles.searchContainer}>
        <TouchableOpacity style={styles.searchIcon} onPress={handleSearch}>
          <Image source={require('../../assets/icons/search2.png')} style={styles.iconImage} />
        </TouchableOpacity>
        <TextInput
          style={styles.searchInput}
          placeholder="제목, 저자, 출판사 검색"
          value={searchKeyword}
          onChangeText={setSearchKeyword}
        />
        {searchKeyword.length > 0 && (
          <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
            <Text style={styles.resetButtonText}>초기화</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Text style={styles.searchButtonText}>검색</Text>
        </TouchableOpacity>
      </View>
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={styles.scrollContent}
        onScroll={({ nativeEvent }) => {
          setScrollPosition(nativeEvent.contentOffset.y); // 스크롤 위치 저장
          if (isCloseToBottom(nativeEvent)) {
            handleFetchMore();
          }
        }}
        scrollEventThrottle={16}
        onContentSizeChange={() => {
          if (isFetchingMore) {
            scrollViewRef.current?.scrollTo({ y: scrollPosition, animated: false });
          }
        }}
      >
        <View style={styles.innerContainer}>
          {hasSearched && (
            isAccessibilityMode ? (
              <AccessibilityBookList bookList={bookList} />
            ) : (
              <GeneralBookList bookList={bookList} />
            )
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: width * 0.025,
    backgroundColor: '#8E9DCC',
    height: height * 0.1,
  },
  searchIcon: {
    marginRight: width * 0.025,
  },
  iconImage: {
    width: width * 0.08,
    height: width * 0.08,
  },
  searchInput: {
    flex: 1,
    height: height * 0.06,
    borderColor: '#CCCCCC',
    borderWidth: 1,
    paddingHorizontal: width * 0.025,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    fontSize: width * 0.045,
    fontWeight: 'bold',
  },
  searchButton: {
    marginLeft: width * 0.025,
    paddingVertical: height * 0.015,
    paddingHorizontal: width * 0.04,
    backgroundColor: '#3943B7',
    borderRadius: 8,
  },
  searchButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: width * 0.04,
  },
  resetButton: {
    marginLeft: width * 0.025,
    paddingVertical: height * 0.015,
    paddingHorizontal: width * 0.04,
    backgroundColor: '#FF6347',
    borderRadius: 8,
  },
  resetButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: width * 0.04,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: height * 0.125,
  },
  innerContainer: {
    flex: 1,
  },
});

export default SearchPage;
