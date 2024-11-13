import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

type Book = {
  id: number;
  title: string;
  author: string;
  cover: string; // 로컬 파일 경로나 URL
};

type GeneralBookListProps = {
  books: Book[];
};

const GeneralBookList: React.FC<GeneralBookListProps> = ({ books }) => {
  return (
    <FlatList
      data={books}
      keyExtractor={(item) => item.id.toString()}
      numColumns={3} // 한 줄에 3개씩 표시
      renderItem={({ item }) => (
        <View style={styles.bookItem}>
          <Image
            source={{ uri: item.cover.startsWith('http') ? item.cover : `file://${item.cover}` }}
            style={styles.bookImage}
          />

          <Text style={styles.bookTitle} numberOfLines={2} ellipsizeMode='tail'>{item.title}</Text>
        </View>
      )}
      contentContainerStyle={styles.flatListContent}
    />
  );
};

const styles = StyleSheet.create({
  flatListContent: {
    paddingHorizontal: width * 0.02,
  },
  bookItem: {
    flexBasis: '30%',
    marginBottom: width * 0.04,
    marginHorizontal: width * 0.02,
    alignItems: 'center',
  },
  bookImage: {
    width: width * 0.3,
    height: width * 0.35,
    resizeMode: 'contain',
    borderRadius: 8,
  },
  bookTitle: {
    marginTop: 5,
    fontSize: 12,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  bookAuthor: {
    fontSize: 10,
    textAlign: 'center',
    color: '#666',
  },
});

export default GeneralBookList;
