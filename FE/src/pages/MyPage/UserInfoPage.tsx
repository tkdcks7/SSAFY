import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, AccessibilityInfo } from 'react-native';
import MyPageHeader from '../../components/MyPage/MyPageHeader';
import MainFooter from '../../components/MainFooter';
import Btn from '../../components/Btn';
import { useNavigation, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { Dimensions } from 'react-native';
import { getUserDetails } from '../../services/Mypage/UserInfo';

const { width, height } = Dimensions.get('window');

type RouteProps = {
  params?: {
    updatedNickname?: string;
    updatedBlindFlag?: boolean;
  };
};

const UserInfoPage: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<RouteProps>();

  const [userInfo, setUserInfo] = useState<{
    name: string;
    email: string;
    nickname: string;
    birth: string;
    gender: string;
    blindFlag: boolean;
  } | null>(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const data = await getUserDetails();
        setUserInfo(data);
      } catch (error: any) {
        Alert.alert('에러', error.message || '유저 정보를 불러오는 중 문제가 발생했습니다.');
      }
    };

    fetchUserInfo();
  }, []);

  // route.params로 전달된 수정된 데이터를 감지하고 즉시 반영
  useEffect(() => {
    if (route.params?.updatedNickname || route.params?.updatedBlindFlag !== undefined) {
      setUserInfo((prev) => ({
        ...prev!,
        nickname: route.params.updatedNickname || prev?.nickname,
        blindFlag: route.params.updatedBlindFlag ?? prev?.blindFlag,
      }));
    }
  }, [route.params]);

  return (
    <View style={styles.container} accessible={true} accessibilityLabel="회원 정보 페이지">
      <MyPageHeader title="회원 정보" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View
          style={styles.innerContainer}
          accessible={true}
          accessibilityLabel={`닉네임 ${userInfo?.nickname || ''} 님, 안녕하세요. 회원 정보를 확인하세요.`}
        >
          {userInfo ? (
            <>
              <Text style={styles.greetingText} accessibilityRole="header">
                <Text style={styles.nicknameText}>{userInfo.nickname}</Text> 님, 안녕하세요.
              </Text>
              <View style={styles.infoBox} accessible={true} accessibilityLabel="회원 정보 상자">
                <Text style={styles.infoText} accessibilityLabel={`이름: ${userInfo.name}`}>이름: {userInfo.name}</Text>
                <Text style={styles.infoText} accessibilityLabel={`이메일: ${userInfo.email}`}>이메일: {userInfo.email}</Text>
                <Text style={styles.infoText} accessibilityLabel={`닉네임: ${userInfo.nickname}`}>닉네임: {userInfo.nickname}</Text>
                <Text style={styles.infoText} accessibilityLabel={`생년월일: ${userInfo.birth}`}>생년월일: {userInfo.birth}</Text>
                <Text style={styles.infoText} accessibilityLabel={`성별: ${userInfo.gender}`}>성별: {userInfo.gender}</Text>
                <Text style={styles.infoText} accessibilityLabel={`장애 여부: ${userInfo.blindFlag ? '장애 있음' : '장애 없음'}`}>
                  장애여부: {userInfo.blindFlag ? 'O' : 'X'}
                </Text>
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
                    nickname: userInfo.nickname,
                    birth: userInfo.birth,
                    blindFlag: userInfo.blindFlag,
                  });
                }}
                style={styles.buttonSpacing}
                accessibilityLabel="일반 정보 수정 버튼"
              />
            </>
          ) : (
            <Text>로딩 중...</Text>
          )}
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
    fontSize: width * 0.08,
    fontWeight: 'bold',
    marginBottom: height * 0.02,
  },
  nicknameText: {
    color: '#3943B7',
    fontSize: width * 0.1,
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
