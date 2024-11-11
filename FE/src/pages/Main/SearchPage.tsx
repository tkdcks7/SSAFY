// src/pages/Main/SearchPage.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Image, Dimensions } from 'react-native';
import MainHeader from '../../components/MainHeader';
import MainFooter from '../../components/MainFooter';
import AccessibilityBookList from '../../components/Search/AccessibilityBookList';
import GeneralBookList from '../../components/Search/GeneralBookList';
import { handleScrollEndAnnouncement } from '../../utils/announceScrollEnd';
import { dummySearchBookList } from '../../data/dummySearchBookList'; // 임포트 추가

const { width, height } = Dimensions.get('window');

const SearchPage: React.FC = () => {
  const [isAccessibilityMode, setIsAccessibilityMode] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [bookList, setBookList] = useState([]); // 검색 결과 리스트 상태
  const [hasSearched, setHasSearched] = useState(false);

  const handleModeToggle = () => {
    setIsAccessibilityMode((prev) => !prev);
  };

  const handleSearch = () => {
    if (searchKeyword.trim() === '') {
      setBookList([]);
      setHasSearched(false);
      return;
    }

    // keyword가 dummySearchBookList의 키워드와 일치하는지 체크
    if (dummySearchBookList.keyword && dummySearchBookList.keyword.includes(searchKeyword)) {
      setBookList(dummySearchBookList.bookList);
    } else {
      // 검색 로직: dummySearchBookList에서 검색 키워드와 일치하는 도서를 필터링
      const filteredBooks = dummySearchBookList.bookList.filter((book) =>
        book.title.includes(searchKeyword) ||
        book.author.includes(searchKeyword) ||
        book.publisher.includes(searchKeyword)
      );

      setBookList(filteredBooks);
    }
    setHasSearched(true);
  };

  const handleReset = () => {
    setSearchKeyword('');
    setBookList([]);
    setHasSearched(false);
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
        contentContainerStyle={styles.scrollContent}
        onScroll={handleScrollEndAnnouncement}
        scrollEventThrottle={16}
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
