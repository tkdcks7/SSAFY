import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Dimensions, AccessibilityInfo, Alert } from 'react-native';
import MyPageHeader from '../../components/MyPage/MyPageHeader';
import { useNavigation, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { updateReview } from '../../services/Mypage/MyReview';

const { width, height } = Dimensions.get('window');

type MyReviewEditScreenRouteProp = RouteProp<RootStackParamList, 'MyReviewEdit'>;

type MyReviewEditPageProps = {
  route: MyReviewEditScreenRouteProp;
};

const MyReviewEditPage: React.FC<MyReviewEditPageProps> = ({ route }) => {
  const navigation = useNavigation();
  const { reviewId, title, content: initialContent, score: initialScore, updatedAt } = route.params;

  const [content, setContent] = useState(initialContent);
  const [score, setScore] = useState(initialScore);

  const handleSaveChanges = async () => {
    const updatedData: { score?: number; content?: string } = {};

    if (score !== initialScore) {
      updatedData.score = score;
    }
    if (content !== initialContent) {
      updatedData.content = content;
    }

    if (Object.keys(updatedData).length > 0) {
      try {
        await updateReview(reviewId, updatedData);
        AccessibilityInfo.announceForAccessibility('리뷰 수정이 완료되었습니다.');
        navigation.navigate('MyReview', { refresh: true });
      } catch (error: any) {
        Alert.alert('오류', error.message || '리뷰 수정 중 문제가 발생했습니다.');
        AccessibilityInfo.announceForAccessibility('리뷰 수정 중 오류가 발생했습니다.');
      }
    } else {
      Alert.alert('알림', '변경된 내용이 없습니다.');
      AccessibilityInfo.announceForAccessibility('변경된 내용이 없습니다.');
    }
  };

  return (
    <View style={styles.container}>
      <MyPageHeader title="리뷰 수정" />
      <View style={styles.contentContainer}>
        <Text style={styles.title}>{title}</Text>
        <TextInput
          style={styles.textArea}
          multiline
          value={content}
          onChangeText={(text) => {
            setContent(text);
            AccessibilityInfo.announceForAccessibility('리뷰 내용이 수정되었습니다.');
          }}
          accessibilityLabel="리뷰 내용 입력란"
        />
        <Text style={styles.ratingLabel}>평점</Text>
        <View style={styles.ratingContainer}>
          {[1, 2, 3, 4, 5].map((value) => (
            <TouchableOpacity
              key={value}
              onPress={() => {
                setScore(value);
                AccessibilityInfo.announceForAccessibility(`평점이 ${value}점으로 변경되었습니다.`);
              }}
              accessibilityLabel={`${value}점 선택 버튼`}
            >
              <Text style={value === score ? styles.selectedRating : styles.rating}>{value}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text style={styles.updatedAt}>{updatedAt}</Text>
        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSaveChanges}
          accessibilityLabel="리뷰 수정 확인 버튼"
        >
          <Text style={styles.saveButtonText}>확인</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => {
            AccessibilityInfo.announceForAccessibility('리뷰 수정을 취소하고 이전 화면으로 돌아갑니다.');
            navigation.goBack();
          }}
          accessibilityLabel="리뷰 수정 취소 버튼"
        >
          <Text style={styles.cancelButtonText}>취소</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: width * 0.05,
  },
  title: {
    fontSize: width * 0.08,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: height * 0.03,
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: width * 0.04,
    height: height * 0.2,
    fontSize: width * 0.05,
    marginBottom: height * 0.03,
  },
  ratingLabel: {
    fontSize: width * 0.07,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: height * 0.01,
  },
  ratingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  rating: {
    fontSize: width * 0.1,
    color: '#000000',
  },
  selectedRating: {
    fontSize: width * 0.15,
    color: '#3943B7',
    fontWeight: 'bold',
  },
  updatedAt: {
    fontSize: width * 0.04,
    color: '#666',
    textAlign: 'right',
    marginBottom: height * 0.02,
  },
  saveButton: {
    height: height * 0.08,
    backgroundColor: '#3943B7',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginBottom: height * 0.02,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: width * 0.05,
    fontWeight: 'bold',
  },
  cancelButton: {
    height: height * 0.08,
    borderWidth: 2,
    borderColor: '#3943B7',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  cancelButtonText: {
    color: '#3943B7',
    fontSize: width * 0.05,
    fontWeight: 'bold',
  },
});

export default MyReviewEditPage;
