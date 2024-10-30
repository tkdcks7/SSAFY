// src/components/Library/CurrentReadingStatus.tsx
import React from 'react';
import { View, Text, StyleSheet, Image, Dimensions } from 'react-native';
import { currentBook } from '../../data/dummyBooks';

const { width, height } = Dimensions.get('window');

const CurrentReadingStatus: React.FC = () => {
  return (
    <View style={styles.container}>
      <Image source={currentBook.coverImage} style={styles.bookImage} />
      <View style={styles.bookInfo}>
        <Text style={styles.bookTitle}>{currentBook.title}</Text>
        <View style={styles.progressContainer}>
          <Text style={styles.readingProgress}>{currentBook.progress}%</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: width * 0.02,
    margin: width * 0.03,
    backgroundColor: '#3943B7',
    marginVertical: height * 0.02,
    borderRadius: 8,
    elevation: 5,
  },
  bookImage: {
    width: width * 0.15,
    height: height * 0.1,
    marginRight: width * 0.03,
    borderRadius: 8,
  },
  bookInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bookTitle: {
    fontSize: width * 0.05,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  progressContainer: {
    backgroundColor: '#ffffff',
    marginRight: width * 0.04,
    paddingHorizontal: width * 0.04,
    paddingVertical: height * 0.01,
    borderRadius: 8,
  },
  readingProgress: {
    fontSize: width * 0.05,
    fontWeight: 'bold',
    color: '#3943B7',
  },
});

export default CurrentReadingStatus;
