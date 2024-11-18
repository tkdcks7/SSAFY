// src/components/viewer/EbookSearch.tsx
import React, {useState, useRef, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  ScrollView,
  TextInput,
} from 'react-native';
import InputBox from '../../components/InputBox';
import {SearchResult, SearchOptions} from '@epubjs-react-native/core';

// 아이콘
import leftarrowicon from '../../assets/icons/leftarrow.png';
import searchicon from '../../assets/icons/search.png';

import EbookSearchResult from './EbookSearchResult';

const {width, height} = Dimensions.get('window');

type SearchResults = {
  results: SearchResult[];
  totalResults: number;
};

type EbookSearchProps = {
  onClose: () => void;
  onLocationSelect: (cfi: string) => void;
  searchInput: string;
  setSearchInput: (input: string) => void;
  searchResults: SearchResults;
  isSearching: boolean;
  search: (
    term: string,
    page?: number,
    limit?: number,
    options?: SearchOptions,
  ) => void;
  clearSearchResults: () => void;
};

const RESULTS_PER_PAGE = 20;

const EbookSearch: React.FC<EbookSearchProps> = ({
  onClose,
  onLocationSelect,
  searchInput,
  setSearchInput,
  searchResults,
  isSearching,
  search,
  clearSearchResults,
}) => {
  const searchInputRef = useRef<TextInput>(null);
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(searchResults.totalResults / RESULTS_PER_PAGE);

  const executeSearch = useCallback(() => {
    clearSearchResults();
    search(searchInput, page, RESULTS_PER_PAGE);
  }, [searchInput, page, clearSearchResults, search]);

  useEffect(() => {
    if (searchInput.length > 2) {
      executeSearch();
    }
  }, [searchInput, page, executeSearch]);

  const handleSearchTextChange = (input: string) => {
    setSearchInput(input);
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
  container: {
    width: '100%',
    height: '100%',
    zIndex: 12,
    backgroundColor: '#f5f5f5',
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3943B7',
    paddingHorizontal: width * 0.03,
    height: height * 0.1,
  },
  icon: {
    width: width * 0.08,
    height: width * 0.08,
    tintColor: 'white',
  },
  inputBox: {
    flex: 1,
    height: '80%',
    marginHorizontal: width * 0.03,
    backgroundColor: 'white',
    borderRadius: 5,
    paddingHorizontal: width * 0.03,
  },
  resultsContainer: {
    marginTop: height * 0.02,
    paddingHorizontal: width * 0.03,
  },
  loadingText: {
    textAlign: 'center',
    color: '#666',
    fontSize: width * 0.08,
  },
  noResultsText: {
    textAlign: 'center',
    color: '#666',
    fontSize: width * 0.05,
    marginTop: height * 0.02,
  },
  resultCount: {
    fontSize: width * 0.04,
    fontWeight: 'bold',
    color: '#333',
    marginVertical: width * 0.02,
  },
  paginationContainer: {
    flexDirection: 'column', // 세로로 버튼 배치
  },
  paginationButton: {
    flex: 1,
    paddingVertical: height * 0.015,
    backgroundColor: '#3943B7',
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: height * 0.005, // 버튼 간의 간격을 위해 추가
  },
  paginationText: {
    color: 'white',
    fontSize: width * 0.04,
    fontWeight: 'bold',
  },
});

export default EbookSearch;
