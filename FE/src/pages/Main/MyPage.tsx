// src/pages/MyPage.tsx
import React from 'react';
import { View, StyleSheet, ScrollView, Text } from 'react-native';
import MainHeader from '../../components/MainHeader';
import MainFooter from '../../components/MainFooter';
import Btn from '../../components/Btn';
import { Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { readingStats } from '../../data/dummyUserInfo';

const { width, height } = Dimensions.get('window');

type MyPageNavigationProp = StackNavigationProp<RootStackParamList, 'MyPage'>;

const MyPage: React.FC = () => {
  const navigation = useNavigation<MyPageNavigationProp>();

  // 유저 더미 데이터 (추후 실제 데이터로 대체)
  const { nickname, cartBookCount, likedBookCount } = readingStats;

  return (
    <View style={styles.container}>
      <MainHeader title="마이페이지" isAccessibilityMode={false} isUserVisuallyImpaired={true} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.innerContainer}>
          {/* 유저 정보 섹션 */}
          <View style={styles.userInfoSection}>
            <Text style={styles.greetingText}><Text style={styles.nicknameText}>{nickname}</Text> 님, 안녕하세요.</Text>
            <View style={styles.bookInfoBox}>
              <Text style={styles.bookInfoText}>담은 도서: {cartBookCount}권</Text>
              <Text style={styles.bookInfoText}>좋아요한 도서: {likedBookCount}권</Text>
            </View>
          </View>

          {/* 버튼 섹션 */}
          <View style={styles.buttonSection}>
            <Btn title="내 정보 수정" onPress={() => navigation.navigate('UserInfo')} style={styles.buttonSpacing} />
            <Btn title="나의 리뷰" onPress={() => navigation.navigate('MyReview')} style={styles.buttonSpacing} />
            <Btn title="담은 도서" onPress={() => navigation.navigate('MyBooks')} style={styles.buttonSpacing} />
            <Btn title="좋아요한 도서" onPress={() => navigation.navigate('MyLikedBooks')} style={styles.buttonSpacing} />
            <Btn title="접근성 모드 On/Off" onPress={() => {}} style={styles.buttonSpacing} />
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
