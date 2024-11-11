import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, TextInput, Alert, AccessibilityInfo, Modal } from 'react-native';
import MyPageHeader from '../../components/MyPage/MyPageHeader';
import MainFooter from '../../components/MainFooter';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { getMyReviews, deleteReview } from '../../services/Mypage/MyReview';
import styles from '../../styles/Mypage/MyReviewPageStyle';

const { width, height } = Dimensions.get('window');

const MyReviewPage: React.FC = () => {
  const navigation = useNavigation();
  const [reviews, setReviews] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedReviewId, setSelectedReviewId] = useState<number | null>(null);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const data = await getMyReviews();
      setReviews(data.reviewList);
    } catch (error: any) {
      Alert.alert('에러', error.message || '리뷰를 불러오는 중 문제가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchReviews();
    }, [])
  );

  const handleDelete = (reviewId: number) => {
    setSelectedReviewId(reviewId);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (selectedReviewId !== null) {
      try {
        await deleteReview(selectedReviewId);
        AccessibilityInfo.announceForAccessibility('리뷰가 삭제되었습니다.');
        setReviews(reviews.filter((review: any) => review.reviewId !== selectedReviewId));
      } catch (error: any) {
        Alert.alert('에러', error.message || '리뷰 삭제에 실패했습니다. 다시 시도해주세요.');
        AccessibilityInfo.announceForAccessibility('리뷰 삭제에 실패했습니다.');
      } finally {
        setShowDeleteModal(false);
        setSelectedReviewId(null);
      }
    }
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

  const filteredReviews = reviews.filter((review: any) =>
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
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity
            style={styles.clearButton}
            onPress={handleClearSearch}
            accessibilityLabel="검색 초기화 버튼"
          >
            <Text style={styles.clearButtonText}>초기화</Text>
          </TouchableOpacity>
        )}
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {loading ? (
          <Text>로딩 중...</Text>
        ) : filteredReviews.length === 0 ? (
          <Text style={styles.noReviewsText}>검색된 리뷰가 없습니다.</Text>
        ) : (
          filteredReviews.map((review: any) => (
            <View key={review.reviewId} style={styles.reviewBox}>
              <Text style={styles.reviewTitle}>{review.title}</Text>
              <View style={styles.ratingContainer}>
                  {[...Array(5)].map((_, index) => (
                    <Text
                      key={index}
                      style={index < review.score ? styles.starFilled : styles.starEmpty}
                    >
                      ★
                    </Text>
                  ))}
                </View>
              <Text style={styles.reviewContent}>{review.content}</Text>
              <View style={styles.footerContainer}>
                <Text style={styles.reviewDate}>{review.updatedAt}</Text>
              </View>
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDelete(review.reviewId)}
                >
                  <Text style={styles.deleteButtonText}>삭제</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() =>
                    handleEdit(review.reviewId, review.title, review.content, review.score, review.updatedAt)
                  }
                >
                  <Text style={styles.editButtonText}>수정</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>
      <MainFooter />

      {/* 삭제 확인 모달 */}
      <Modal transparent={true} visible={showDeleteModal} animationType="slide">
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalText}>정말 삭제할까요?</Text>
            <TouchableOpacity
              style={styles.submitButton}
              onPress={confirmDelete}
              accessibilityRole="button"
              accessibilityLabel="리뷰 삭제 확인"
            >
              <Text style={styles.submitButtonText}>확인</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setShowDeleteModal(false)}
              accessibilityRole="button"
              accessibilityLabel="리뷰 삭제 취소"
            >
              <Text style={styles.cancelButtonText}>취소</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};
export default MyReviewPage;
