import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions, AccessibilityInfo } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/AppNavigator';

interface Book {
  bookId: number;
  title: string;
  author: string;
  cover: string;
  isDownloaded: boolean;
}

interface GeneralMyBooksListProps {
  books: Book[];
  searchText: string;
}

type BookDetailNavigationProp = StackNavigationProp<RootStackParamList, 'BookDetail'>;

const GeneralMyBooksList: React.FC<GeneralMyBooksListProps> = ({ books, searchText }) => {
  const [showOnlyNotDownloaded, setShowOnlyNotDownloaded] = useState(false);
  const navigation = useNavigation<BookDetailNavigationProp>();

  const filteredBooks = books.filter((book) => {
    if (showOnlyNotDownloaded && book.isDownloaded) {
      return false;
    }
    return (
      !searchText ||
      book.title.toLowerCase().includes(searchText.toLowerCase()) ||
      book.author.toLowerCase().includes(searchText.toLowerCase())
    );
  });

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.filterButton}
        onPress={() => setShowOnlyNotDownloaded((prev) => !prev)}
        accessibilityLabel={showOnlyNotDownloaded ? '모든 도서 보기' : '다운로드되지 않은 도서만 보기'}
      >
        <Text style={styles.filterButtonText}>
          {showOnlyNotDownloaded ? '모든 도서 보기' : '다운로드되지 않은 도서만 보기'}
        </Text>
      </TouchableOpacity>
      {filteredBooks.map((book) => (
        <View key={book.bookId} style={styles.card}>
          <Image
            source={{ uri: book.cover }}
            style={styles.bookCover}
            accessibilityLabel={`${book.title} 표지`}
          />
          <TouchableOpacity
            style={styles.textContainer}
            onPress={() => {
              AccessibilityInfo.announceForAccessibility(`${book.title} 상세보기 페이지로 이동합니다.`);
              navigation.navigate('BookDetail', { bookId: book.bookId });
            }}
            accessibilityLabel={`${book.title} 상세보기 버튼`}
          >
            <Text
              style={styles.title}
              accessibilityLabel={`제목: ${book.title}`}
              numberOfLines={2}
              ellipsizeMode="tail"
            >
              {book.title}
            </Text>
            <Text
              style={styles.author}
              accessibilityLabel={`저자: ${book.author}`}
              numberOfLines={2}
              ellipsizeMode="tail">
              {book.author}
            </Text>
          </TouchableOpacity>
          {book.isDownloaded ? (
            <View style={styles.downloadedButton} accessibilityLabel={`${book.title} 다운로드 완료`}>
              <Image source={require('../../assets/icons/checked.png')} style={styles.downloadIcon} />
            </View>
          ) : (
            <TouchableOpacity
              style={styles.downloadButton}
              onPress={() => {
                AccessibilityInfo.announceForAccessibility(`${book.title} 다운로드 중입니다.`);
                // 다운로드 요청 로직 추가 예정
              }}
              accessibilityLabel={`${book.title} 다운로드 버튼`}
            >
              <Image source={require('../../assets/icons/download2.png')} style={styles.downloadIcon} />
            </TouchableOpacity>
          )}
        </View>
      ))}
    </View>
  );
};

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  filterButton: {
    alignSelf: 'center',
    backgroundColor: '#3943B7',
    paddingVertical: height * 0.01,
    paddingHorizontal: width * 0.05,
    borderRadius: 8,
    marginVertical: height * 0.02,
  },
  filterButtonText: {
    color: 'white',
    fontSize: width * 0.05,
    fontWeight: 'bold',
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
  downloadButton: {
    padding: width * 0.02,
  },
  downloadedButton: {
    padding: width * 0.02,
    justifyContent: 'center',
    alignItems: 'center',
  },
  downloadIcon: {
    width: width * 0.12,
    height: width * 0.12,
  },
});

export default GeneralMyBooksList;
