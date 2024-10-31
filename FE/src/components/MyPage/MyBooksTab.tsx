// src/components/MyPage/MyBooksTab.tsx
import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Image, TextInput, Dimensions } from 'react-native';
import SearchIcon from '../../assets/icons/search.png';

const { width, height } = Dimensions.get('window');

interface MyBooksTabProps {
  onTabClick: (selectedTab: '출판도서' | '등록도서') => void;
  onSearch: (searchText: string) => void;
}

const MyBooksTab: React.FC<MyBooksTabProps> = ({ onTabClick, onSearch }) => {
  const [selectedTab, setSelectedTab] = useState<'출판도서' | '등록도서'>('출판도서');
  const [searchText, setSearchText] = useState('');

  const handleTabPress = (tab: '출판도서' | '등록도서') => {
    setSelectedTab(tab);
    onTabClick(tab);
  };

  const handleSearchChange = (text: string) => {
    setSearchText(text);
    onSearch(text);
  };

  return (
    <View style={styles.container}>
      <View style={styles.tabButtonsContainer}>
        <TouchableOpacity
          style={[styles.tabButton, selectedTab === '출판도서' && styles.selectedTabButton]}
          onPress={() => handleTabPress('출판도서')}
        >
          <Text style={[styles.tabButtonText, selectedTab === '출판도서' && styles.selectedTabButtonText]}>출판도서</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, selectedTab === '등록도서' && styles.selectedTabButton]}
          onPress={() => handleTabPress('등록도서')}
        >
          <Text style={[styles.tabButtonText, selectedTab === '등록도서' && styles.selectedTabButtonText]}>등록도서</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.searchContainer}>
        <Image source={SearchIcon} style={styles.icon} />
        <TextInput
          placeholder="제목, 저자, 출판사 검색"
          style={styles.searchInput}
          placeholderTextColor="#888"
          value={searchText}
          onChangeText={handleSearchChange}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: width * 0.02,
  },
  tabButtonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: height * 0.01,
  },
  tabButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#3943B7',
    backgroundColor: '#ffffff',
    paddingVertical: height * 0.015,
    borderRadius: 4,
    marginHorizontal: width * 0.005,
  },
  selectedTabButton: {
    backgroundColor: '#3943B7',
  },
  tabButtonText: {
    color: '#3943B7',
    fontSize: width * 0.04,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  selectedTabButtonText: {
    color: '#ffffff',
    fontSize: width * 0.04,
    fontWeight: 'bold',
    textAlign: 'center',
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
  },
  icon: {
    width: width * 0.1,
    height: width * 0.1,
  },
});

export default MyBooksTab;
