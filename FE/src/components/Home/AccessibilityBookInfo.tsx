import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, Image } from 'react-native';
import Btn from '../Btn';
import book1Image from '../../assets/images/books/book1.png';
import book2Image from '../../assets/images/books/book2.png';
import book3Image from '../../assets/images/books/book3.png';
import book4Image from '../../assets/images/books/book4.png';
import book5Image from '../../assets/images/books/book5.png';
import book6Image from '../../assets/images/books/book6.png';
import book7Image from '../../assets/images/books/book7.png';
import book8Image from '../../assets/images/books/book8.png';
import book9Image from '../../assets/images/books/book9.png';

const { width, height } = Dimensions.get('window');

const responsiveFontSize = (factor: number) => width * (factor / 100);

const AccessibilityBookIntro: React.FC = () => {
  const recommendationCriteria = [
    '문학 카테고리 인기 도서',
    '최근 본 [아기돼지 삼형제]와/과 유사한 도서',
    '나와 비슷한 사용자가 좋아한 도서',
  ];

  const [currentCriterionIndex, setCurrentCriterionIndex] = useState(0);
  const [dummyBooks, setDummyBooks] = useState([
    {
      id: '1',
      title: '1984',
      author: '조지 오웰',
      publisher: '민음사',
      description: '『1984』는 현대 사회의 전체주의적 경향이 도달하게 될 종말을 기묘하게 묘사한 근미래소설이다.',
      image: book1Image,
    },
    {
      id: '2',
      title: '멋진 신세계',
      author: '올더스 헉슬리',
      publisher: '소담출판사',
      description: '『멋진 신세계』는 인간의 자유와 본성이 기술과 과학에 의해 어떻게 억압될 수 있는지를 보여주는 명작이다.',
      image: book2Image,
    },
    {
      id: '3',
      title: '동물 농장',
      author: '조지 오웰',
      publisher: '민음사',
      description: '『동물 농장』은 전체주의 사회를 풍자한 조지 오웰의 대표적인 우화 소설이다.',
      image: book3Image,
    },
  ]);

  const handleMoreRecommendations = () => {
    // 추천 도서 기준을 변경하는 로직
    const nextCriterionIndex = (currentCriterionIndex + 1) % recommendationCriteria.length;
    setCurrentCriterionIndex(nextCriterionIndex);

    // 기준에 따라 더미 데이터를 변경 (실제 API 요청으로 대체 가능)
    let newBookList;
    if (nextCriterionIndex === 1) {
      newBookList = [
        {
          id: '4',
          title: '앤디 위어 - 헤일 메리',
          author: '앤디 위어',
          publisher: 'RHK',
          description: '과학적 사고를 바탕으로 지구를 구하기 위한 한 남자의 이야기.',
          image: book4Image,
        },
        {
          id: '5',
          title: '채식주의자',
          author: '한강',
          publisher: '창비',
          description: '한 여성이 채식주의자가 되면서 벌어지는 가족과의 갈등을 그린 이야기.',
          image: book5Image,
        },
        {
          id: '6',
          title: '연금술사',
          author: '파울로 코엘료',
          publisher: '민음사',
          description: '자아 실현과 모험에 대한 영감을 주는 이야기.',
          image: book6Image,
        },
      ];
    } else if (nextCriterionIndex === 2) {
      newBookList = [
        {
          id: '7',
          title: '도둑맞은 집중력',
          author: '요한 하리',
          publisher: '더퀘스트',
          description: '현대 사회에서 집중력을 되찾기 위한 방법을 탐구하는 책.',
          image: book7Image,
        },
        {
          id: '8',
          title: '총, 균, 쇠',
          author: '재레드 다이아몬드',
          publisher: '문학사상',
          description: '인류 문명의 발전과 쇠퇴를 과학적으로 설명한 역사서.',
          image: book8Image,
        },
        {
          id: '9',
          title: '거인의 노트',
          author: '도리스 후퍼',
          publisher: '시공사',
          description: '성장과 자아 발견을 다룬 감동적인 이야기.',
          image: book9Image,
        },
      ];
    } else {
      newBookList = [
        {
          id: '1',
          title: '1984',
          author: '조지 오웰',
          publisher: '민음사',
          description: '『1984』는 현대 사회의 전체주의적 경향이 도달하게 될 종말을 기묘하게 묘사한 근미래소설이다.',
          image: book1Image,
        },
        {
          id: '2',
          title: '멋진 신세계',
          author: '올더스 헉슬리',
          publisher: '소담출판사',
          description: '『멋진 신세계』는 인간의 자유와 본성이 기술과 과학에 의해 어떻게 억압될 수 있는지를 보여주는 명작이다.',
          image: book2Image,
        },
        {
          id: '3',
          title: '동물 농장',
          author: '조지 오웰',
          publisher: '민음사',
          description: '『동물 농장』은 전체주의 사회를 풍자한 조지 오웰의 대표적인 우화 소설이다.',
          image: book3Image,
        },
      ];
    }

    setDummyBooks(newBookList);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{recommendationCriteria[currentCriterionIndex]}</Text>
      <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollViewContent}>
        {dummyBooks.map((book) => (
          <View key={book.id} style={styles.bookContainer} accessible={true} accessibilityLabel={`추천 도서: ${book.title}, 작가: ${book.author}, 출판사: ${book.publisher}, 소개: ${book.description}`}>
            <View style={styles.bookTopSection}>
              <Image source={book.image} style={styles.bookImage} accessibilityLabel={`${book.title} 표지`} />
              <View style={styles.bookInfo}>
                <Text style={styles.bookTitle} accessibilityLabel={`책 제목 ${book.title}`} numberOfLines={2} ellipsizeMode='tail'>{book.title}</Text>
                <Text style={styles.bookAuthor} accessibilityLabel={`작가 이름 ${book.author}`} numberOfLines={1} ellipsizeMode='tail'>{book.author}</Text>
                <Text style={styles.bookPublisher} accessibilityLabel={`출판사 ${book.publisher}`} numberOfLines={1} ellipsizeMode='tail'>{book.publisher}</Text>
              </View>
            </View>
            <Text style={styles.bookDescription} accessibilityLabel={`책 소개 ${book.description}`} numberOfLines={3} ellipsizeMode='tail'>{book.description}</Text>
          </View>
        ))}
      </ScrollView>
      <Btn
        title="다른 추천 더보기"
        onPress={handleMoreRecommendations}
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
    fontSize: responsiveFontSize(8),
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
    padding: '1%',
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
    marginLeft: '5%',
  },
  bookTitle: {
    fontSize: responsiveFontSize(10),
    textAlign: 'center',
    paddingBottom: '2%',
    fontWeight: 'bold',
    marginBottom: '1%',
  },
  bookAuthor: {
    fontSize: responsiveFontSize(8),
    textAlign: 'center',
    paddingBottom: '2%',
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
    marginBottom: '3%',
  },
  moreButtonText: {
    fontSize: responsiveFontSize(10),
    color: 'white',
  },
});

export default AccessibilityBookIntro;
