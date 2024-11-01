// src/components/MyPage/AccessibilityMyBooksList.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions, AccessibilityInfo } from 'react-native';

interface Book {
  bookId: number;
  title: string;
  author: string;
  cover: any;
  isDownloaded: boolean;
}

interface AccessibilityMyBooksListProps {
  books: Book[];
  searchQuery: string; // 검색어 상태를 전달받음
}

const { width, height } = Dimensions.get('window');

const AccessibilityMyBooksList: React.FC<AccessibilityMyBooksListProps> = ({ books, searchQuery }) => {
  const [showOnlyNotDownloaded, setShowOnlyNotDownloaded] = useState(false);

  // 검색어와 다운로드되지 않은 도서만 보기 설정에 따라 도서 목록 필터링
  const filteredBooks = books.filter((book) => {
    if (showOnlyNotDownloaded && book.isDownloaded) {
      return false;
    }
    if (searchQuery && !book.title.toLowerCase().includes(searchQuery.toLowerCase()) && !book.author.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  });

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.filterButton}
        onPress={() => setShowOnlyNotDownloaded((prev) => !prev)}
        accessibilityLabel={showOnlyNotDownloaded ? "모든 도서 보기" : "다운로드되지 않은 도서만 보기"}
      >
        <Text style={styles.filterButtonText}>{showOnlyNotDownloaded ? "모든 도서 보기" : "다운로드되지 않은 도서만 보기"}</Text>
      </TouchableOpacity>
      {filteredBooks.map((book) => (
        <View key={book.bookId} style={styles.card}>
          <View style={styles.leftSection}>
            <Text style={styles.title} accessibilityLabel={`제목: ${book.title}`} numberOfLines={2} ellipsizeMode="tail">{book.title}</Text>
            <Text style={styles.author} accessibilityLabel={`저자: ${book.author}`} numberOfLines={1} ellipsizeMode="tail">저자: {book.author}</Text>
          </View>
          {book.isDownloaded ? (
            <View style={styles.middleSectionDownloaded} accessibilityLabel={`${book.title} 다운로드 완료`}>
              <Text style={styles.downloadedText}>다운완료</Text>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.middleSection}
              onPress={() => {
                AccessibilityInfo.announceForAccessibility(`${book.title} 다운로드 중입니다.`);
                // 다운로드 요청 로직 추가 예정
              }}
              accessibilityLabel={`${book.title} 다운로드 버튼`}
            >
              <Text style={styles.downloadText}>다운로드</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={styles.rightSection}
            onPress={() => {
              AccessibilityInfo.announceForAccessibility(`${book.title} 상세보기 페이지로 이동합니다.`);
              // 상세보기 로직 추가 예정
            }}
            accessibilityLabel={`${book.title} 상세보기 버튼`}
          >
            <Text style={styles.detailText}>상세보기</Text>
          </TouchableOpacity>
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
  filterButton: {
    alignSelf: 'center',
    backgroundColor: '#3943B7',
    paddingVertical: height * 0.01,
    paddingHorizontal: width * 0.05,
    borderRadius: 8,
    marginVertical: height * 0.02,
  },
  filterButtonText: {
    color: '#fff',
    fontSize: width * 0.05,
    fontWeight: 'bold',
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
    flex: 3,
    justifyContent: 'center',
    paddingLeft: width * 0.04,
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
  middleSection: {
    flex: 1,
    backgroundColor: '#0000ff',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
  },
  middleSectionDownloaded: {
    flex: 1,
    backgroundColor: '#aaa',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
  },
  downloadText: {
    color: '#fff',
    fontSize: width * 0.07,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  downloadedText: {
    color: '#fff',
    fontSize: width * 0.07,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  rightSection: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
  },
  detailText: {
    color: '#000',
    fontSize: width * 0.07,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default AccessibilityMyBooksList;