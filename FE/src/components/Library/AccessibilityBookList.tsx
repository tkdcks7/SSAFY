import React, { useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image, Dimensions, AccessibilityInfo, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

type Book = {
  id: number;
  title: string;
  author: string;
  cover: string;
  publisher: string;
  progress?: number; // 진행도
};



type AccessibilityBookListProps = {
  books: Book[];
  currentBook: Book | null; // 현재 읽고 있는 책
};

const AccessibilityBookList: React.FC<AccessibilityBookListProps> = ({ books, currentBook }) => {
  useEffect(() => {
    if (currentBook) {
      AccessibilityInfo.announceForAccessibility(`현재 읽고 있는 책은 ${currentBook.title}입니다.`);
    }
  }, [currentBook]);

  const navigation = useNavigation();

  return (
    <FlatList
      data={books}
      keyExtractor={(item) => item.id.toString()}
      style={styles.bookContainer}
      ListHeaderComponent={
        currentBook ? (
          <View style={styles.currentBookContainer}>
            <Text
              style={styles.currentBookTitle}
              accessibilityLabel={`현재 읽고 있는 책: ${currentBook.title}`}
            >
              현재 읽고 있는 책
            </Text>
            <View style={styles.bookItem}>
              <Image
                source={{
                  uri: currentBook.cover.startsWith('http') ? currentBook.cover : `file://${currentBook.cover}`,
                }}
                style={styles.bookImage}
                accessibilityLabel={`표지 이미지: ${currentBook.title}`}
              />
              <View style={styles.bookInfo}>
                <Text style={styles.bookTitle} accessibilityLabel={`제목: ${currentBook.title}`}>
                  {currentBook.title}
                </Text>
                <Text style={styles.bookAuthor} accessibilityLabel={`저자: ${currentBook.author}`}>
                  저자: {currentBook.author}
                </Text>
                <Text
                  style={styles.bookProgress}
                  accessibilityLabel={`진행도: ${currentBook.progress ?? 0}%`}
                >
                  진행도: {currentBook.progress ?? 0}%
                </Text>
              </View>
            </View>
          </View>
        ) : null
      }
      renderItem={({ item }) => (
        <TouchableOpacity
          style={styles.bookItem}
          onPress={() => {
            AccessibilityInfo.announceForAccessibility(`${item.title} 상세 보기 페이지로 이동합니다.`);
            navigation.navigate('EBookViewer', { bookId: item.id });
          }}
          accessibilityLabel={`${item.title} 상세 보기`}
          accessibilityHint="이 책의 상세 정보를 확인하려면 두 번 탭하세요."
        >
          <Image
            source={{
              uri: item.cover.startsWith('http') ? item.cover : `file://${item.cover}`,
            }}
            style={styles.bookImage}
            accessibilityLabel={`표지 이미지: ${item.title}`}
          />
          <View style={styles.bookInfo}>
            <Text style={styles.bookTitle} numberOfLines={2} accessibilityLabel={`제목: ${item.title}`}>
              {item.title}
            </Text>
            <Text style={styles.bookAuthor} numberOfLines={2} accessibilityLabel={`저자: ${item.author}`}>
              저자: {item.author}
            </Text>
            <Text style={styles.bookPublisher} accessibilityLabel={`출판사: ${item.publisher}`}>
              출판사: {item.publisher}
            </Text>
          </View>
        </TouchableOpacity>
      )}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      contentContainerStyle={styles.flatListContent}
    />
  );
};

const styles = StyleSheet.create({
  bookContainer: {
    marginHorizontal : width * 0.02,
  },
  bookContainerTitle:{
    fontSize: width * 0.07,
    fontWeight: 'bold',
    color: '#3943B7',
    marginBottom: height * 0.01,
  },
  currentBookContainer: {
    marginBottom: height * 0.02,
    // paddingHorizontal: width * 0.02,
  },
  currentBookTitle: {
    fontSize: width * 0.07,
    fontWeight: 'bold',
    color: '#3943B7',
    // marginBottom: height * 0.02,
    marginBottom: height * 0.01,
  },
  currentBookProgressContainer: {
    backgroundColor: '#3943B7',
    // marginRight: width * 0.04,
    paddingVertical: height * 0.01,
    paddingHorizontal: width * 0.04,
    borderRadius: 8,
    marginTop: height * 0.01,
  },
  flatListContent: {
    paddingBottom: height * 0.01,
  },
  currentBookItem:{
    borderRadius: width * 0.03,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: height * 0.005 },
    shadowOpacity: 0.3,
    shadowRadius: width * 0.02,
    elevation: 5,
  },
  bookItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: height * 0.01,
    paddingHorizontal: width * 0.02,
    paddingRight: width * 0.03,
    backgroundColor: '#ffffff',
    // borderRadius: width * 0.03,
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: height * 0.005 },
    // shadowOpacity: 0.3,
    // shadowRadius: width * 0.02,
    // elevation: 5,
  },
  bookImage: {
    width: width * 0.25,
    height: height * 0.2,
    // marginRight: width * 0.06,
    marginRight: width * 0.05,
    borderRadius: width * 0.02,
  },
  bookInfo: {
    flex: 1,
    height: height * 0.18,
    flexDirection: 'column', // 세로 정렬
    justifyContent: 'space-between', // 위쪽과 아래쪽으로 분리
  },
  bookTitle: {
    fontSize: width * 0.07,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: height * 0.01,
  },
  authorAndPublisherContainer: {
  },
  bookAuthor: {
    fontSize: width * 0.05,
    color: '#666666',
    marginBottom: height * 0.01,
  },
  bookPublisher: {
    fontSize: width * 0.05,
    color: '#666666',
  },
  bookProgress: {
    // fontSize: width * 0.035,
    fontSize: width * 0.05,
    // color: '#3943B7',
    color: "#ffffff",
    textAlign: "center",
    // marginTop: height * 0.01,
  },
  separator: {
    height: 2,
    // height: 4,
    // backgroundColor: '#000000',
    backgroundColor: '#3943B7',
    // marginVertical: height * 0.02,
  },
});

export default AccessibilityBookList;
