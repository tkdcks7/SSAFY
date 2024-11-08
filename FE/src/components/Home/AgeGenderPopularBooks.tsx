import React from 'react';
import { View, Text, StyleSheet, Image, Dimensions, ScrollView, TouchableOpacity, AccessibilityInfo } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import book7Image from '../../assets/images/books/book7.png';
import book8Image from '../../assets/images/books/book8.png';
import book9Image from '../../assets/images/books/book9.png';

const { width, height } = Dimensions.get('window');

const responsiveFontSize = (factor: number) => width * (factor / 100);
const responsiveWidth = (factor: number) => width * (factor / 100);
const responsiveHeight = (factor: number) => height * (factor / 100);

type NavigationProp = StackNavigationProp<RootStackParamList, 'BookDetail'>;

const AgeGenderPopularBooks: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();

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

  const handlePress = (bookId: number, title: string) => {
    // TalkBack 사용자가 누른 도서의 제목을 음성으로 피드백 제공
    AccessibilityInfo.announceForAccessibility(`${title} 도서 상세 페이지로 이동합니다.`);
    navigation.navigate('BookDetail', { bookId });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title} accessibilityLabel={`${dummyBooks.criterion} 목록`}>
        {dummyBooks.criterion}
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.bookList}
        accessibilityLabel={`${dummyBooks.criterion} 도서 목록을 좌우로 스크롤하여 탐색할 수 있습니다.`}
      >
        {dummyBooks.bookList.map((book) => (
          <TouchableOpacity
            key={book.bookId}
            style={styles.bookItem}
            onPress={() => handlePress(book.bookId, book.title)}
            accessibilityLabel={`${book.title}, 저자: ${book.author}, 출판사: ${book.publisher}`}
            accessibilityHint="더 자세한 정보를 보려면 두 번 탭하세요."
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
