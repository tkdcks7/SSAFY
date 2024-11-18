import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions, Alert, AccessibilityInfo } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { unlikeBook } from '../../services/Mypage/MyLikedBooks'; // 좋아요 취소 함수 임포트

interface Book {
  bookId: number;
  title: string;
  author: string;
  cover: string; // 원격 URL
}

interface AccessibilityMyLikedBooksListProps {
  books: Book[];
  searchQuery: string; // 검색어 상태를 전달받음
}

const { width, height } = Dimensions.get('window');

const GeneralMyLikedBooksList: React.FC<AccessibilityMyLikedBooksListProps> = ({ books, searchQuery }) => {
  const [likedBooks, setLikedBooks] = useState<Book[]>([]);
  const navigation = useNavigation();

  useEffect(() => {
    setLikedBooks(books);
  }, [books]);

  const filteredBooks = likedBooks.filter(
    (book) =>
      !searchQuery ||
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleUnlike = async (bookId: number, bookTitle: string) => {
    Alert.alert('좋아요 취소 확인', '이 도서를 좋아요 목록에서 제거하시겠습니까?', [
      {
        text: '취소',
        style: 'cancel',
        onPress: () => {
          AccessibilityInfo.announceForAccessibility('좋아요 취소가 취소되었습니다.');
        },
      },
      {
        text: '제거',
        onPress: async () => {
          try {
            await unlikeBook(bookId); // 좋아요 취소 API 호출
            setLikedBooks((prevBooks) => prevBooks.filter((book) => book.bookId !== bookId));
            AccessibilityInfo.announceForAccessibility(`${bookTitle} 도서가 좋아요 목록에서 제거되었습니다.`);
          } catch (error: any) {
            Alert.alert('에러', error.message || '좋아요 취소 중 문제가 발생했습니다.');
          }
        },
      },
    ]);
  };

  const handleBookPress = (bookId: number) => {
    navigation.navigate('BookDetail', { bookId });
  };

  return (
    <View style={styles.container}>
      {filteredBooks.map((book) => (
        <View key={book.bookId} style={styles.card}>
          <TouchableOpacity
            style={styles.bookInfoContainer}
            onPress={() => handleBookPress(book.bookId)}
            accessibilityLabel={`${book.title} 상세 보기`}
            accessibilityHint="이 버튼을 누르면 도서의 상세 페이지로 이동합니다."
          >
            <Image source={{ uri: book.cover }} style={styles.bookCover} accessibilityLabel={`${book.title} 표지`} />
            <View style={styles.textContainer}>
              <Text style={styles.title} accessibilityLabel={`제목: ${book.title}`} numberOfLines={2}>
                {book.title}
              </Text>
              <Text style={styles.author} accessibilityLabel={`저자: ${book.author}`} numberOfLines={1}>
                저자: {book.author}
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.unlikeButton}
            onPress={() => handleUnlike(book.bookId, book.title)}
            accessibilityLabel={`${book.title} 좋아요 취소 버튼`}
            accessibilityHint="이 버튼을 누르면 도서가 좋아요 목록에서 제거됩니다."
          >
            <Image source={require('../../assets/icons/heart.png')} style={styles.unlikeIcon} />
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 8,
    padding: width * 0.02,
    marginVertical: height * 0.01,
    marginHorizontal: height * 0.01,
    backgroundColor: '#fff',
  },
  bookInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  bookCover: {
    width: width * 0.15,
    height: height * 0.1,
    marginRight: width * 0.04,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: width * 0.06,
    fontWeight: 'bold',
    marginBottom: height * 0.005,
  },
  author: {
    fontSize: width * 0.05,
    color: '#555',
  },
  unlikeButton: {
    padding: width * 0.02,
  },
  unlikeIcon: {
    width: width * 0.15,
    height: width * 0.15,
  },
});

export default GeneralMyLikedBooksList;
