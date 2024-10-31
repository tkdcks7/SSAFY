import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, Dimensions, ScrollView } from 'react-native';
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
const responsiveWidth = (factor: number) => width * (factor / 100);
const responsiveHeight = (factor: number) => height * (factor / 100);

const GeneralRecommendedBooks: React.FC = () => {
  const recommendationCriteria = [
    '문학 카테고리 인기 도서',
    '최근 본 [아기돼지 삼형제]와/과 유사한 도서',
    '나와 비슷한 사용자가 좋아한 도서',
  ];

  const [currentCriterionIndex, setCurrentCriterionIndex] = useState(0);
  const [dummyBooks, setDummyBooks] = useState({
    bookList: [
      {
        bookId: 1,
        cover: book1Image,
        coverAlt: '1984 표지',
        title: '1984',
        author: '조지 오웰',
        publisher: '민음사',
        story: '『1984』는 현대 사회의 전체주의적 경향이 도달하게 될 종말을 기묘하게 묘사한 근미래소설이다.',
      },
      {
        bookId: 2,
        cover: book2Image,
        coverAlt: '멋진 신세계 표지',
        title: '멋진 신세계',
        author: '올더스 헉슬리',
        publisher: '소담출판사',
        story: '『멋진 신세계』는 인간의 자유와 본성이 기술과 과학에 의해 어떻게 억압될 수 있는지를 보여주는 명작이다.',
      },
      {
        bookId: 3,
        cover: book3Image,
        coverAlt: '동물 농장 표지',
        title: '동물 농장',
        author: '조지 오웰',
        publisher: '민음사',
        story: '『동물 농장』은 전체주의 사회를 풍자한 조지 오웰의 대표적인 우화 소설이다.',
      },
    ],
    criterion: recommendationCriteria[0],
  });

  const handleMoreRecommendations = () => {
    // 추천 도서 기준을 변경하는 로직
    const nextCriterionIndex = (currentCriterionIndex + 1) % recommendationCriteria.length;
    setCurrentCriterionIndex(nextCriterionIndex);

    // 기준에 따라 더미 데이터를 변경 (실제 API 요청으로 대체 가능)
    let newBookList;
    if (nextCriterionIndex === 1) {
      newBookList = [
        {
          bookId: 4,
          cover: book4Image,
          coverAlt: '앤디 위어 - 헤일 메리 표지',
          title: '앤디 위어 - 헤일 메리',
          author: '앤디 위어',
          publisher: 'RHK',
          story: '과학적 사고를 바탕으로 지구를 구하기 위한 한 남자의 이야기.',
        },
        {
          bookId: 5,
          cover: book5Image,
          coverAlt: '채식주의자 표지',
          title: '채식주의자',
          author: '한강',
          publisher: '창비',
          story: '한 여성이 채식주의자가 되면서 벌어지는 가족과의 갈등을 그린 이야기.',
        },
        {
          bookId: 6,
          cover: book6Image,
          coverAlt: '연금술사 표지',
          title: '연금술사',
          author: '파울로 코엘료',
          publisher: '민음사',
          story: '자아 실현과 모험에 대한 영감을 주는 이야기.',
        },
      ];
    } else if (nextCriterionIndex === 2) {
      newBookList = [
        {
          bookId: 7,
          cover: book7Image,
          coverAlt: '도둑맞은 집중력 표지',
          title: '도둑맞은 집중력',
          author: '요한 하리',
          publisher: '더퀘스트',
          story: '현대 사회에서 집중력을 되찾기 위한 방법을 탐구하는 책.',
        },
        {
          bookId: 8,
          cover: book8Image,
          coverAlt: '총, 균, 쇠 표지',
          title: '총, 균, 쇠',
          author: '재레드 다이아몬드',
          publisher: '문학사상',
          story: '인류 문명의 발전과 쇠퇴를 과학적으로 설명한 역사서.',
        },
        {
          bookId: 9,
          cover: book9Image,
          coverAlt: '거인의 노트 표지',
          title: '거인의 노트',
          author: '도리스 후퍼',
          publisher: '시공사',
          story: '성장과 자아 발견을 다룬 감동적인 이야기.',
        },
      ];
    } else {
      newBookList = [
        {
          bookId: 10,
          cover: book1Image,
          coverAlt: '1984 표지',
          title: '1984 (확장판)',
          author: '조지 오웰',
          publisher: '민음사',
          story: '새로운 해설과 부록이 포함된 1984.',
        },
        {
          bookId: 11,
          cover: book2Image,
          coverAlt: '멋진 신세계 표지',
          title: '멋진 신세계 (개정판)',
          author: '올더스 헉슬리',
          publisher: '소담출판사',
          story: '새로운 번역과 추가 내용이 포함된 멋진 신세계.',
        },
        {
          bookId: 12,
          cover: book3Image,
          coverAlt: '동물 농장 표지',
          title: '동물 농장 (한정판)',
          author: '조지 오웰',
          publisher: '민음사',
          story: '새로운 일러스트가 포함된 동물 농장.',
        },
      ];
    }

    setDummyBooks({
      bookList: newBookList,
      criterion: recommendationCriteria[nextCriterionIndex],
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{dummyBooks.criterion}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.bookList}>
        {dummyBooks.bookList.map((book) => (
          <View key={book.bookId} style={styles.bookItem}>
            <Image source={book.cover} style={styles.bookImage} />
            <Text style={styles.bookTitle} numberOfLines={2} ellipsizeMode="tail">
              {book.title}
            </Text>
          </View>
        ))}
      </ScrollView>
      <Btn
        title="다른 추천 더 보기"
        btnSize={1}
        onPress={handleMoreRecommendations}
        style={styles.moreButton}
        textStyle={styles.moreButtonText}
        accessibilityLabel="다른 추천 도서 보기"
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
    aspectRatio: 2 / 3, // 이미지 비율을 유지
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
    minHeight: 50, // minHeight를 낮게 설정하여 기본 높이를 줄이기
  },
  moreButtonText: {
    fontSize: responsiveFontSize(6),
    color: 'white',
    fontWeight: 'bold',
  },
});

export default GeneralRecommendedBooks;
