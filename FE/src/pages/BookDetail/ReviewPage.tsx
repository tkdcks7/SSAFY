// 추가 구현해야 할 것 : 리뷰 실제 수정 , 삭제 요청 연결

import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Modal,  AccessibilityInfo } from 'react-native';
import CustomHeader from '../../components/CustomHeader';
import { dummyInitialReviewResponse, dummyLoadMoreReviewResponse } from '../../data/dummyReview';
import styles from '../../styles/BookDetail/ReviewPageStyle';

// 인터페이스 정의
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
  const [reviewList, setReviewList] = useState<Review[]>([]);
  const [memberReview, setMemberReview] = useState<MemberReview | null>(null);
  const [lastDateTime, setLastDateTime] = useState<string | null>(null);
  const [lastId, setLastId] = useState<number | null>(null);
  const [newReviewContent, setNewReviewContent] = useState<string>('');
  const [newReviewScore, setNewReviewScore] = useState<number>(0);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [expandedReviews, setExpandedReviews] = useState<Set<number>>(new Set());

  useEffect(() => {
    // 실제 API 호출 대신 더미 데이터 사용
    const initialData = dummyInitialReviewResponse;
    setMemberReview(initialData.memberReview);
    setReviewList(initialData.reviewList);
    setLastDateTime(initialData.lastDateTime);
    setLastId(initialData.lastId);
  }, []);

  const handleLoadMore = () => {
    if (lastDateTime && lastId) {
      // 더미 데이터 추가로 불러오기
      const loadMoreData = dummyLoadMoreReviewResponse;
      setReviewList((prev) => [...prev, ...loadMoreData.reviewList]);
      setLastDateTime(loadMoreData.lastDateTime);
      setLastId(loadMoreData.lastId);
    }
  };

  const handleReviewSubmit = () => {
    if (newReviewScore === 0) return; // 평점이 선택되지 않으면 작성 불가

    if (isEditing) {
      // 리뷰 수정 요청 로직 (API 호출)
      setIsEditing(false);
      if (memberReview) {
        setMemberReview({
          ...memberReview,
          content: newReviewContent,
          score: newReviewScore,
          updatedAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
        });
      }
      AccessibilityInfo.announceForAccessibility('리뷰가 수정되었습니다.');
    } else {
      // 리뷰 작성 요청 로직 (API 호출)
      setMemberReview({
        reviewId: Date.now(), // 임시로 생성한 reviewId
        content: newReviewContent,
        score: newReviewScore,
        updatedAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
      });
      AccessibilityInfo.announceForAccessibility('리뷰가 작성되었습니다.');
    }

    // 입력 폼 초기화
    setNewReviewContent('');
    setNewReviewScore(0);
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

  const handleDelete = () => {
    setShowDeleteModal(true);
    AccessibilityInfo.announceForAccessibility('리뷰 삭제 확인 모달이 나타났습니다.');
  };

  const confirmDelete = () => {
    setShowDeleteModal(false);
    setMemberReview(null);
    setNewReviewContent('');
    setNewReviewScore(0);
    AccessibilityInfo.announceForAccessibility('리뷰가 삭제되었습니다.');
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

  const renderMemberReview = () => (
    <View style={styles.memberReviewContainer}>
      <View style={styles.reviewHeader}>
        <Text style={styles.memberReviewText}>나의 리뷰</Text>
        <View style={styles.ratingContainer}>
          {[...Array(5)].map((_, index) => (
            <Text
              key={index}
              style={index < memberReview!.score ? styles.starFilled : styles.starEmpty}
              accessibilityLabel={`별점 ${index + 1} ${index < memberReview!.score ? '채워짐' : '비어있음'}`}
            >
              ★
            </Text>
          ))}
        </View>
      </View>
      <Text style={styles.memberReviewContent}>
        {expandedReviews.has(memberReview!.reviewId) ? memberReview!.content : memberReview!.content.slice(0, 100)}
        {memberReview!.content.length > 100 && (
          <Text
            style={styles.moreButton}
            onPress={() => toggleExpandReview(memberReview!.reviewId)}
            accessibilityRole="button"
            accessibilityLabel={expandedReviews.has(memberReview!.reviewId) ? '접기' : '더보기'}
          >
            {expandedReviews.has(memberReview!.reviewId) ? ' [접기]' : ' [더보기]'}
          </Text>
        )}
      </Text>
      <TouchableOpacity
        style={styles.modifyButton}
        onPress={handleModify}
        accessibilityRole="button"
        accessibilityLabel="리뷰 수정"
      >
        <Text style={styles.modifyButtonText}>수정</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={handleDelete}
        accessibilityRole="button"
        accessibilityLabel="리뷰 삭제"
      >
        <Text style={styles.deleteButtonText}>삭제</Text>
      </TouchableOpacity>
    </View>
  );

  const renderReviewInput = () => (
    <View style={styles.reviewInputContainer}>
      <Text style={styles.ratingLabel}>평점</Text>
      <View style={styles.ratingContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity
            key={star}
            onPress={() => setNewReviewScore(star)}
            accessibilityRole="button"
            accessibilityLabel={`별점 ${star}점`}
            accessibilityHint="별점을 선택합니다."
          >
            <Text
              style={[
                styles.star,
                newReviewScore === star && styles.starSelected,
              ]}
            >
              {star}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <TextInput
        style={styles.reviewInput}
        value={newReviewContent}
        onChangeText={setNewReviewContent}
        placeholder="리뷰를 남겨보세요(최대 500자)"
        maxLength={500}
        multiline // 줄바꿈 가능하도록 설정
        accessibilityLabel="리뷰 입력"
        accessibilityHint="여기에 리뷰 내용을 작성하세요."
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
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={handleCancelEdit}
          accessibilityRole="button"
          accessibilityLabel="수정 취소"
          accessibilityHint="수정을 취소하고 작성한 리뷰 내용을 원래 상태로 돌립니다."
        >
          <Text style={styles.cancelButtonText}>취소</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <CustomHeader
        title="리뷰 페이지"
        accessibilityRole="header"
        accessibilityLabel="리뷰 페이지 헤더"
      />
      {isEditing ? renderReviewInput() : memberReview ? renderMemberReview() : renderReviewInput()}
      <FlatList
        data={reviewList}
        keyExtractor={(item) => item.reviewId.toString()}
        renderItem={({ item }) => (
          <View style={styles.reviewItem}>
            <View style={styles.reviewHeader}>
              <Text style={styles.nickname}>{item.nickname}</Text>
              <View style={styles.ratingContainer}>
                {[...Array(5)].map((_, index) => (
                  <Text
                    key={index}
                    style={index < item.score ? styles.starFilled : styles.starEmpty}
                    accessibilityLabel={`별점 ${index + 1} ${index < item.score ? '채워짐' : '비어있음'}`}
                  >
                    ★
                  </Text>
                ))}
              </View>
            </View>
            <Text style={styles.reviewContent}>
              {expandedReviews.has(item.reviewId) ? item.content : item.content.slice(0, 100)}
              {item.content.length > 100 && (
                <Text
                  style={styles.moreButton}
                  onPress={() => toggleExpandReview(item.reviewId)}
                  accessibilityRole="button"
                  accessibilityLabel={expandedReviews.has(item.reviewId) ? '접기' : '더보기'}
                >
                  {expandedReviews.has(item.reviewId) ? ' [접기]' : ' [더보기]'}
                </Text>
              )}
            </Text>
            <Text style={styles.date}>{item.updatedAt}</Text>
          </View>
        )}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
      />

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

export default ReviewPage;