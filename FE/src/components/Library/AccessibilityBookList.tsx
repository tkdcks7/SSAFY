// src/components/Library/AccessibilityBookList.tsx
import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, Dimensions } from 'react-native';
import { dummyBooks, currentBook } from '../../data/dummyBooks';

const { width, height } = Dimensions.get('window');

const AccessibilityBookList: React.FC = () => {
  return (
    <FlatList
      data={dummyBooks}
      keyExtractor={(item) => item.id.toString()}
      ListHeaderComponent={
        <View>
          <View style={styles.currentBookContainer}>
            <Text style={styles.currentBookTitle}>현재 읽고 있는 책</Text>
            <View style={styles.bookItem}>
              <Image source={currentBook.coverImage} style={styles.bookImage} />
              <View style={styles.bookInfo}>
                <Text style={styles.bookTitle}>{currentBook.title}</Text>
                <Text style={styles.bookAuthor}>저자: {currentBook.author}</Text>
                <Text style={styles.bookProgress}>진행도: {currentBook.progress}%</Text>
              </View>
            </View>
          </View>
          <Text style={styles.remainingBooksTitle}>내 서재 도서 목록</Text>
        </View>
      }
      renderItem={({ item }) => (
        <View style={styles.bookItem}>
          <Image source={item.coverImage} style={styles.bookImage} />
          <View style={styles.bookInfo}>
            <Text style={styles.bookTitle}>{item.title}</Text>
            <Text style={styles.bookAuthor}>저자: {item.author}</Text>
            <Text style={styles.bookPublisher}>출판사: {item.publisher}</Text>
          </View>
        </View>
      )}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      contentContainerStyle={styles.flatListContent}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    padding: width * 0.04,
    margin: width * 0.04,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: width * 0.07,
    fontWeight: 'bold',
    marginBottom: height * 0.03,
    color: '#3943B7',
    paddingHorizontal: width * 0.04,
  },
  currentBookContainer: {
    marginBottom: height * 0.02,
    paddingHorizontal: width * 0.04,
  },
  currentBookTitle: {
    fontSize: width * 0.1,
    fontWeight: 'bold',
    color: '#3943B7',
    marginBottom: height * 0.02,
  },
  remainingBooksTitle: {
    fontSize: width * 0.1,
    fontWeight: 'bold',
    color: '#3943B7',
    paddingHorizontal: width * 0.04,
  },
  flatListContent: {
    paddingBottom: height * 0.02,
  },
  bookItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: height * 0.03,
    paddingHorizontal: width * 0.04,
    backgroundColor: '#ffffff',
    borderRadius: width * 0.03,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: height * 0.005 },
    shadowOpacity: 0.3,
    shadowRadius: width * 0.02,
    elevation: 5,
    marginBottom: height * 0.02,
  },
  bookImage: {
    width: width * 0.25,
    height: height * 0.2,
    marginRight: width * 0.06,
    borderRadius: width * 0.02,
  },
  bookInfo: {
    flex: 1,
  },
  bookTitle: {
    fontSize: width * 0.1,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: height * 0.01,
  },
  bookAuthor: {
    fontSize: width * 0.07,
    color: '#666666',
    marginBottom: height * 0.01,
  },
  bookPublisher: {
    fontSize: width * 0.05,
    color: '#666666',
  },
  bookProgress: {
    fontSize: width * 0.05,
    color: '#3943B7',
    marginTop: height * 0.01,
  },
  separator: {
    height: 2,
    backgroundColor: '#000000',
    marginVertical: height * 0.02,
  },
});

export default AccessibilityBookList;
