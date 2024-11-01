// src/pages/Mypage/MyReviewPage.tsx
// 미구현기능 : api 연동(리뷰 조회, 리뷰 수정)

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, TextInput, Alert, AccessibilityInfo } from 'react-native';
import MyPageHeader from '../../components/MyPage/MyPageHeader';
import MainFooter from '../../components/MainFooter';
import { dummyMyReview } from '../../data/dummyReview';
import { useNavigation } from '@react-navigation/native';
// import axios from 'axios';

const { width, height } = Dimensions.get('window');

const MyReviewPage: React.FC = () => {
  const navigation = useNavigation();
  const [reviews, setReviews] = useState(dummyMyReview.reviewList);
  const [searchQuery, setSearchQuery] = useState('');

  const handleDelete = (reviewId: number) => {
    Alert.alert('삭제 확인', '정말로 이 리뷰를 삭제하시겠습니까?', [
      {
        text: '취소',
        style: 'cancel',
        onPress: () => {
          AccessibilityInfo.announceForAccessibility('리뷰 삭제가 취소되었습니다.');
        },
      },
      {
        text: '삭제',
        onPress: async () => {
          try {
            // API 요청 보내기 (DELETE 요청)
            // await axios.delete(`/api/reviews/${reviewId}`);
            AccessibilityInfo.announceForAccessibility('리뷰가 삭제되었습니다.');
            setReviews(reviews.filter((review) => review.reviewId !== reviewId));
          } catch (error) {
            console.error('리뷰 삭제 오류:', error);
            AccessibilityInfo.announceForAccessibility('리뷰 삭제에 실패했습니다. 다시 시도해주세요.');
          }
        },
      },
    ]);
  };

  const handleEdit = (reviewId: number, title: string, content: string, score: number, updatedAt: string) => {
    AccessibilityInfo.announceForAccessibility('리뷰 수정 페이지로 이동합니다.');
    navigation.navigate('MyReviewEdit', {
      reviewId,
      title,
      content,
      score,
      updatedAt,
    });
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    AccessibilityInfo.announceForAccessibility(`검색어가 입력되었습니다. 현재 검색어: ${query}`);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    AccessibilityInfo.announceForAccessibility('검색어가 초기화되었습니다.');
  };

  const filteredReviews = reviews.filter((review) =>
    review.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <MyPageHeader title="나의 리뷰" />
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="책 제목으로 검색"
          value={searchQuery}
          onChangeText={handleSearch}
          accessibilityLabel="리뷰 검색 입력란"
          accessibilityHint="책 제목을 입력하여 리뷰를 검색하세요"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity
            style={styles.clearButton}
            onPress={handleClearSearch}
            accessibilityLabel="검색 초기화 버튼"
            accessibilityHint="검색어를 초기화합니다"
          >
            <Text style={styles.clearButtonText}>초기화</Text>
          </TouchableOpacity>
        )}
      </View>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        onScroll={() => AccessibilityInfo.announceForAccessibility('리스트의 끝에 도달했습니다.')}
        scrollEventThrottle={16}
      >
        <View style={styles.topSpacing} />
        {filteredReviews.length === 0 ? (
          <Text style={styles.noReviewsText} accessibilityLabel="검색된 리뷰가 없습니다.">검색된 리뷰가 없습니다.</Text>
        ) : (
          filteredReviews.map((review) => (
            <View key={review.reviewId} style={styles.reviewBox} accessible accessibilityLabel={`리뷰 제목: ${review.title}, 평점: ${review.score}점, 작성일: ${review.updatedAt}`}>
              <View style={styles.headerContainer}>
                <Text style={styles.reviewTitle}>{review.title}</Text>
                <View style={styles.ratingContainer}>
                  {[...Array(5)].map((_, index) => (
                    <Text
                      key={index}
                      style={index < review.score ? styles.starFilled : styles.starEmpty}
                      accessibilityLabel={index < review.score ? `별 ${index + 1}점 만점 중 채워짐` : `별 ${index + 1}점 만점 중 비어 있음`}
                    >
                      ★
                    </Text>
                  ))}
                </View>
              </View>
              <Text style={styles.reviewContent}>{review.content}</Text>
              <Text style={styles.reviewDate} accessibilityLabel={`리뷰 작성일: ${review.updatedAt}`}>{review.updatedAt}</Text>
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDelete(review.reviewId)}
                  accessibilityLabel="리뷰 삭제 버튼"
                  accessibilityHint="이 버튼을 누르면 해당 리뷰가 삭제됩니다."
                >
                  <Text style={styles.deleteButtonText}>삭제</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => handleEdit(review.reviewId, review.title, review.content, review.score, review.updatedAt)}
                  accessibilityLabel="리뷰 수정 버튼"
                  accessibilityHint="이 버튼을 누르면 리뷰 수정 페이지로 이동합니다."
                >
                  <Text style={styles.editButtonText}>수정</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>
      <MainFooter />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: width * 0.03,
    marginVertical: height * 0.02,
  },
  searchInput: {
    flex: 1,
    height: height * 0.06,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: width * 0.03,
    borderRadius: 8,
    fontSize: width * 0.045,
  },
  clearButton: {
    marginLeft: width * 0.02,
    backgroundColor: '#3943B7',
    paddingVertical: height * 0.015,
    paddingHorizontal: width * 0.04,
    borderRadius: 8,
  },
  clearButtonText: {
    color: '#fff',
    fontSize: width * 0.04,
    fontWeight: 'bold',
  },
  scrollContent: {
    paddingBottom: height * 0.1,
    paddingHorizontal: width * 0.03,
  },
  topSpacing: {
    height: height * 0.02,
  },
  reviewBox: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: width * 0.04,
    marginBottom: height * 0.03,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: height * 0.01,
  },
  reviewTitle: {
    fontSize: width * 0.06,
    fontWeight: 'bold',
    flex: 1,
  },
  ratingContainer: {
    flexDirection: 'row',
  },
  starFilled: {
    color: '#3943B7',
    fontSize: width * 0.05,
  },
  starEmpty: {
    color: '#ccc',
    fontSize: width * 0.05,
  },
  reviewContent: {
    fontSize: width * 0.045,
    marginBottom: height * 0.01,
  },
  reviewDate: {
    fontSize: width * 0.04,
    color: '#666',
    marginBottom: height * 0.02,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  deleteButton: {
    width: width * 0.4,
    height: height * 0.06,
    borderWidth: 2,
    borderColor: '#3943B7',
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  deleteButtonText: {
    color: '#3943B7',
    fontSize: width * 0.045,
    fontWeight: 'bold',
  },
  editButton: {
    width: width * 0.4,
    height: height * 0.06,
    backgroundColor: '#3943B7',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  editButtonText: {
    color: '#FFFFFF',
    fontSize: width * 0.045,
    fontWeight: 'bold',
  },
  noReviewsText: {
    fontSize: width * 0.05,
    color: '#666',
    textAlign: 'center',
    marginTop: height * 0.02,
  },
});

export default MyReviewPage;
