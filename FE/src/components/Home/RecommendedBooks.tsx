import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, Dimensions, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import Btn from '../Btn';
import {
  getRecentSimilarBooks,
  getSimilarMembersBooks,
  getFavoriteCategoryBooks,
} from '../../services/HomePage/HomeRecomendedBooks';

const { width, height } = Dimensions.get('window');

const responsiveFontSize = (factor: number) => width * (factor / 100);
const responsiveWidth = (factor: number) => width * (factor / 100);
const responsiveHeight = (factor: number) => height * (factor / 100);

type NavigationProp = StackNavigationProp<RootStackParamList, 'BookDetail'>;

const GeneralRecommendedBooks: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();

  const [books, setBooks] = useState<any[]>([]);
  const [criterion, setCriterion] = useState<string>(''); // 추천 기준
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastIndex, setLastIndex] = useState<number>(-1); // 마지막으로 보여줬던 추천 기준의 인덱스

  const recommendationFunctions = [
    { func: getRecentSimilarBooks },
    { func: getSimilarMembersBooks },
    { func: getFavoriteCategoryBooks },
  ];

  useEffect(() => {
    fetchRecommendation(2); // 첫 로드 시 '많이 읽은 카테고리 인기도서'를 기본으로 설정
  }, []);

  const fetchRecommendation = async (index: number) => {
    setLoading(true);
    setError(null);

    try {
      const { func } = recommendationFunctions[index];
      const data = await func();
      setBooks(data.bookList || []);
      setCriterion(data.criterion || '추천 기준 없음');
      setLastIndex(index);
    } catch (err: any) {
      setBooks([]); // 에러 발생 시 빈 리스트로 설정
      setError(err.message || '추천 결과를 찾을 수 없습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleMoreRecommendations = () => {
    const availableIndexes = recommendationFunctions
      .map((_, index) => index)
      .filter((index) => index !== lastIndex);

    const randomIndex = availableIndexes[Math.floor(Math.random() * availableIndexes.length)];
    fetchRecommendation(randomIndex);
  };

  if (loading) {
    return <Text style={styles.loadingText}>로딩 중...</Text>;
  }

  const shouldShowEmptyMessage = !books.length || error === '추천 결과를 찾을 수 없습니다.';

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{criterion}</Text>
      {shouldShowEmptyMessage ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyMessage}>도서들을 담고 좋아요를 추가해보세요!</Text>
        </View>
      ) : (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.bookList}>
          {books.map((book) => (
            <TouchableOpacity
              key={book.bookId}
              style={styles.bookItem}
              onPress={() => navigation.navigate('BookDetail', { bookId: book.bookId })}
              accessibilityLabel={`${book.title} 도서 상세 페이지로 이동`}
              accessibilityHint="도서의 상세 정보를 확인할 수 있습니다."
            >
              <Image
                source={{ uri: book.cover }}
                style={styles.bookImage}
                accessibilityLabel={book.coverAlt}
              />
              <Text
                style={styles.bookTitle}
                numberOfLines={2}
                ellipsizeMode="tail"
                accessibilityLabel={`${book.title} 저자: ${book.author}`}
              >
                {book.title}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
      <Btn
        title="다른 추천 더 보기"
        btnSize={1}
        onPress={handleMoreRecommendations}
        style={styles.moreButton}
        textStyle={styles.moreButtonText}
        accessibilityLabel="다른 추천 도서 보기"
        accessibilityHint="다른 추천 도서 리스트로 업데이트합니다."
      />
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
    alignItems: 'center',
    marginBottom: responsiveHeight(2),
  },
  bookItem: {
    width: responsiveWidth(28),
    marginRight: responsiveWidth(4.2),
    alignItems: 'center',
  },
  bookImage: {
    width: responsiveWidth(25),
    height: undefined,
    aspectRatio: 2 / 3,
    backgroundColor: '#e0e0e0',
    marginBottom: responsiveHeight(1),
    resizeMode: 'contain',
  },
  bookTitle: {
    fontSize: responsiveFontSize(4),
    textAlign: 'center',
    fontWeight: 'bold',
    width: responsiveWidth(25),
    minHeight: responsiveHeight(5),
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: responsiveHeight(5),
  },
  emptyMessage: {
    fontSize: responsiveFontSize(5),
    color: 'black',
    textAlign: 'center',
  },
  moreButton: {
    alignSelf: 'center',
    width: responsiveWidth(90),
    height: responsiveHeight(5),
    minHeight: responsiveHeight(6),
  },
  moreButtonText: {
    fontSize: responsiveFontSize(6),
    color: 'white',
    fontWeight: 'bold',
    lineHeight: responsiveFontSize(10),
  },
  loadingText: {
    fontSize: responsiveFontSize(5),
    textAlign: 'center',
    marginTop: responsiveHeight(10),
  },
  errorText: {
    color: 'red',
    fontSize: responsiveFontSize(5),
    textAlign: 'center',
    marginTop: responsiveHeight(5),
  },
});

export default GeneralRecommendedBooks;
