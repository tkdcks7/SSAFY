import React, { useState, useCallback, useRef } from 'react';
import {
  ActivityIndicator,
  View,
  StyleSheet,
  FlatList,
  TextInput,
  Modal,
  Text,
  TouchableOpacity,
} from 'react-native';
import { SearchResult as SearchResultType, useReader } from '@epubjs-react-native/core';
import SearchResult from './SearchResult';

interface Props {
  onClose: () => void;
  visible: boolean;
}

export const SearchList = ({ onClose, visible }: Props) => {
  const {
    searchResults,
    goToLocation,
    search,
    clearSearchResults,
    isSearching,
    addAnnotation,
    removeAnnotationByCfi,
    theme,
  } = useReader();

  const [searchTerm, setSearchTerm] = useState('');
  const [data, setData] = useState<SearchResultType[]>(searchResults.results);
  const [page, setPage] = useState(1);

  const renderItem = useCallback(
    ({ item }: { item: SearchResultType }) => (
      <SearchResult
        searchTerm={searchTerm}
        searchResult={item}
        onPress={(searchResult) => {
          goToLocation(searchResult.cfi);
          addAnnotation('highlight', searchResult.cfi);
          setTimeout(() => {
            removeAnnotationByCfi(searchResult.cfi);
          }, 3000);
          clearSearchResults();
          setPage(1);
          setData([]);
          onClose();
        }}
      />
    ),
    [addAnnotation, clearSearchResults, goToLocation, onClose, removeAnnotationByCfi, searchTerm]
  );

  const header = useCallback(
    () => (
      <View style={styles.title}>
        <Text style={{ color: theme.body.background }}>Search Results</Text>
        <TextInput
          style={styles.input}
          placeholder="Type a term here..."
          onChangeText={(text) => setSearchTerm(text)}
          onSubmitEditing={() => {
            clearSearchResults();
            setData([]);
            setPage(1);
            search(searchTerm, 1, 20);
          }}
        />
        {isSearching && <Text >Searching results...</Text>}
      </View>
    ),
    [clearSearchResults, isSearching, search, searchTerm, theme.body.background]
  );

  const footer = useCallback(
    () => (
      <View style={styles.title}>
        {isSearching ? (
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <ActivityIndicator animating />
            <Text style={{ marginLeft: 5 }}>Fetching results...</Text>
          </View>
        ) : data.length > 0 && data.length === searchResults.totalResults ? (
          <Text >No more results at the moment...</Text>
        ) : null}
      </View>
    ),
    [data.length, isSearching, searchResults.totalResults]
  );

  const empty = useCallback(
    () => (
      <View style={styles.title}>
        <Text >No results...</Text>
      </View>
    ),
    []
  );

  const fetchMoreData = useCallback(() => {
    if (searchResults.results.length > 0 && !isSearching) {
      search(searchTerm, page + 1, 20);
      setPage(page + 1);
    }
  }, [isSearching, page, search, searchResults.results.length, searchTerm]);

  React.useEffect(() => {
    if (searchResults.results.length > 0) {
      setData((oldState) => [...oldState, ...searchResults.results]);
    }
  }, [searchResults]);

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.container}>
        <FlatList
          data={data}
          keyExtractor={(item, index) => item.cfi.concat(index.toString())}
          renderItem={renderItem}
          ListHeaderComponent={header}
          ListFooterComponent={footer}
          ListEmptyComponent={empty}
          onEndReached={fetchMoreData}
          onEndReachedThreshold={0.2}
        />
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={{ color: 'white' }}>Close</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: 'white',
  },
  title: {
    width: '100%',
    marginVertical: 10,
  },
  input: {
    width: '100%',
    padding: 8,
    borderRadius: 10,
    backgroundColor: '#e0e0e0',
    fontSize: 16,
  },
  closeButton: {
    backgroundColor: 'black',
    padding: 10,
    alignItems: 'center',
  },
});
