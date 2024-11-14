import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Modal, AccessibilityInfo, Alert, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import CustomHeader from '../../components/CustomHeader';
import styles from '../../styles/BookDetail/ReviewPageStyle';
import { createReview, deleteReview, updateReview, fetchReviews } from '../../services/BookDetail/BookReview';
import { useRoute } from '@react-navigation/native';
import { handleScrollEndAnnouncement } from '../../utils/announceScrollEnd'; // 스크롤 끝 감지 함수 import

interface Review {
  reviewId: number;
  nickname: string;
  content: string;
  score: number;
  updatedAt: string;
}

interface MemberReview {
  reviewId: number;
  content: string;
  score: number;
  updatedAt: string;
}

const ReviewPage = () => {
  const route = useRoute();
  const { bookId } = route.params as { bookId: number };

  const [reviewList, setReviewList] = useState<Review[]>([]);
  const [memberReview, setMemberReview] = useState<MemberReview | null>(null);
  const [lastId, setLastId] = useState<number | null>(null);
  const [newReviewContent, setNewReviewContent] = useState<string>('');
  const [newReviewScore, setNewReviewScore] = useState<number>(0);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [expandedReviews, setExpandedReviews] = useState<Set<number>>(new Set());

  useEffect(() => {
    fetchInitialReviews();
  }, [bookId]);

  const fetchInitialReviews = async () => {
    try {
      const response = await fetchReviews(bookId);
      setReviewList(response.reviewList);
      setMemberReview(response.memberReview);
      setLastId(response.lastReviewId);
    } catch (error: any) {
      Alert.alert('리뷰 조회 실패', error.message || '알 수 없는 오류');
    }
  };

  const handleLoadMore = async () => {
    if (lastId) {
      try {
        const response = await fetchReviews(bookId, lastId);
        setReviewList((prev) => [...prev, ...response.reviewList]);
        setLastId(response.lastReviewId);
      } catch (error: any) {
        Alert.alert('리뷰 더 불러오기 실패', error.message || '알 수 없는 오류');
      }
    }
  };

  const handleReviewSubmit = async () => {
    if (newReviewScore === 0) return;

    try {
      if (isEditing && memberReview) {
        await updateReview(memberReview.reviewId, newReviewScore, newReviewContent);
        setMemberReview({
          ...memberReview,
          content: newReviewContent,
          score: newReviewScore,
          updatedAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
        });
        AccessibilityInfo.announceForAccessibility('리뷰가 수정되었습니다.');
      } else {
        const newReview = await createReview(bookId, newReviewScore, newReviewContent);
        setMemberReview(newReview);
        AccessibilityInfo.announceForAccessibility('리뷰가 작성되었습니다.');
      }

      fetchInitialReviews(); // 최신 데이터를 가져와 화면 갱신
    } catch (error: any) {
      Alert.alert('리뷰 저장 실패', error.message || '알 수 없는 오류');
    }

    setNewReviewContent('');
    setNewReviewScore(0);
    setIsEditing(false);
  };

  const confirmDelete = async () => {
    if (!memberReview) return;

    try {
      await deleteReview(memberReview.reviewId);
      setMemberReview(null);
      setNewReviewContent('');
      setNewReviewScore(0);
      setShowDeleteModal(false);
      AccessibilityInfo.announceForAccessibility('리뷰가 삭제되었습니다.');
      fetchInitialReviews();
    } catch (error: any) {
      Alert.alert('리뷰 삭제 실패', error.message || '알 수 없는 오류');
    }
  };

  const handleModify = () => {
    setIsEditing(true);
    setNewReviewScore(memberReview?.score || 0);
    setNewReviewContent(memberReview?.content || '');
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setNewReviewContent('');
    setNewReviewScore(0);
  };

  const toggleExpandReview = (reviewId: number) => {
    setExpandedReviews((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(reviewId)) {
        newSet.delete(reviewId);
      } else {
        newSet.add(reviewId);
      }
      return newSet;
    });
  };

  const renderReviewInput = () => (
    <View style={styles.reviewInputContainer}>
      <Text style={styles.ratingLabel} accessibilityLabel="별점 입력">평점</Text>
      <View style={styles.ratingContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity
            key={star}
            onPress={() => setNewReviewScore(star)}
            accessibilityRole="button"
            accessibilityLabel={`별점 ${star}점`}
          >
            <Text style={[styles.star, newReviewScore === star && styles.starSelected]}>{star}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <TextInput
        style={styles.reviewInput}
        value={newReviewContent}
        onChangeText={setNewReviewContent}
        placeholder="리뷰를 남겨보세요(최대 500자)"
        maxLength={500}
        multiline
        accessibilityLabel="리뷰 입력"
      />
      <TouchableOpacity
        style={[styles.submitButton, newReviewScore === 0 && styles.submitButtonDisabled]}
        onPress={handleReviewSubmit}
        disabled={newReviewScore === 0}
        accessibilityRole="button"
        accessibilityLabel={isEditing ? '수정 완료' : '리뷰 작성'}
      >
        <Text style={styles.submitButtonText}>{isEditing ? '수정 완료' : '작성'}</Text>
      </TouchableOpacity>
      {isEditing && (
        <TouchableOpacity style={styles.cancelButton} onPress={handleCancelEdit}>
          <Text style={styles.cancelButtonText}>취소</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const renderMemberReview = () => (
    <View style={styles.memberReviewContainer}>
      <View style={styles.reviewHeader}>
        <Text style={styles.memberReviewText}>나의 리뷰</Text>
        <View style={styles.ratingContainer}>
          {[...Array(5)].map((_, index) => (
            <Text key={index} style={index < memberReview!.score ? styles.starFilled : styles.starEmpty}>
              ★
            </Text>
          ))}
        </View>
      </View>
      <Text style={styles.memberReviewContent}>
        {expandedReviews.has(memberReview!.reviewId)
          ? memberReview!.content
          : memberReview!.content.slice(0, 100)}
        {memberReview!.content.length > 100 && (
          <Text
            style={styles.moreButton}
            onPress={() => toggleExpandReview(memberReview!.reviewId)}
          >
            {expandedReviews.has(memberReview!.reviewId) ? ' [접기]' : ' [더보기]'}
          </Text>
        )}
      </Text>
      <TouchableOpacity style={styles.modifyButton} onPress={handleModify}>
        <Text style={styles.modifyButtonText}>수정</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.deleteButton} onPress={() => setShowDeleteModal(true)}>
        <Text style={styles.deleteButtonText}>삭제</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <CustomHeader title="리뷰 페이지" accessibilityLabel="리뷰 페이지 헤더" />
      {isEditing ? renderReviewInput() : memberReview ? renderMemberReview() : renderReviewInput()}
      <FlatList
        data={reviewList}
        keyExtractor={(item) => item.reviewId.toString()}
        renderItem={({ item }) => (
          <View style={styles.reviewItem}>
            <Text style={styles.nickname}>{item.nickname}</Text>
            <View style={styles.ratingContainer}>
              {[...Array(5)].map((_, index) => (
                <Text key={index} style={index < item.score ? styles.starFilled : styles.starEmpty}>
                  ★
                </Text>
              ))}
            </View>
            <Text style={styles.reviewContent}>
              {expandedReviews.has(item.reviewId) ? item.content : item.content.slice(0, 100)}
            </Text>
            {item.content.length > 100 && (
              <Text
                style={styles.moreButton}
                onPress={() => toggleExpandReview(item.reviewId)}
              >
                {expandedReviews.has(item.reviewId) ? ' [접기]' : ' [더보기]'}
              </Text>
            )}
          </View>
        )}
        onScroll={(event) => handleScrollEndAnnouncement(event)}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
      />
      <Modal transparent visible={showDeleteModal} animationType="slide">
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalText}>정말 삭제할까요?</Text>
            <TouchableOpacity style={styles.submitButton} onPress={confirmDelete}>
              <Text style={styles.submitButtonText}>확인</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={() => setShowDeleteModal(false)}>
              <Text style={styles.cancelButtonText}>취소</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ReviewPage;
