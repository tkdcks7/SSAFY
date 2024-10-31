// src/pages/Mypage/UserInfoPage.tsx
import React from 'react';
import { View, Text, StyleSheet, ScrollView, AccessibilityInfo } from 'react-native';
import MyPageHeader from '../../components/MyPage/MyPageHeader';
import MainFooter from '../../components/MainFooter';
import Btn from '../../components/Btn';
import { userInfo } from '../../data/dummyUserInfo';
import { useNavigation, StackNavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

type UserInfoScreenNavigationProp = StackNavigationProp<RootStackParamList, 'UserInfo'>;

const UserInfoPage: React.FC = () => {
  const navigation = useNavigation<UserInfoScreenNavigationProp>();

  const { name, email, nickname, birth, gender, blindFlag } = userInfo;

  return (
    <View style={styles.container} accessible={true} accessibilityLabel="회원 정보 페이지">
      <MyPageHeader title="회원 정보" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.innerContainer} accessible={true} accessibilityLabel={`닉네임 ${nickname} 님, 안녕하세요. 회원 정보를 확인하세요.`}>
          <Text style={styles.greetingText} accessibilityRole="header">
            <Text style={styles.nicknameText}>{nickname}</Text> 님, 안녕하세요.
          </Text>
          <View style={styles.infoBox} accessible={true} accessibilityLabel="회원 정보 상자">
            <Text style={styles.infoText} accessibilityLabel={`이름: ${name}`}>이름: {name}</Text>
            <Text style={styles.infoText} accessibilityLabel={`이메일: ${email}`}>이메일: {email}</Text>
            <Text style={styles.infoText} accessibilityLabel={`닉네임: ${nickname}`}>닉네임: {nickname}</Text>
            <Text style={styles.infoText} accessibilityLabel={`생년월일: ${birth}`}>생년월일: {birth}</Text>
            <Text style={styles.infoText} accessibilityLabel={`성별: ${gender}`}>성별: {gender}</Text>
            <Text style={styles.infoText} accessibilityLabel={`장애 여부: ${blindFlag ? '장애 있음' : '장애 없음'}`}>장애여부: {blindFlag ? 'O' : 'X'}</Text>
            <Btn
              title="비밀번호 수정"
              onPress={() => {
                AccessibilityInfo.announceForAccessibility('비밀번호 수정 페이지로 이동합니다.');
                navigation.navigate('PasswordEdit');
              }}
              style={styles.infoBoxButton}
              accessibilityLabel="비밀번호 수정 버튼"
            />
          </View>
          <Btn
            title="일반정보 수정"
            onPress={() => {
              AccessibilityInfo.announceForAccessibility('일반 정보 수정 페이지로 이동합니다.');
              navigation.navigate('GeneralInfoEdit', {
                nickname,
                birth,
                blindFlag,
              });
            }}
            style={styles.buttonSpacing}
            accessibilityLabel="일반 정보 수정 버튼"
          />
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
    alignItems: 'center',
  },
  greetingText: {
    fontSize: width * 0.08, // 폰트 크기 증가
    fontWeight: 'bold',
    marginBottom: height * 0.02,
  },
  nicknameText: {
    color: '#3943B7',
    fontSize: width * 0.1, // 닉네임 폰트 크기 증가
    fontWeight: 'bold',
  },
  infoBox: {
    borderWidth: 1,
    borderColor: '#000000',
    padding: width * 0.05,
    width: width * 0.8,
    marginBottom: height * 0.02,
  },
  infoText: {
    fontSize: width * 0.05,
    marginVertical: height * 0.015,
    fontWeight: 'bold',
  },
  infoBoxButton: {
    margin: height * 0.01,
    width: width * 0.6,
    height: height * 0.08,
    alignSelf: 'center',
  },
  buttonSpacing: {
    marginVertical: height * 0.01,
    width: width * 0.8,
  },
});

export default UserInfoPage;
