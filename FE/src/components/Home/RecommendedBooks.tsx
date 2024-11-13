import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, Dimensions, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import Btn from '../Btn';
import {
  getRecentSimilarBooks,
  getSimilarMembersBooks,
  getFavoriteCategoryBooks,
} from '../../services/HomePage/HomeRecomendedBooks'; // API 함수 가져오기

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
    { func: getRecentSimilarBooks, name: '최근 본 도서와 비슷한 도서' },
    { func: getSimilarMembersBooks, name: '비슷한 유저들이 좋아한 도서' },
    { func: getFavoriteCategoryBooks, name: '많이 읽은 카테고리 인기도서' },
  ];

  useEffect(() => {
    fetchRecommendation(2); // 첫 로드 시 '많이 읽은 카테고리 인기도서'를 기본으로 설정 (index 2)
  }, []);

  const fetchRecommendation = async (index: number) => {
    setLoading(true);
    setError(null);

    try {
      const { func, name } = recommendationFunctions[index];
      const data = await func(); // 선택된 API 함수 호출
      setBooks(data.bookList);
      setCriterion(name);
      setLastIndex(index); // 마지막으로 사용된 추천 기준 인덱스를 저장
    } catch (err: any) {  // 여기서 변수명을 error 대신 err로 변경
      setError(err.message || '데이터를 불러오는 중 오류가 발생했습니다.');
      Alert.alert('오류', err.message || '데이터를 불러오는 중 문제가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleMoreRecommendations = () => {
    // 마지막으로 사용된 추천 기준을 제외한 인덱스 리스트 생성
    const availableIndexes = recommendationFunctions
      .map((_, index) => index)
      .filter((index) => index !== lastIndex);

    // 사용 가능한 인덱스 중 랜덤 선택
    const randomIndex = availableIndexes[Math.floor(Math.random() * availableIndexes.length)];
    fetchRecommendation(randomIndex); // 랜덤으로 API 호출
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
      <Text style={styles.title}>{criterion}</Text>
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
              source={{ uri: book.cover }} // 실제 API에서 받은 이미지 URL 사용
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
    paddingHorizontal: responsiveWidth(2),
    alignItems: 'center',
  },
  bookItem: {
    width: responsiveWidth(28),
    marginRight: responsiveWidth(2),
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
  moreButton: {
    alignSelf: 'center',
    width: responsiveWidth(80),
    height: responsiveHeight(5),
    marginTop: responsiveHeight(2),
    minHeight: responsiveHeight(6),
  },
  moreButtonText: {
    fontSize: responsiveFontSize(6),
    color: 'white',
    fontWeight: 'bold',
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

export default GeneralRecommendedBooks;
