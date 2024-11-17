import React, { useState, useCallback, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Text, Alert } from 'react-native';
import MainHeader from '../../components/MainHeader';
import MainFooter from '../../components/MainFooter';
import Btn from '../../components/Btn';
import { Dimensions } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { getUserReadingStats } from '../../services/Mypage/UserInfo'; // API 함수 임포트
import { getAccessibilityMode, toggleAccessibilityMode } from '../../utils/accessibilityMode'; // 접근성 모드 함수

const { width, height } = Dimensions.get('window');

type MyPageNavigationProp = StackNavigationProp<RootStackParamList, 'MyPage'>;

const MyPage: React.FC = () => {
  const navigation = useNavigation<MyPageNavigationProp>();

  // 유저 데이터 상태 관리
  const [userStats, setUserStats] = useState<{ nickname: string; cartBookCount: number; likedBookCount: number } | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isAccessibilityMode, setIsAccessibilityMode] = useState<boolean>(true); // 접근성 모드 상태 관리

  useEffect(() => {
    const fetchAccessibilityMode = async () => {
      const mode = await getAccessibilityMode(); // 로컬에서 접근성 모드 상태 가져오기
      setIsAccessibilityMode(mode);
    };
    fetchAccessibilityMode();
  }, []);

  const fetchUserStats = async () => {
    try {
      const data = await getUserReadingStats();
      setUserStats(data);
    } catch (error: any) {
      Alert.alert('에러', error.message || '데이터를 불러오는 중 문제가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 페이지가 포커스될 때마다 API 호출
  useFocusEffect(
    useCallback(() => {
      setLoading(true); // 로딩 상태 초기화
      fetchUserStats();
    }, [])
  );

  const handleToggleAccessibility = async () => {
    const newMode = await toggleAccessibilityMode(); // 접근성 모드 토글
    setIsAccessibilityMode(newMode); // 새로운 상태 설정
  };

  return (
    <View style={styles.container}>
      <MainHeader title="마이페이지" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.innerContainer}>
          {/* 로딩 중일 때 메시지 표시 */}
          {loading ? (
            <Text>로딩 중...</Text>
          ) : userStats ? (
            <View style={styles.userInfoSection}>
              <Text style={styles.greetingText}>
                <Text style={styles.nicknameText}>{userStats.nickname}</Text> 님, 안녕하세요.{' '}
                <Text style={styles.accessibilityStatus}>
                  - 현재 접근성 상태: {isAccessibilityMode ? 'On' : 'Off'}
                </Text>
              </Text>

              <View style={styles.bookInfoBox}>
                <Text style={styles.bookInfoText}>담은 도서: {userStats.cartBookCount}권</Text>
                <Text style={styles.bookInfoText}>좋아요한 도서: {userStats.likedBookCount}권</Text>
              </View>
            </View>
          ) : (
            <Text>유저 정보를 가져올 수 없습니다.</Text>
          )}

          {/* 버튼 섹션 */}
          <View style={styles.buttonSection}>
            <Btn title="내 정보 수정" onPress={() => navigation.navigate('UserInfo')} style={styles.buttonSpacing} />
            <Btn title="나의 리뷰" onPress={() => navigation.navigate('MyReview')} style={styles.buttonSpacing} />
            <Btn title="담은 도서" onPress={() => navigation.navigate('MyBooks')} style={styles.buttonSpacing} />
            <Btn title="좋아요한 도서" onPress={() => navigation.navigate('MyLikedBooks')} style={styles.buttonSpacing} />
            <Btn
              title={`접근성 모드 ${isAccessibilityMode ? 'Off' : 'On'}`}
              onPress={handleToggleAccessibility}
              style={styles.buttonSpacing}
            />
          </View>
        </View>
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
    flexGrow: 1,
    paddingBottom: height * 0.1,
  },
  innerContainer: {
    flex: 1,
    padding: width * 0.05,
  },
  userInfoSection: {
    alignItems: 'center',
  },
  greetingText: {
    fontSize: width * 0.08,
    fontWeight: 'bold',
    marginBottom: height * 0.015,
  },
  nicknameText: {
    color: '#3943B7',
    fontSize: width * 0.1,
    fontWeight: 'bold',
  },
  accessibilityStatus: {
    fontSize: width * 0.06,
    fontWeight: 'bold',
  },
  bookInfoBox: {
    borderWidth: 1,
    borderColor: '#000000',
    paddingLeft: width * 0.05,
    width: width * 0.8,
    marginBottom: height * 0.015,
  },
  bookInfoText: {
    fontSize: width * 0.06,
    marginVertical: height * 0.005,
    fontWeight: 'bold',
  },
  buttonSection: {
    marginTop: height * 0.015,
    alignItems: 'center',
  },
  buttonSpacing: {
    marginBottom: height * 0.015,
  },
});

export default MyPage;
