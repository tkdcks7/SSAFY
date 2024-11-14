import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  Image,
  ScrollView,
  TouchableOpacity,
  AccessibilityInfo,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Alert,
} from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import CustomHeader from '../../components/CustomHeader';
import MainFooter from '../../components/MainFooter';
import styles from '../../styles/BookDetail/BookDetailPageStyle';
import Carousel from '../../components/Carousel';
import RatingDistribution from '../../components/BookDetail/RatingDistribution';
import ActionButtons from '../../components/BookDetail/ActionButtons';
import { fetchBookDetail, toggleLikeBook } from '../../services/BookDetail/BookDetail';
import { fetchSimilarBooks, fetchBooksLikedByUsers } from '../../services/BookDetail/RecomendedBooks';
import { handleScrollEndAnnouncement } from '../../utils/announceScrollEnd';

const BookDetailPage = () => {
  const route = useRoute<RouteProp<RootStackParamList, 'BookDetail'>>();
  const { bookId } = route.params;
  const [bookDetail, setBookDetail] = useState<BookDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const [similarBooks, setSimilarBooks] = useState<CarouselItem[]>([]);
  const [likedBooks, setLikedBooks] = useState<CarouselItem[]>([]);

  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    fetchData();
  }, [bookId]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await fetchBookDetail(bookId);
      setBookDetail(data);

      const similar = await fetchSimilarBooks(bookId);
      setSimilarBooks(similar.map(({ bookId, cover, title, author }) => ({
        bookId: String(bookId),
        cover,
        title,
        author,
      })));

      const liked = await fetchBooksLikedByUsers(bookId);
      setLikedBooks(liked.map(({ bookId, cover, title, author }) => ({
        bookId: String(bookId),
        cover,
        title,
        author,
      })));
    } catch (error) {
      console.error('Failed to load book detail or related books:', error);
    } finally {
      setLoading(false);
    }
  };

  // 리뷰 페이지에서 작성/수정/삭제 후 호출될 함수
  const refreshBookDetail = async () => {
    try {
      const updatedDetail = await fetchBookDetail(bookId);
      setBookDetail(updatedDetail);
    } catch (error) {
      console.error('Failed to refresh book detail:', error);
    }
  };

  const handleLikeToggle = async () => {
    if (!bookDetail) return;

    const previousLikedFlag = bookDetail.memberInfo.likedFlag;
    const updatedLikedFlag = !previousLikedFlag;

    setBookDetail({
      ...bookDetail,
      memberInfo: {
        ...bookDetail.memberInfo,
        likedFlag: updatedLikedFlag,
      },
    });

    try {
      await toggleLikeBook(bookId, updatedLikedFlag);
      AccessibilityInfo.announceForAccessibility(
        updatedLikedFlag ? '도서가 좋아요 목록에 추가되었습니다.' : '도서가 좋아요 목록에서 제거되었습니다.'
      );
    } catch (error) {
      setBookDetail((prevDetail) => {
        if (prevDetail) {
          return {
            ...prevDetail,
            memberInfo: {
              ...prevDetail.memberInfo,
              likedFlag: previousLikedFlag,
            },
          };
        }
        return prevDetail;
      });
      Alert.alert('오류', '좋아요 상태를 변경할 수 없습니다.');
    }
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    handleScrollEndAnnouncement(event);
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
        <Text style={styles.errorText} accessibilityLabel="도서 정보를 가져올 수 없습니다.">
          도서 정보를 가져올 수 없습니다.
        </Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <CustomHeader title="도서 상세" />
      <ScrollView
        ref={scrollRef}
        contentContainerStyle={styles.container}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        <Text style={styles.bookTitleLarge} accessibilityLabel={`책 제목: ${bookDetail.title}`} accessibilityRole="header">
          {bookDetail.title}
        </Text>

        <Image source={{ uri: bookDetail.cover }} style={styles.bookImage} accessibilityLabel={bookDetail.coverAlt} />

        <View style={styles.bookInfoContainer}>
          <Text style={styles.bookAuthor} accessibilityLabel={`작가: ${bookDetail.author}`}>{bookDetail.author}</Text>
          <Text style={styles.bookPublisher} accessibilityLabel={`출판사: ${bookDetail.publisher}`}>
            출판사: {bookDetail.publisher}
          </Text>
          <Text style={styles.bookCategory} accessibilityLabel={`장르: ${bookDetail.category}`}>
            장르: {bookDetail.category}
          </Text>
        </View>

        <View style={styles.bookStoryContainer}>
          <Text style={styles.bookStory} numberOfLines={isExpanded ? undefined : 3} accessibilityLabel={`책 줄거리: ${bookDetail.story}`}>
            {bookDetail.story}
          </Text>
          {bookDetail.story.length > 120 && !isExpanded && (
            <TouchableOpacity onPress={() => setIsExpanded(true)} accessibilityLabel="더보기">
              <Text style={styles.moreButtonText}>{'[더보기]'}</Text>
            </TouchableOpacity>
          )}
          {isExpanded && (
            <TouchableOpacity onPress={() => setIsExpanded(false)} accessibilityLabel="접기">
              <Text style={styles.moreButtonText}>접기</Text>
            </TouchableOpacity>
          )}
        </View>

        <RatingDistribution reviewDistribution={bookDetail.reviewDistribution} />

        <ActionButtons
          likedFlag={bookDetail.memberInfo.likedFlag}
          epubFlag={bookDetail.epubFlag}
          initialCartFlag={bookDetail.memberInfo.cartFlag}
          bookId={bookId}
          onLikeToggle={handleLikeToggle}
          refreshBookDetail={refreshBookDetail} // 리뷰 수정/삭제 후 호출
        />

        <View>
          <Text style={styles.sectionTitleLarge}>이 도서와 비슷한 도서</Text>
          <Carousel items={similarBooks} />
        </View>

        <View>
          <Text style={styles.sectionTitleLarge}>이 도서를 좋아한 이들의 추천도서</Text>
          {likedBooks.length > 0 ? (
            <Carousel items={likedBooks} />
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText} accessibilityLabel="추천 도서가 없습니다. 다른 도서를 확인해보세요.">
                아직 추천된 도서가 없습니다. 다른 도서를 확인해보세요!
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
      <MainFooter />
    </View>
  );
};

export default BookDetailPage;
