import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Alert,
} from 'react-native';
import MainHeader from '../../components/MainHeader';
import MainFooter from '../../components/MainFooter';
import AccessibilityBookList from '../../components/Search/AccessibilityBookList';
import GeneralBookList from '../../components/Search/GeneralBookList';
import { searchBooks } from '../../services/SearchPage/SearchBook';
import { getAccessibilityMode } from '../../utils/accessibilityMode';
import { useFocusEffect } from '@react-navigation/native'; // 페이지 포커스 감지

const { width, height } = Dimensions.get('window');

const SearchPage: React.FC = () => {
  const [isAccessibilityMode, setIsAccessibilityMode] = useState<boolean>(false); // 접근성 모드 상태
  const [searchKeyword, setSearchKeyword] = useState('');
  const [isSortBy, setIsSortBy] = useState<'published_date' | 'title' | null>(null);
  const [isSortOrder, setIsSortOrder] = useState<'asc' | 'desc'>('desc');
  const [bookList, setBookList] = useState<any[]>([]); // 검색 결과 리스트 상태
  const [lastSearchId, setLastSearchId] = useState<string | null>(null); // 추가 검색 위한 마지막 검색 ID
  const [hasSearched, setHasSearched] = useState(false);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null); // 스크롤뷰 참조 설정

  // 페이지가 포커스될 때마다 접근성 모드 상태를 최신화
  useFocusEffect(
    useCallback(() => {
      const fetchAccessibilityMode = async () => {
        const mode = await getAccessibilityMode();
        setIsAccessibilityMode(mode);
      };
      fetchAccessibilityMode();
    }, [])
  );

  const handleSearch = async (
      sortBy: 'published_date' | 'title' | null = isSortBy,
      sortOrder: 'asc' | 'desc' = isSortOrder
  ) => {
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
        sortBy,       // 현재 정렬 기준
        sortOrder, // 현재 정렬 방향
      });
      setBookList(response.bookList);
      setLastSearchId(response.lastSearchId);
      setHasSearched(true);
      scrollViewRef.current?.scrollTo({ y: 0, animated: true }); // 스크롤 초기화
    } catch (error) {
      Alert.alert('검색 실패', '검색 중 오류가 발생했습니다.');
      setBookList([]);
    }
  };

  const handleFetchMore = async () => {
    if (isFetchingMore || !lastSearchId) return;
    setIsFetchingMore(true);

    try {
      const response = await searchBooks({
        keyword: searchKeyword,
        lastSearchId,
        pageSize: 10,
        sortBy: isAccessibilityMode ? 'title' : 'published_date',
      });

      setBookList((prevBooks) => [...prevBooks, ...response.bookList]);
      setLastSearchId(response.lastSearchId);
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

  return (
    <View style={styles.container}>
      <MainHeader title="도서검색" />
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="제목, 저자, 출판사 검색"
          value={searchKeyword}
          onChangeText={setSearchKeyword}
        />
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Text style={styles.searchButtonText}>검색</Text>
        </TouchableOpacity>
        {searchKeyword.length > 0 && (
          <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
            <Text style={styles.resetButtonText}>초기화</Text>
          </TouchableOpacity>
        )}
      </View>
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={styles.scrollContent}
        onScroll={({ nativeEvent }) => {
          if (nativeEvent.layoutMeasurement.height + nativeEvent.contentOffset.y >= nativeEvent.contentSize.height - 20) {
            handleFetchMore();
          }
        }}
        scrollEventThrottle={16}
      >
        <View style={styles.innerContainer}>
          {hasSearched && bookList.length === 0 ? (
            <Text style={styles.noResultsText}>검색 결과가 없습니다.</Text>
          ) : hasSearched ? (
            isAccessibilityMode ? (
              <AccessibilityBookList bookList={bookList} />
            ) : (
              <GeneralBookList bookList={bookList} />
            )
          ) : null}
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
    padding: width * 0.025,
    backgroundColor: '#8E9DCC',
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    borderColor: '#CCCCCC',
    borderWidth: 1,
    paddingHorizontal: width * 0.025,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    fontSize: width * 0.045,
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
  noResultsText: {
    textAlign: 'center',
    fontSize: width * 0.05,
    color: 'gray',
    marginTop: height * 0.05,
  },
});

export default SearchPage;
