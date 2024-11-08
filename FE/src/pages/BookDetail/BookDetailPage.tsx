// BookDetailPage.tsx
// 추가 구현해야 할거 => 다운로드 버튼(로컬 스토리지 체크), 좋아요 버튼 요청(POST)
// 실제 api 연동(도서 정보, 이 도서와 비슷한 도서, 이 도서를 좋아한 유저들이 좋아한 도서)
import React, { useEffect, useState, useRef } from 'react';
import { View, Text, ActivityIndicator, Image, ScrollView, TouchableOpacity, AccessibilityInfo } from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation/AppNavigator';
import CustomHeader from '../../components/CustomHeader';
import MainFooter from '../../components/MainFooter';
import { dummyBooksDetail } from '../../data/dummyBooksDetail';
import Carousel from '../../components/Carousel';
import styles from '../../styles/BookDetail/BookDetailPageStyle';

// 새로 분리한 컴포넌트 가져오기
import ActionButtons from '../../components/BookDetail/ActionButtons';
import RatingDistribution from '../../components/BookDetail/RatingDistribution';

// 인터페이스 정의
interface ReviewDistribution {
  average: number;
  1: number;
  2: number;
  3: number;
  4: number;
  5: number;
}

interface MemberInfo {
  cartFlag: boolean;
  likedFlag: boolean;
}

interface BookDetail {
  bookId: number;
  title: string;
  cover: any;
  coverAlt: string;
  category: string;
  author: string;
  publisher: string;
  publishedAt: string;
  story: string;
  isbn: string;
  dtype: string;
  myTtsFlag: boolean;
  reviewDistribution: ReviewDistribution;
  memberInfo: MemberInfo;
}

const BookDetailPage = () => {
  const route = useRoute<RouteProp<RootStackParamList, 'BookDetail'>>();
  const navigation = useNavigation();
  const { bookId } = route.params;
  const [bookDetail, setBookDetail] = useState<BookDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);

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

    if (scrollRef.current) {
      scrollRef.current.scrollTo({ y: 0, animated: true });
    }

    AccessibilityInfo.announceForAccessibility('도서 상세 페이지가 로드되었습니다.');
  }, [bookId]);

  // 좋아요 상태 변경 함수
  const handleLikeToggle = () => {
    if (bookDetail) {
      setBookDetail({
        ...bookDetail,
        memberInfo: {
          ...bookDetail.memberInfo,
          likedFlag: !bookDetail.memberInfo.likedFlag,
        },
      });
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3943B7" accessibilityLabel="로딩 중입니다. 잠시만 기다려 주세요." />
      </View>
    );
  }

  if (!bookDetail) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText} accessibilityLabel="도서 정보를 가져올 수 없습니다.">도서 정보를 가져올 수 없습니다.</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <CustomHeader title="도서 상세" />
      <ScrollView ref={scrollRef} contentContainerStyle={styles.container}>
        {/* 책 제목 */}
        <Text
          style={styles.bookTitleLarge}
          accessibilityLabel={`책 제목: ${bookDetail.title}`}
          accessibilityRole="header"
        >
          {bookDetail.title}
        </Text>

        <View>
          {/* 책 이미지 */}
          <Image
            source={bookDetail.cover}
            style={styles.bookImage}
            accessibilityLabel={bookDetail.coverAlt}
          />

          {/* 책 정보 */}
          <View style={styles.bookInfoContainer}>
            <Text style={styles.bookAuthor} accessibilityLabel={`작가: ${bookDetail.author}`}>
              작가: {bookDetail.author}
            </Text>
            <Text style={styles.bookPublisher} accessibilityLabel={`출판사: ${bookDetail.publisher}`}>
              출판사: {bookDetail.publisher}
            </Text>
            <Text style={styles.bookCategory} accessibilityLabel={`장르: ${bookDetail.category}`}>
              장르: {bookDetail.category}
            </Text>
          </View>

          {/* 책 줄거리 */}
          <View style={styles.bookStoryContainer}>
            <Text
              style={styles.bookStory}
              numberOfLines={isExpanded ? undefined : 3}
              accessibilityLabel={`책 줄거리: ${bookDetail.story}`}
              accessibilityHint={isExpanded ? '줄거리 접기 버튼을 누르면 줄거리 내용이 줄어듭니다.' : '더보기 버튼을 누르면 줄거리 전체를 볼 수 있습니다.'}
            >
              {bookDetail.story}
            </Text>
            {bookDetail.story.length > 120 && !isExpanded && (
              <TouchableOpacity
                onPress={() => setIsExpanded(!isExpanded)}
                accessibilityLabel="더보기"
                accessibilityHint="책 줄거리 전체를 펼쳐서 볼 수 있습니다."
              >
                <Text style={styles.moreButtonText}>{'[더보기]'}</Text>
              </TouchableOpacity>
            )}
            {isExpanded && (
              <TouchableOpacity
                onPress={() => setIsExpanded(false)}
                accessibilityLabel="접기"
                accessibilityHint="책 줄거리 내용을 줄입니다."
              >
                <Text style={styles.moreButtonText}>접기</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* 평점 분포 */}
          <RatingDistribution reviewDistribution={bookDetail.reviewDistribution} />

          {/* 버튼과 아이콘들 */}
          <ActionButtons
            navigation={navigation}
            likedFlag={bookDetail.memberInfo.likedFlag}
            cartFlag={bookDetail.memberInfo.cartFlag}
            onLikeToggle={handleLikeToggle} // 좋아요 상태 변경 함수 전달
          />

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