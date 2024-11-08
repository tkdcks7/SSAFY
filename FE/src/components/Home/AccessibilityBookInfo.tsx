import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import Btn from '../Btn';
import { dummyRecommendedBooks } from '../../data/dummyRecommendedBooks';

const { width, height } = Dimensions.get('window');

const responsiveFontSize = (factor: number) => width * (factor / 100);
const responsiveWidth = (factor: number) => width * (factor / 100);
const responsiveHeight = (factor: number) => height * (factor / 100);

type NavigationProp = StackNavigationProp<RootStackParamList, 'BookDetail'>;

const AccessibilityBookIntro: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();

  const recommendationCriteria = [
    '문학 카테고리 인기 도서',
    '최근 본 [아기돼지 삼형제]와/과 유사한 도서',
    '나와 비슷한 사용자가 좋아한 도서',
  ];

  const [currentCriterionIndex, setCurrentCriterionIndex] = useState(0);
  const [dummyBooks, setDummyBooks] = useState(dummyRecommendedBooks[0].bookList);

  const handleMoreRecommendations = () => {
    const nextCriterionIndex = (currentCriterionIndex + 1) % recommendationCriteria.length;
    setCurrentCriterionIndex(nextCriterionIndex);

    // 기준에 따라 더미 데이터를 변경 (실제 API 요청으로 대체 가능)
    setDummyBooks(dummyRecommendedBooks[nextCriterionIndex].bookList);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{recommendationCriteria[currentCriterionIndex]}</Text>
      <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollViewContent}>
        {dummyBooks.map((book) => (
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
                source={book.cover}
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
    padding: responsiveWidth(5),
  },
  title: {
    fontSize: responsiveFontSize(8),
    fontWeight: 'bold',
    textAlign: 'center',
  },
  scrollViewContent: {
    alignItems: 'center',
  },
  bookContainer: {
    width: width * 0.85,
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
    marginBottom: responsiveHeight(3),
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
    textAlign: 'center',
    paddingBottom: responsiveHeight(2),
    fontWeight: 'bold',
    marginBottom: responsiveHeight(1),
  },
  bookAuthor: {
    fontSize: responsiveFontSize(6),
    textAlign: 'center',
    paddingBottom: responsiveHeight(2),
    marginBottom: responsiveHeight(1),
  },
  bookPublisher: {
    fontSize: responsiveFontSize(6),
    marginBottom: responsiveHeight(1),
    textAlign: 'center',
  },
  bookDescription: {
    fontSize: responsiveFontSize(5),
    textAlign: 'left',
    flexWrap: 'wrap',
  },
  moreButton: {
    alignSelf: 'center',
    marginBottom: responsiveHeight(2),
  },
  moreButtonText: {
    fontSize: responsiveFontSize(11),
    color: 'white',
  },
});

export default AccessibilityBookIntro;
