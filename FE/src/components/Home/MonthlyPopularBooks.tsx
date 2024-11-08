import React from 'react';
import { View, Text, StyleSheet, Image, Dimensions, ScrollView, TouchableOpacity, AccessibilityInfo } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import book4Image from '../../assets/images/books/book4.png';
import book5Image from '../../assets/images/books/book5.png';
import book6Image from '../../assets/images/books/book6.png';

const { width, height } = Dimensions.get('window');

const responsiveFontSize = (factor: number) => width * (factor / 100);
const responsiveWidth = (factor: number) => width * (factor / 100);
const responsiveHeight = (factor: number) => height * (factor / 100);

type NavigationProp = StackNavigationProp<RootStackParamList, 'BookDetail'>;

const MonthlyPopularBooks: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();

  const dummyBooks = {
    bookList: [
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
    ],
    criterion: '인기 도서',
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
    minHeight: responsiveHeight(5), // 텍스트 영역의 최소 높이를 지정하여 이미지 정렬 문제 해결
  },
});

export default MonthlyPopularBooks;
