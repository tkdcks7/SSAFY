// src/components/MyPage/MyLikedBooksTab.tsx
import React, { useState } from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity, Text, Dimensions, AccessibilityInfo, Image } from 'react-native';
import SearchIcon from '../../assets/icons/search.png';

const { width, height } = Dimensions.get('window');

interface MyLikedBooksTabProps {
  onSearch: (searchText: string) => void;
}

const MyLikedBooksTab: React.FC<MyLikedBooksTabProps> = ({ onSearch }) => {
  const [searchText, setSearchText] = useState('');

  const handleSearchChange = (text: string) => {
    setSearchText(text);
    onSearch(text);
    AccessibilityInfo.announceForAccessibility(`검색어 입력: ${text}`);
  };

  const handleClearSearch = () => {
    setSearchText('');
    onSearch('');
    AccessibilityInfo.announceForAccessibility('검색어가 초기화되었습니다.');
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Image source={SearchIcon} style={styles.icon} accessibilityLabel="검색 아이콘" />
        <TextInput
          placeholder="책 제목으로 검색"
          style={styles.searchInput}
          placeholderTextColor="#888"
          value={searchText}
          onChangeText={handleSearchChange}
          accessibilityLabel="검색 입력란"
          accessibilityHint="책 제목을 입력하여 좋아요한 도서를 검색하세요"
          accessibilityRole="search"
        />
        {searchText.length > 0 && (
          <TouchableOpacity
            style={styles.clearButton}
            onPress={handleClearSearch}
            accessibilityLabel="검색 초기화 버튼"
            accessibilityHint="검색어를 초기화합니다"
          >
            <Text style={styles.clearButtonText}>초기화</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: width * 0.02,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: height * 0.01,
  },
  searchInput: {
    flex: 1,
    height: height * 0.07,
    borderColor: '#ccc',
    borderWidth: 1,
    padding: height * 0.015,
    marginHorizontal: width * 0.03,
    fontSize: width * 0.045,
    borderRadius: 8,
  },
  icon: {
    width: width * 0.08,
    height: width * 0.08,
  },
  clearButton: {
    marginLeft: width * 0.02,
    backgroundColor: '#3943B7',
    paddingVertical: height * 0.015,
    paddingHorizontal: width * 0.04,
    borderRadius: 8,
  },
  clearButtonText: {
    color: '#fff',
    fontSize: width * 0.04,
    fontWeight: 'bold',
  },
});

export default MyLikedBooksTab;