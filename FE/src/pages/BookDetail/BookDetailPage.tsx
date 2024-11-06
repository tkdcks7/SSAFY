import React, { useEffect, useState, useRef } from 'react';
import { View, Text, ActivityIndicator, Image, ScrollView, TouchableOpacity } from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native'; // useNavigation 추가
import { RootStackParamList } from '../../navigation/AppNavigator';
import CustomHeader from '../../components/CustomHeader';
import MainFooter from '../../components/MainFooter';
import { dummyBooksDetail } from '../../data/dummyBooksDetail';
import Btn from '../../components/Btn';
import Carousel from '../../components/Carousel';
import styles from '../../styles/BookDetail/BookDetailPageStyle';

const BookDetailPage = () => {
  const route = useRoute<RouteProp<RootStackParamList, 'BookDetail'>>();
  const navigation = useNavigation(); // navigation 정의
  const { bookId } = route.params;
  const [bookDetail, setBookDetail] = useState<BookDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);

  // ScrollView 참조 생성
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    const fetchBookDetail = async () => {
      try {
        const data = dummyBooksDetail.find((book) => book.bookId === bookId) as BookDetail | undefined;
        if (data) {
          setBookDetail(data);
        }
      } catch (error) {
        console.error('Failed to fetch book detail:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookDetail();
    // 페이지가 로드될 때 스크롤 맨 위로 이동
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ y: 0, animated: true });
    }
  }, [bookId]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3943B7" />
      </View>
    );
  }

  if (!bookDetail) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>도서 정보를 가져올 수 없습니다.</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <CustomHeader title="도서 상세" />
      <ScrollView ref={scrollRef} contentContainerStyle={styles.container}>
        {/* 책 제목 */}
        <Text style={styles.bookTitleLarge}>{bookDetail.title}</Text>

        <View>
          {/* 책 이미지 */}
          <Image source={bookDetail.cover} style={styles.bookImage} accessibilityLabel={`${bookDetail.title} 표지`} />

          {/* 책 정보 */}
          <View style={styles.bookInfoContainer}>
            <Text style={styles.bookAuthor}>작가: {bookDetail.author}</Text>
            <Text style={styles.bookPublisher}>출판사: {bookDetail.publisher}</Text>
            <Text style={styles.bookCategory}>장르: {bookDetail.category}</Text>
          </View>

          {/* 책 줄거리 */}
          <View style={styles.bookStoryContainer}>
            <Text style={styles.bookStory} numberOfLines={isExpanded ? undefined : 3}>
              {bookDetail.story}
            </Text>
            {bookDetail.story.length > 120 && !isExpanded && (
              <TouchableOpacity onPress={() => setIsExpanded(!isExpanded)}>
                <Text style={styles.moreButtonText}>{'[더보기]'}</Text>
              </TouchableOpacity>
            )}
            {isExpanded && (
              <TouchableOpacity onPress={() => setIsExpanded(false)}>
                <Text style={styles.moreButtonText}>접기</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* 평점 분포 */}
          <View style={styles.reviewContainer}>
            <Text style={styles.reviewDistributionTitle}>평점 분포</Text>
            <View style={styles.starsContainer}>
              {[...Array(5)].map((_, index) => {
                const filled = index + 1 <= Math.round(bookDetail.reviewDistribution.average);
                return (
                  <Text key={index} style={filled ? styles.starFilled : styles.starEmpty}>
                    ★
                  </Text>
                );
              })}
              <Text style={styles.averageScore}>{bookDetail.reviewDistribution.average.toFixed(1)}</Text>
            </View>
            {Object.entries(bookDetail.reviewDistribution)
              .filter(([key]) => key !== 'average')
              .sort(([a], [b]) => Number(b) - Number(a))
              .map(([key, value]) => (
                <View key={key} style={styles.reviewBarContainer}>
                  <Text style={styles.reviewText}>{key}점</Text>
                  <View style={styles.reviewBar}>
                    <View style={[styles.reviewBarFill, { width: `${value}%` }]} />
                  </View>
                  <Text style={styles.reviewPercentage}>{value}%</Text>
                </View>
              ))}
          </View>

          {/* 버튼과 아이콘들 */}
          <View style={styles.buttonContainerWithMargin}>
            <View style={styles.buttonWrapper}>
              <Btn
                title="리뷰 보기"
                btnSize={1}
                onPress={() => navigation.navigate('Review', { bookId })} // 라우팅 설정
              />
            </View>
            <View style={styles.iconWrapper}>
              <Image source={require('../../assets/icons/heart.png')} style={styles.iconImage} />
            </View>
          </View>
          <View style={styles.buttonContainerWithMargin}>
            <View style={styles.buttonWrapper}>
              <Btn title="바로 보기" btnSize={1} onPress={() => {}} />
            </View>
            <View style={styles.iconWrapper}>
              <Image source={require('../../assets/icons/download2.png')} style={styles.iconImage} />
            </View>
          </View>

          {/* 캐러셀 섹션 */}
          <Text style={styles.sectionTitleLarge}>이 도서와 비슷한 도서</Text>
          <Carousel
            items={dummyBooksDetail
              .filter((book) => book.bookId !== bookId)
              .map((book) => ({
                bookId: book.bookId,
                cover: book.cover,
                title: book.title,
              }))}
          />
          {/* 추가된 섹션: 이 도서를 좋아한 유저들이 좋아한 도서 */}
          <Text style={styles.sectionTitleLarge}>이 도서를 좋아한 유저들이 좋아한 도서</Text>
          <Carousel
            items={dummyBooksDetail
              .filter((book) => book.bookId !== bookId)
              .map((book) => ({
                bookId: book.bookId,
                cover: book.cover,
                title: book.title,
              }))}
          />
        </View>
      </ScrollView>
      <View>
        <MainFooter />
      </View>
    </View>
  );
};

export default BookDetailPage;
