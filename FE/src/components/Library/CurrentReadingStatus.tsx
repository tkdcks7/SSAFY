// src/components/Library/CurrentReadingStatus.tsx
import React from 'react';
import {View, Text, StyleSheet, Image, Dimensions} from 'react-native';
import {currentBook} from '../../data/dummyBooks';

const {width, height} = Dimensions.get('window');

// type Book = {
//   id: number;
//   title: string;
//   author: string;
//   cover: string;
//   publisher: string;
//   progress?: number;
// };

type Props = {
  book: any;
};

const CurrentReadingStatus: React.FC<Props> = ({book}) => {
  return (
    <View style={styles.containerWrapper}>
      <Text style={styles.headerText}>현재 읽고 있는 책</Text>
      {book ? (
        <View style={styles.container}>
          <Image
            source={{
              uri: book.cover.startsWith('http')
                ? book.cover
                : `file://${book.cover}`,
            }}
            style={styles.bookImage}
          />
          <View style={styles.bookInfo}>
            <View style={styles.bookTitleContainer}>
              <Text
                numberOfLines={2}
                ellipsizeMode="tail"
                style={styles.bookTitle}>
                {book.title}
              </Text>
            </View>
            <View style={styles.progressContainer}>
              <Text style={styles.readingProgress}>{book.progressRate}%</Text>
            </View>
          </View>
        </View>
      ) : (
        <View style={styles.container}></View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  containerWrapper: {
    // margin: width * 0.03,
    marginHorizontal: width * 0.03,
  },
  headerText: {
    fontSize: width * 0.06,
    fontWeight: 'bold',
    color: '#3943B7',
    // marginBottom: height * 0.01,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    // padding: width * 0.02,
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
  },
  bookTitle: {
    fontSize: width * 0.05,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  bookTitleContainer: {
    flex: 1, // 남은 공간을 차지하도록 설정
    paddingHorizontal: width * 0.01,
    paddingVertical: height * 0.01,
  },
  progressContainer: {
    backgroundColor: '#ffffff',
    // marginRight: width * 0.04,
    marginLeft: width * 0.02,
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
