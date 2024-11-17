import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, Image, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import Btn from '../Btn';
import {
  getPopularBooks,
  getDemographicsPopularBooks,
  getFavoriteCategoryBooks,
  getRecentSimilarBooks,
  getSimilarMembersBooks,
} from '../../services/HomePage/HomeRecomendedBooks'; // 5개의 함수 가져오기

const { width, height } = Dimensions.get('window');

const responsiveFontSize = (factor: number) => width * (factor / 100);
const responsiveWidth = (factor: number) => width * (factor / 100);
const responsiveHeight = (factor: number) => height * (factor / 100);

type NavigationProp = StackNavigationProp<RootStackParamList, 'BookDetail'>;

const AccessibilityBookIntro: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();

  const [books, setBooks] = useState<any[]>([]);
  const [criterion, setCriterion] = useState<string>(''); // 추천 기준
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastIndex, setLastIndex] = useState<number>(-1); // 마지막 기준 인덱스 저장

  // 추천 함수 목록
  const recommendationFunctions = [
    { func: getPopularBooks, name: '인기 도서' },
    { func: getDemographicsPopularBooks, name: '성별, 나이별 인기 도서' },
    { func: getFavoriteCategoryBooks, name: '많이 읽은 카테고리 인기 도서' },
    { func: getRecentSimilarBooks, name: '최근 본 도서와 비슷한 도서' },
    { func: getSimilarMembersBooks, name: '비슷한 유저들이 좋아한 도서' },
  ];

  useEffect(() => {
    fetchRecommendation(0); // 초기에는 첫 번째 추천 기준으로 데이터 로드
  }, []);

  const fetchRecommendation = async (index: number) => {
    setLoading(true);
    setError(null);

    try {
      const { func, name } = recommendationFunctions[index];
      const data = await func(); // API 함수 호출
      setBooks(data.bookList); // 도서 목록 업데이트
      setCriterion(name); // 추천 기준 업데이트
      setLastIndex(index); // 마지막 기준 인덱스 저장
    } catch (err: any) {
      setError(err.message || '데이터를 불러오는 중 오류가 발생했습니다.');
      Alert.alert('오류', err.message || '데이터를 불러오는 중 문제가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleMoreRecommendations = () => {
    // 마지막 기준 인덱스를 제외한 나머지 인덱스 목록 생성
    const availableIndexes = recommendationFunctions
      .map((_, index) => index)
      .filter((index) => index !== lastIndex);

    // 랜덤으로 새로운 기준 선택
    const randomIndex = availableIndexes[Math.floor(Math.random() * availableIndexes.length)];
    fetchRecommendation(randomIndex);
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
      <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollViewContent}>
        {books.slice(0, 1).map((book) => ( // 하나의 도서만 표시
          <TouchableOpacity
            key={book.bookId}
            style={styles.bookContainer}
            onPress={() => navigation.navigate('BookDetail', { bookId: book.bookId })}
            accessible={true}
            accessibilityLabel={`${book.title}, 작가: ${book.author}`}
            accessibilityHint="도서의 상세 정보를 보려면 탭하세요."
          >
            <View style={styles.bookTopSection}>
              <Image
                source={{ uri: book.cover }} // API에서 받은 도서 표지 이미지
                style={styles.bookImage}
                accessibilityLabel={`${book.title} 표지`}
              />
              <View style={styles.bookInfo}>
                <Text
                  style={styles.bookTitle}
                  accessibilityLabel={`책 제목 ${book.title}`}
                  numberOfLines={2}
                  ellipsizeMode="tail"
                >
                  {book.title}
                </Text>
                <Text
                  style={styles.bookAuthor}
                  accessibilityLabel={`작가 이름 ${book.author}`}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {book.author}
                </Text>
                <Text
                  style={styles.bookPublisher}
                  accessibilityLabel={`출판사 ${book.publisher}`}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {book.publisher}
                </Text>
              </View>
            </View>
            <Text
              style={styles.bookDescription}
              accessibilityLabel={`책 소개 ${book.story}`}
              numberOfLines={3}
              ellipsizeMode="tail"
            >
              {book.story}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <Btn
        title="다른 추천 더보기"
        onPress={handleMoreRecommendations}
        btnSize={2}
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
    // padding: responsiveWidth(5),
    paddingTop: responsiveWidth(7)
  },
  title: {
    fontSize: responsiveFontSize(7),
    fontWeight: 'bold',
    textAlign: 'center',
  },
  scrollViewContent: {
    alignItems: 'center',
  },
  bookContainer: {
    width: width * 0.95,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: responsiveWidth(1),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    overflow: 'hidden',
    marginHorizontal: responsiveWidth(2),
  },
  bookTopSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: responsiveHeight(2), //3
  },
  bookImage: {
    width: responsiveWidth(35),
    height: undefined,
    aspectRatio: 2 / 3,
    backgroundColor: '#e0e0e0',
    marginTop: responsiveWidth(2),
    marginLeft: responsiveWidth(2),
  },
  bookInfo: {
    flex: 1,
    justifyContent: 'space-between',
    marginLeft: responsiveWidth(5),
  },
  bookTitle: {
    fontSize: responsiveFontSize(8),
    textAlign: 'left',
    fontWeight: 'bold',
    marginBottom: responsiveHeight(5),
  },
  bookAuthor: {
    fontSize: responsiveFontSize(6),
    textAlign: 'left',
    fontWeight: 'bold',
    marginBottom: responsiveHeight(1),
  },
  bookPublisher: {
    fontSize: responsiveFontSize(6),
    textAlign: 'left',
    fontWeight: 'bold',
    marginBottom: responsiveHeight(1),
  },
  bookDescription: {
    fontSize: responsiveFontSize(5),
    textAlign: 'left',
    marginHorizontal: responsiveWidth(2),
    marginBottom: responsiveHeight(1)
  },
  moreButton: {
    alignSelf: 'center',
    marginBottom: responsiveHeight(9),
    width: '95%',
    // marginHorizontal: responsiveWidth(4),
  },
  moreButtonText: {
    fontSize: responsiveFontSize(11),
    color: 'white',
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

export default AccessibilityBookIntro;
