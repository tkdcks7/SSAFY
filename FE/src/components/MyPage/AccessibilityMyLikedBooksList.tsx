import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, AccessibilityInfo, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { unlikeBook } from '../../services/Mypage/MyLikedBooks'; // 좋아요 취소 API 함수 임포트

interface Book {
  bookId: number;
  title: string;
  author: string;
  cover: any;
}

interface AccessibilityMyLikedBooksListProps {
  books: Book[];
  searchQuery: string; // 검색어 상태를 전달받음
}

const { width, height } = Dimensions.get('window');

const AccessibilityMyLikedBooksList: React.FC<AccessibilityMyLikedBooksListProps> = ({ books, searchQuery }) => {
  const [likedBooks, setLikedBooks] = useState(books);
  const navigation = useNavigation();

  // 검색어와 일치하는 도서 목록 필터링
  const filteredBooks = likedBooks.filter(
    (book) =>
      !searchQuery ||
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleUnlike = async (bookId: number, bookTitle: string) => {
    try {
      await unlikeBook(bookId); // 좋아요 취소 API 호출
      setLikedBooks((prevBooks) => prevBooks.filter((book) => book.bookId !== bookId));
      AccessibilityInfo.announceForAccessibility(`${bookTitle} 좋아요를 취소하였습니다.`);
    } catch (error: any) {
      Alert.alert('에러', error.message || '좋아요 취소 중 문제가 발생했습니다.');
    }
  };

  const handleDetailView = (bookId: number, bookTitle: string) => {
    AccessibilityInfo.announceForAccessibility(`${bookTitle} 상세보기 페이지로 이동합니다.`);
    navigation.navigate('BookDetail', { bookId });
  };

  return (
    <View style={styles.container}>
      {filteredBooks.map((book) => (
        <View key={book.bookId} style={styles.card}>
          <View style={styles.leftSection}>
            <Text style={styles.title} accessibilityLabel={`제목: ${book.title}`} numberOfLines={2} ellipsizeMode="tail">
              {book.title}
            </Text>
            <Text style={styles.author} accessibilityLabel={`저자: ${book.author}`} numberOfLines={1} ellipsizeMode="tail">
              저자: {book.author}
            </Text>
          </View>
          <View style={styles.middleSection}>
            <TouchableOpacity
              onPress={() => handleUnlike(book.bookId, book.title)}
              accessibilityLabel={`${book.title} 좋아요 취소 버튼`}
              accessibilityHint="이 버튼을 누르면 좋아요를 취소합니다"
            >
              <Text style={styles.middleButtonText}>좋아요 취소</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.rightSection}>
            <TouchableOpacity
              onPress={() => handleDetailView(book.bookId, book.title)}
              accessibilityLabel={`${book.title} 상세보기 버튼`}
              accessibilityHint="이 버튼을 누르면 도서의 상세 정보를 볼 수 있습니다"
            >
              <Text style={styles.rightButtonText}>상세보기</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: width * 0.04,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'stretch',
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 8,
    marginVertical: height * 0.01,
    backgroundColor: '#fff',
    height: height * 0.12,
  },
  leftSection: {
    flex: 5,
    justifyContent: 'center',
    paddingLeft: width * 0.04,
  },
  middleSection: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
    borderLeftWidth: 1,
    borderLeftColor: '#000',
  },
  rightSection: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#3943B7',
    borderLeftWidth: 1,
    borderLeftColor: '#000',
  },
  title: {
    fontSize: width * 0.06,
    fontWeight: 'bold',
    marginBottom: height * 0.005,
  },
  author: {
    fontSize: width * 0.04,
    color: '#555',
  },
  middleButtonText: {
    fontSize: width * 0.06,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  rightButtonText: {
    fontSize: width * 0.07,
    fontWeight: 'bold',
    color: 'white',
  },
});

export default AccessibilityMyLikedBooksList;
