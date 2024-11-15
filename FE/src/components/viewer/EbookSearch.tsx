// src/components/viewer/EbookSearch.tsx
import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions, ScrollView, TextInput } from 'react-native';
import InputBox from '../../components/InputBox';
import {useReader} from '@epubjs-react-native/core';


// 아이콘
import leftarrowicon from '../../assets/icons/leftarrow.png';
import searchicon from '../../assets/icons/search.png';

import EbookSearchResult from './EbookSearchResult';

const {width, height} = Dimensions.get('window');

type EbookSearchProps = {
  onClose: () => void;
  onLocationSelect: (cfi: string) => void;
  searchInput: string;
  setSearchInput: (input: string) => void;
};

// const exampleSearchResult: SearchResultType[] = [
//   { sentence:'예시문장 1', progress: 0.15 },
//   { sentence:'예시문장 2', progress: 0.25 },
//   { sentence:'예시문장 3', progress: 0.37 },
// ]

const RESULTS_PER_PAGE = 20;

const EbookSearch: React.FC<EbookSearchProps> = ({
  onClose,
  onLocationSelect,
  searchInput,
  setSearchInput,
}) => {
  const searchInputRef = useRef<TextInput>(null);
  const {search, searchResults, clearSearchResults, isSearching} = useReader();
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(searchResults.totalResults / RESULTS_PER_PAGE);

  useEffect(() => {
    if (searchInput.length > 2) {
      executeSearch();
    }
  }, [searchInput, page]);

  const handleSearchTextChange = (input: string) => {
    setSearchInput(input);
  };

  const executeSearch = () => {
    clearSearchResults();
    search(searchInput, page, RESULTS_PER_PAGE); // 페이지와 한정된 결과 수로 검색
  };

  const focusSearchInput = () => {
    if (!searchInput) {
      searchInputRef.current?.focus();
    } else {
      searchInputRef.current?.blur();
    }
  };

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.navBar}>
        <TouchableOpacity onPress={onClose}>
          <Image source={leftarrowicon} style={styles.icon} />
        </TouchableOpacity>
        <InputBox
          value={searchInput}
          onChangeText={handleSearchTextChange}
          placeholder="검색어를 입력하세요"
          ref={searchInputRef}
          style={styles.inputBox}
        />
        <TouchableOpacity onPress={focusSearchInput}>
          <Image source={searchicon} style={styles.icon} />
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.resultsContainer}>
        {isSearching ? (
          <Text style={styles.loadingText}>검색 중...</Text>
        ) : (
          <>
            <Text style={styles.resultCount}>
              검색결과 {searchResults.totalResults}건
            </Text>
            {searchResults.results.length === 0 && !isSearching && (
              <Text style={styles.noResultsText}>검색 결과가 없습니다.</Text>
            )}
            {searchResults.results.map((result, index) => (
              <EbookSearchResult
                key={index}
                result={result}
                searchTerm={searchInput}
                onLocationSelect={onLocationSelect}
                onClose={onClose}
              />
            ))}
            <View style={styles.paginationContainer}>
              {page > 1 && (
                <TouchableOpacity
                  onPress={handlePreviousPage}
                  style={styles.paginationButton}>
                  <Text style={styles.paginationText}>이전 결과 보기</Text>
                </TouchableOpacity>
              )}
              {page < totalPages && (
                <TouchableOpacity
                  onPress={handleNextPage}
                  style={styles.paginationButton}>
                  <Text style={styles.paginationText}>다음 결과 보기</Text>
                </TouchableOpacity>
              )}
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
    navBar: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: height * 0.1, // 상대적인 높이 (화면 높이의 10%)
      backgroundColor: '#3943B7',
      justifyContent: 'space-between',
      alignItems: 'center',
      zIndex: 12,
      flexDirection: 'row',
      paddingHorizontal: width * 0.03,
    },
    icon: {
      width: width * 0.1, // 화면 너비의 10%
      height: width * 0.1, // 화면 너비의 10% (정사각형)
      tintColor: 'white',
    },
  });

export default EbookSearch;
