import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, Dimensions, ScrollView, TouchableOpacity, AccessibilityInfo, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { getPopularBooks } from '../../services/HomePage/HomeRecomendedBooks';

const { width, height } = Dimensions.get('window');

const responsiveFontSize = (factor: number) => width * (factor / 100);
const responsiveWidth = (factor: number) => width * (factor / 100);
const responsiveHeight = (factor: number) => height * (factor / 100);

type NavigationProp = StackNavigationProp<RootStackParamList, 'BookDetail'>;

const MonthlyPopularBooks: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();

  const [books, setBooks] = useState<any[]>([]);
  const [criterion, setCriterion] = useState<string>(''); // 추천 기준
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPopularBooks(); // 컴포넌트가 마운트되면 데이터 로드
  }, []);

  const fetchPopularBooks = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getPopularBooks(); // API 호출
      setBooks(data.bookList);
      setCriterion(data.criterion);
    } catch (err: any) {  // 여기서 변수명을 error 대신 err로 변경
      setError(err.message || '데이터를 불러오는 중 오류가 발생했습니다.');
      Alert.alert('오류', err.message || '데이터를 불러오는 중 문제가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handlePress = (bookId: number, title: string) => {
    AccessibilityInfo.announceForAccessibility(`${title} 도서 상세 페이지로 이동합니다.`);
    navigation.navigate('BookDetail', { bookId });
  };

  if (loading) {
    return <Text style={styles.loadingText}>로딩 중...</Text>;
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>오류 발생: {error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title} accessibilityLabel={`${criterion} 목록`}>
        {criterion}
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.bookList}
        accessibilityLabel={`${criterion} 도서 목록을 좌우로 스크롤하여 탐색할 수 있습니다.`}
      >
        {books.map((book) => (
          <TouchableOpacity
            key={book.bookId}
            style={styles.bookItem}
            onPress={() => handlePress(book.bookId, book.title)}
            accessibilityLabel={`${book.title}, 저자: ${book.author}, 출판사: ${book.publisher}`}
            accessibilityHint="더 자세한 정보를 보려면 두 번 탭하세요."
          >
            <Image
              source={{ uri: book.cover }} // API에서 받은 이미지 URL 사용
              style={styles.bookImage}
              accessibilityLabel={book.coverAlt}
            />
            <Text
              style={styles.bookTitle}
              numberOfLines={2}
              ellipsizeMode="tail"
              accessibilityLabel={`${book.title}`}
            >
              {book.title}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: responsiveWidth(4),
  },
  title: {
    fontSize: responsiveFontSize(7),
    fontWeight: 'bold',
    color: '#3943B7',
    marginBottom: responsiveHeight(2),
  },
  bookList: {
    // paddingHorizontal: responsiveWidth(2),
    alignItems: 'center',
  },
  bookItem: {
    width: responsiveWidth(28),
    marginRight: responsiveWidth(4.2), //원래 2
    alignItems: 'center',
  },
  bookImage: {
    width: responsiveWidth(25),
    height: undefined,
    aspectRatio: 2 / 3, // 이미지 비율 유지
    backgroundColor: '#e0e0e0',
    marginBottom: responsiveHeight(1),
    resizeMode: 'contain',
  },
  bookTitle: {
    fontSize: responsiveFontSize(4),
    textAlign: 'center',
    fontWeight: 'bold',
    width: responsiveWidth(25),
    minHeight: responsiveHeight(5), // 텍스트 최소 높이
  },
  loadingText: {
    fontSize: responsiveFontSize(5),
    textAlign: 'center',
    marginTop: responsiveHeight(10),
  },
  errorContainer: {
    alignItems: 'center',
    marginTop: responsiveHeight(10),
  },
  errorText: {
    color: 'red',
    fontSize: responsiveFontSize(5),
    textAlign: 'center',
  },
});

export default MonthlyPopularBooks;
