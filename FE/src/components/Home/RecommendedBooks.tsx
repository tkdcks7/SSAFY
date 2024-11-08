import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, Dimensions, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import Btn from '../Btn';
import { dummyRecommendedBooks } from '../../data/dummyRecommendedBooks'; // Import the dummy data

const { width, height } = Dimensions.get('window');

const responsiveFontSize = (factor: number) => width * (factor / 100);
const responsiveWidth = (factor: number) => width * (factor / 100);
const responsiveHeight = (factor: number) => height * (factor / 100);

type NavigationProp = StackNavigationProp<RootStackParamList, 'BookDetail'>;

const GeneralRecommendedBooks: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();

  const recommendationCriteria = [
    '문학 카테고리 인기 도서',
    '최근 본 [아기돼지 삼형제]와/과 유사한 도서',
    '나와 비슷한 유저가 좋아한 도서',
  ];

  const [currentCriterionIndex, setCurrentCriterionIndex] = useState(0);
  const [dummyBooks, setDummyBooks] = useState({
    bookList: dummyRecommendedBooks[0].bookList,
    criterion: recommendationCriteria[0],
  });

  const handleMoreRecommendations = () => {
    const nextCriterionIndex = (currentCriterionIndex + 1) % recommendationCriteria.length;
    setCurrentCriterionIndex(nextCriterionIndex);

    setDummyBooks({
      bookList: dummyRecommendedBooks[nextCriterionIndex].bookList,
      criterion: recommendationCriteria[nextCriterionIndex],
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{dummyBooks.criterion}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.bookList}>
        {dummyBooks.bookList.map((book) => (
          <TouchableOpacity
            key={book.bookId}
            style={styles.bookItem}
            onPress={() => navigation.navigate('BookDetail', { bookId: book.bookId })}
            accessibilityLabel={`${book.title} 도서 상세 페이지로 이동`}
            accessibilityHint="도서의 상세 정보를 확인할 수 있습니다."
          >
            <Image
              source={book.cover}
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
});

export default GeneralRecommendedBooks;
