import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { StackNavigationProp } from '@react-navigation/stack';

const { width, height } = Dimensions.get('window');

interface Book {
  bookId: number;
  title: string;
  author: string;
  publishedAt: string;
  cover: string; // 변경: URL로 올 경우 string 타입으로 설정
}

interface AccessibilityBookListProps {
  bookList: Book[];
}

type NavigationProp = StackNavigationProp<RootStackParamList, 'BookDetail'>;

const AccessibilityBookList: React.FC<AccessibilityBookListProps> = ({ bookList }) => {
  const [sortOrder, setSortOrder] = useState<'latest' | 'alphabetical'>('latest');
  const [isAscending, setIsAscending] = useState(true);
  const navigation = useNavigation<NavigationProp>();

  const handleSortChange = (order: 'latest' | 'alphabetical') => {
    setSortOrder(order);
  };

  const toggleSortDirection = () => {
    setIsAscending((prev) => !prev);
  };

  const handleBookClick = (bookId: number) => {
    navigation.navigate('BookDetail', { bookId });
  };

  const sortedBooks = [...bookList].sort((a, b) => {
    if (sortOrder === 'latest') {
      return isAscending
        ? new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime()
        : new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
    } else {
      return isAscending
        ? a.title.localeCompare(b.title)
        : b.title.localeCompare(a.title);
    }
  });

  return (
    <View style={styles.container}>
      <View style={styles.sortContainer}>
        <TouchableOpacity
          style={[styles.sortButton, sortOrder === 'latest' && styles.selectedButton]}
          onPress={() => handleSortChange('latest')}
        >
          <Text style={styles.sortButtonText}>최신순</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.sortButton, sortOrder === 'alphabetical' && styles.selectedButton]}
          onPress={() => handleSortChange('alphabetical')}
        >
          <Text style={styles.sortButtonText}>가나다순</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.reverseButton} onPress={toggleSortDirection}>
          <Image source={require('../../assets/icons/reverse.png')} style={styles.reverseIcon} />
        </TouchableOpacity>
      </View>
      <ScrollView>
        {sortedBooks.map((book) => (
          <TouchableOpacity key={book.bookId} onPress={() => handleBookClick(book.bookId)} style={styles.bookItem}>
            <Image source={{ uri: book.cover }} style={styles.bookImage} />
            <View style={styles.bookInfo}>
              <Text style={styles.bookTitle} numberOfLines={2}>{book.title}</Text>
              <Text style={[styles.bookAuthor, styles.textSpacing]} numberOfLines={1}>저자: {book.author}</Text>
              <Text style={[styles.bookPublishedAt, styles.textSpacing]}>출판일: {book.publishedAt}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: width * 0.01,
    backgroundColor: '#FFFFFF',
  },
  sortContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: height * 0.01,
  },
  sortButton: {
    flex: 1,
    paddingVertical: height * 0.015,
    backgroundColor: '#E0E0E0',
    borderRadius: width * 0.03,
    alignItems: 'center',
    marginHorizontal: width * 0.01,
  },
  selectedButton: {
    backgroundColor: '#3943B7',
  },
  sortButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: width * 0.05,
  },
  reverseButton: {
    padding: height * 0.012,
    backgroundColor: '#FF6347',
    borderRadius: width * 0.03,
  },
  reverseIcon: {
    width: width * 0.08,
    height: width * 0.08,
  },
  bookItem: {
    flexDirection: 'row',
    marginBottom: height * 0.03,
    borderBottomWidth: 1,
    borderBottomColor: '#CCCCCC',
    paddingBottom: height * 0.02,
  },
  bookImage: {
    width: width * 0.3,
    height: height * 0.25,
    marginRight: width * 0.05,
  },
  bookInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  bookTitle: {
    fontSize: width * 0.09,
    fontWeight: 'bold',
    marginBottom: height * 0.02,
  },
  bookAuthor: {
    fontSize: width * 0.06,
  },
  bookPublishedAt: {
    fontSize: width * 0.06,
  },
  textSpacing: {
    marginBottom: height * 0.025,
  },
});

export default AccessibilityBookList;
