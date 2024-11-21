// src/pages/LoginPage.tsx
import React, {useState, useRef, useEffect} from 'react';
import {
  Text,
  StyleSheet,
  TextInput,
  View,
  Dimensions,
  AccessibilityInfo,
  Alert,
} from 'react-native';

import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../navigation/AppNavigator';
import PageWrapper from '../components/PageWrapper';
import Btn from '../components/Btn';
import InputBox from '../components/InputBox';
import apiAnonymous from '../utils/apiAnonymous';
import useUserStore from '../store/userStore';
import {useNavigation} from '@react-navigation/native';

type LoginPageNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

const {width, height} = Dimensions.get('window');

type Props = {
  navigation: LoginPageNavigationProp;
};

const LoginPage: React.FC<Props> = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);

  const {setCookie, login} = useUserStore();
  const navigation = useNavigation<LoginPageNavigationProp>();

  // 진입 시 포커스 자동 설정
  useEffect(() => {
    emailRef.current?.focus();
  }, []);

  const isValidEmail = (): void => {
    // 이메일 유효성 검사용 정규표현식
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(email)) {
      passwordRef.current?.focus();
    } else {
      setEmail('');
      emailRef.current?.focus();
      Alert.alert('오류', '이메일이 유효하지 않습니다. 다시 시도해주세요.');
      AccessibilityInfo.announceForAccessibility(
        '오류: 이메일이 유효하지 않습니다.',
      );
    }
  };

  const isValidPassword = (): void => {
    const passwordRegex = /^[A-Za-z0-9!@#$\-_]{8,30}$/;
    if (passwordRegex.test(password)) {
    } else {
      setPassword('');
      Alert.alert('오류', '비밀번호가 유효하지 않습니다. 다시 시도해주세요.');
      AccessibilityInfo.announceForAccessibility(
        '오류: 비밀번호가 유효하지 않습니다.',
      );
      passwordRef.current?.focus();
    }
  };

  const handleLogin = (): void => {
    const data = {
      email,
      password,
    };
    apiAnonymous
      .post('/auth/login', data, {withCredentials: true})
      .then(response => {
        const setCookieHeader = response.headers['set-cookie'];
        if (setCookieHeader) {
          setCookie(setCookieHeader[0]);
          const tempData = {
            name: 'temp',
            email,
            nickname: 'temp',
            birthdate: '1995-11-22',
            isDisabled: true,
            isMaile: true,
          };
          login({tempData});
          setTimeout(() => {
            navigation.reset({
              index: 0,
              routes: [{name: 'Home'}],
            });
          }, 300);
        }
      })
      .catch(error => {
        console.error('로그인 요청 실패:', error);
        setPassword('');
        AccessibilityInfo.announceForAccessibility(
          '오류: 이메일 또는 비밀번호가 유효하지 않습니다.',
        );
        emailRef.current?.focus();
      });
  };

  return (
    <PageWrapper>
      <Text style={styles.title}>로그인</Text>
      <InputBox
        placeholder="이메일"
        value={email}
        onChangeText={setEmail}
        onSubmitEditing={isValidEmail}
        onBlur={() => {
          if (email) {
            isValidEmail();
          }
        }}
        ref={emailRef}
      />
      <InputBox
        placeholder="비밀번호"
        value={password}
        onChangeText={setPassword}
        onSubmitEditing={isValidPassword}
        onBlur={() => {
          if (password) {
            isValidPassword();
          }
        }}
        secureTextEntry={true}
        ref={passwordRef}
      />
      <View style={styles.innerContainer}>
        <Text style={styles.noticeText}>
          ※ 비밀번호는 8자리 이상으로 영어 대소문자, 숫자, 특수문자를 포함해야
          합니다.
        </Text>
      </View>
      <Btn
        title="로그인"
        onPress={handleLogin}
        style={{marginTop: 50, marginBottom: 30}}
      />
      <Btn
        isWhite={true}
        title="회원가입"
        onPress={() => navigation.navigate('Signup')}
      />
    </PageWrapper>
  );
};

const styles = StyleSheet.create({
  title: {
    marginBottom: 60,
    fontSize: 48,
    fontWeight: 'bold',
    color: '#3943B7',
  },
  innerContainer: {
    marginTop: height * 0,
    alignSelf: 'flex-start',
  },
  noticeText: {
    fontSize: width * 0.045,
    alignSelf: 'flex-start',
    fontWeight: 'bold',
    color: '#666',
    marginBottom: height * 0.02,
  },
});

export default LoginPage;
