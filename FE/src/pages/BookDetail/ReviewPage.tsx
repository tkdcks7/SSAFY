// src/pages/BookDetail/ReviewPage.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import CustomHeader from '../../components/CustomHeader';

const ReviewPage = () => {
  return (
    <View style={styles.container}>
      <CustomHeader title="리뷰 페이지" />
      <View style={styles.content}>
        <Text style={styles.text}>리뷰 내용을 여기에 표시합니다.</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 16,
    color: '#333',
  },
});

export default ReviewPage;