// src/components/Library/GeneralBookList.tsx
import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

// Book 타입 정의
type Book = {
  id: number;
  title: string;
  author: string;
  downloadDate: string;
  category: string;
  type: '출판도서' | '등록도서';
  coverImage: any;
  publisher: string;
};

type GeneralBookListProps = {
  books: Book[];
};

const GeneralBookList: React.FC<GeneralBookListProps> = ({ books }) => {
  return (
    <FlatList
      data={books}
      keyExtractor={(item) => item.id.toString()}
      numColumns={3}
      ListHeaderComponent={
        <Text style={styles.title}>일반 도서 목록</Text>
      }
      renderItem={({ item }) => (
        <View style={styles.bookItem}>
          <Image source={item.coverImage} style={styles.bookImage} />
        </View>
      )}
      contentContainerStyle={styles.flatListContent}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    padding: width * 0.02,
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: width * 0.06,
    fontWeight: 'bold',
    marginBottom: width * 0.04,
    color: '#3943B7',
    paddingHorizontal: width * 0.05, // padding 추가
  },
  flatListContent: {
    alignItems: 'flex-start',
    paddingHorizontal: width * 0.02,
  },
  bookItem: {
    flexBasis: '30%',
    marginBottom: width * 0.04,
    marginLeft: width * 0.02,
    marginRight: width * 0.01,
  },
  bookImage: {
    width: width * 0.3,
    height: width * 0.35,
    resizeMode: 'contain',
  },
});

export default GeneralBookList;
