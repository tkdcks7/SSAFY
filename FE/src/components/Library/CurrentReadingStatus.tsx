// src/components/Library/CurrentReadingStatus.tsx
import React from 'react';
import { View, Text, StyleSheet, Image, Dimensions } from 'react-native';
import { currentBook } from '../../data/dummyBooks';

const { width, height } = Dimensions.get('window');

const CurrentReadingStatus: React.FC = () => {
  return (
    <View style={styles.containerWrapper}>
      <Text style={styles.headerText}>현재 읽고 있는 책</Text>
      <View style={styles.container}>
        <Image source={currentBook.coverImage} style={styles.bookImage} />
        <View style={styles.bookInfo}>
          <View style={styles.bookTitleContainer}>
            <Text
                numberOfLines={2}
                ellipsizeMode="tail"
                style={styles.bookTitle}>
              {currentBook.title}
            </Text>
          </View>
          <View style={styles.progressContainer}>
            <Text style={styles.readingProgress}>{currentBook.progress}%</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  containerWrapper: {
    marginHorizontal: width * 0.03,
  },
  headerText: {
    fontSize: width * 0.06,
    fontWeight: 'bold',
    color: '#3943B7',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: width * 0.02,
    paddingHorizontal: width * 0.03,
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
    flexWrap: 'wrap', // 줄바꿈 허용
  },
  bookTitleContainer: {
    flex: 1,
    paddingHorizontal: width * 0.01,
    paddingVertical: height * 0.01,
  },
  bookTitle: {
    fontSize: width * 0.05,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  progressContainer: {
    backgroundColor: '#ffffff',
    paddingHorizontal: width * 0.04,
    paddingVertical: height * 0.01,
    borderRadius: 8,
    maxWidth: width * 0.2, // 버튼 최대 크기 제한
    alignSelf: 'flex-start', // 컨테이너 내에서 정렬
    flexShrink: 1, // 공간 부족 시 크기 축소
  },
  readingProgress: {
    fontSize: width * 0.045,
    fontWeight: 'bold',
    color: '#3943B7',
    textAlign: 'center',
  },
});



export default CurrentReadingStatus;
