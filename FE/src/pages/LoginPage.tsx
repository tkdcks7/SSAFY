// src/pages/LoginPage.tsx
import React, { useState, useRef, useEffect } from 'react';
import { Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';

import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import PageWrapper from '../components/PageWrapper';
import Btn from '../components/Btn';
import InputBox from '../components/InputBox';
import apiAnonymous from '../utils/apiAnonymous';
import useUserStore from '../store/userStore';


type LoginPageNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

type Props = {
  navigation: LoginPageNavigationProp;
};

const LoginPage: React.FC<Props> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  const loginRef = useRef<React.ElementRef<typeof TouchableOpacity>>(null);

  const { setCookie } = useUserStore();

  // 진입 시 포커스 자동 설정
  useEffect(() => {
    emailRef.current?.focus();
  }, []);

  const isValidEmail = (): void => {
    // 이메일 유효성 검사용 정규표현식
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(emailRegex.test(email)) {
      passwordRef.current?.focus();
    } else {
      emailRef.current?.focus();
      // 오류 tts 음성 작성
    }
  };

  const isValidPassword = (): void => {
    const passwordRegex = /^[A-Za-z0-9!@#$\-_]{8,30}$/;
    if (passwordRegex.test(password)) {
      loginRef.current?.focus();
    } else {
      // 오류 tts 음성 출력
      passwordRef.current?.focus();
    }
  };

  const handleLogin = (): void => {
    const data = {
      email,
      password,
    };
    apiAnonymous.post('/auth/login', data, { withCredentials: true })
    .then(response => {
      console.log(`email = ${email}, password = ${password}`);
      // clearCookie();
      console.log(`response.headers = ${response.headers}`);
      const setCookieHeader = response.headers['set-cookie'];
      // console.log(typeof setCookieHeader);
      if (setCookieHeader) {
        setCookie(setCookieHeader[0]);
        navigation.navigate('Home');
      }
    })
    .catch(error => {
      console.error('로그인 요청 실패:', error);
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
        ref={emailRef}
      />
      <InputBox
        placeholder="비밀번호"
        value={password}
        onChangeText={setPassword}
        onSubmitEditing={isValidPassword}
        secureTextEntry={true}
        ref={passwordRef}
      />
      <Btn
        title='로그인'
        onPress={handleLogin}
        ref={loginRef}
        style={{ marginTop: 50, marginBottom: 30 }}
      />
      <Btn
        isWhite={true}
        title='회원가입'
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
});


export default LoginPage;
