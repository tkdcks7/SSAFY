import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const MonthlyPopularBooks: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>이달의 인기도서</Text>
      {/* 책 목록 렌더링 */}
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
  },
});

export default MonthlyPopularBooks;
