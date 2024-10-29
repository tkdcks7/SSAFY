import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, Image } from 'react-native';
import Btn from '../Btn';
import book1Image from '../../assets/images/books/book1.png'; // 이미지 import

const { width, height } = Dimensions.get('window');

const responsiveFontSize = (factor) => width * (factor / 100);

const AccessibilityBookIntro: React.FC = () => {
  const dummyBooks = [
    {
      id: '1',
      title: '1984',
      author: '조지 오웰',
      publisher: '민음사',
      description: '『1984』는 현대 사회의 전체주의적 경향이 도달하게 될 종말을 기묘하게 묘사한 근미래소설이다.',
      image: book1Image,
    },
    // 다른 책 데이터들 추가
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>추천 도서</Text>
      <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollViewContent}>
        {dummyBooks.map((book) => (
          <View key={book.id} style={styles.bookContainer} accessible={true} accessibilityLabel={`추천 도서: ${book.title}, 작가: ${book.author}, 출판사: ${book.publisher}, 소개: ${book.description}`}>
            <View style={styles.bookTopSection}>
              <Image source={book.image} style={styles.bookImage} accessibilityLabel={`${book.title} 표지`} />
              <View style={styles.bookInfo}>
                <Text style={styles.bookTitle} accessibilityLabel={`책 제목 ${book.title}`}>{book.title}</Text>
                <Text style={styles.bookAuthor} accessibilityLabel={`작가 이름 ${book.author}`}>{book.author}</Text>
                <Text style={styles.bookPublisher} accessibilityLabel={`출판사 ${book.publisher}`}>{book.publisher}</Text>
              </View>
            </View>
            <Text style={styles.bookDescription} accessibilityLabel={`책 소개 ${book.description}`}>{book.description}</Text>
          </View>
        ))}
      </ScrollView>
      <Btn
        title="다른 추천 더보기"
        onPress={() => console.log('다른 추천 더보기 버튼 클릭됨')}
        btnSize={2}
        style={styles.moreButton}
        textStyle={styles.moreButtonText}
        accessibilityLabel="다른 추천 도서 보기"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: '5%',
  },
  title: {
    fontSize: responsiveFontSize(10),
    fontWeight: 'bold',
    textAlign: 'center',
  },
  scrollViewContent: {
    alignItems: 'center',
  },
  bookContainer: {
    width: width * 0.9,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: '3%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    overflow: 'hidden',
  },
  bookTopSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: '3%',
  },
  bookImage: {
    width: '30%',
    height: undefined,
    aspectRatio: 2 / 3,
    backgroundColor: '#e0e0e0',
    marginLeft: '5%',
  },
  bookInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  bookTitle: {
    fontSize: responsiveFontSize(12),
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: '1%',
  },
  bookAuthor: {
    fontSize: responsiveFontSize(8),
    textAlign: 'center',
    marginBottom: '1%',
  },
  bookPublisher: {
    fontSize: responsiveFontSize(6),
    marginBottom: '1%',
    textAlign: 'center',
  },
  bookDescription: {
    fontSize: responsiveFontSize(6),
    marginTop: '3%',
    textAlign: 'left',
    flexWrap: 'wrap',
  },
  moreButton: {
    alignSelf: 'center',
    marginTop: '1%',
    marginBottom: '10%',
  },
  moreButtonText: {
    fontSize: responsiveFontSize(10),
    color: 'white',
  },
});

export default AccessibilityBookIntro;
