// src/pages/Mypage/MyReviewPage.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Alert, AccessibilityInfo } from 'react-native';
import MyPageHeader from '../../components/MyPage/MyPageHeader';
import MainFooter from '../../components/MainFooter';
import { dummyMyReview } from '../../data/dummyReview';
import { useNavigation } from '@react-navigation/native';
// import axios from 'axios';

const { width, height } = Dimensions.get('window');

const MyReviewPage: React.FC = () => {
  const navigation = useNavigation();
  const [reviews, setReviews] = useState(dummyMyReview.reviewList);

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

  return (
    <View style={styles.container}>
      <MyPageHeader title="나의 리뷰" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.topSpacing} />
        {reviews.map((review) => (
          <View key={review.reviewId} style={styles.reviewBox}>
            <View style={styles.headerContainer}>
              <Text style={styles.reviewTitle}>{review.title}</Text>
              <View style={styles.ratingContainer}>
                {[...Array(5)].map((_, index) => (
                  <Text key={index} style={index < review.score ? styles.starFilled : styles.starEmpty}>
                    ★
                  </Text>
                ))}
              </View>
            </View>
            <Text style={styles.reviewContent}>{review.content}</Text>
            <Text style={styles.reviewDate}>{review.updatedAt}</Text>
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
        ))}
      </ScrollView>
      <MainFooter />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
});

export default MyReviewPage;
