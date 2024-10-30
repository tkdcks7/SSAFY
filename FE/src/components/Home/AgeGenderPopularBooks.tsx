import React from 'react';
import { View, Text, StyleSheet, Image, Dimensions, ScrollView } from 'react-native';
import book7Image from '../../assets/images/books/book7.png';
import book8Image from '../../assets/images/books/book8.png';
import book9Image from '../../assets/images/books/book9.png';

const { width, height } = Dimensions.get('window');

const responsiveFontSize = (factor: number) => width * (factor / 100);
const responsiveWidth = (factor: number) => width * (factor / 100);
const responsiveHeight = (factor: number) => height * (factor / 100);

const AgeGenderPopularBooks: React.FC = () => {
  const dummyBooks = {
    bookList: [
      {
        bookId: 7,
        cover: book7Image,
        coverAlt: '도둑맞은 집중력 표지',
        title: '도둑맞은 집중력',
        author: '요한 하리',
        publisher: '부키',
        story: '현대 사회에서 집중력이 사라지고 있는 이유와 이를 되찾기 위한 방법을 탐구한 책.',
      },
      {
        bookId: 8,
        cover: book8Image,
        coverAlt: '총, 균, 쇠 표지',
        title: '총, 균, 쇠',
        author: '재레드 다이아몬드',
        publisher: '문학사상',
        story: '인류 문명의 발전과 그 불평등의 원인을 분석한 과학적 역사서.',
      },
      {
        bookId: 9,
        cover: book9Image,
        coverAlt: '거인의 노트 표지',
        title: '거인의 노트',
        author: '팀 페리스',
        publisher: '토네이도',
        story: '세계적인 거인들의 성공적인 삶과 지혜를 엿볼 수 있는 인터뷰 모음집.',
      }
    ],
    criterion: '20대 남성 인기도서'
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
});

export default AgeGenderPopularBooks;
