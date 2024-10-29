import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const GeneralRecommendedBooks: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>추천 도서</Text>
      <View style={styles.bookList}>
        {[1, 2, 3].map((book, index) => (
          <View key={index} style={styles.bookItem}>
            <View style={styles.bookImage}></View>
            <Text style={styles.bookTitle}>책 제목 {index + 1}</Text>
          </View>
        ))}
      </View>
      <Text style={styles.moreButton}>다른 추천 더보기</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  bookList: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  bookItem: {
    width: 100,
    alignItems: 'center',
  },
  bookImage: {
    width: 80,
    height: 120,
    backgroundColor: '#e0e0e0',
    marginBottom: 5,
  },
  bookTitle: {
    fontSize: 16,
  },
  moreButton: {
    color: '#3943B7',
    fontWeight: 'bold',
  },
});

export default GeneralRecommendedBooks;
