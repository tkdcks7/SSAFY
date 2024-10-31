// src/pages/LoginPage.tsx
import React, { useState } from 'react';
import { Text, StyleSheet } from 'react-native';

import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import PageWrapper from '../components/PageWrapper';
import Btn from '../components/Btn';
import InputBox from '../components/InputBox';


type LoginPageNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

type Props = {
  navigation: LoginPageNavigationProp;
};

const LoginPage: React.FC<Props> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <PageWrapper>
      <Text style={styles.title}>로그인</Text>
      <InputBox
        placeholder="이메일"
        value={email}
        onChangeText={setEmail}
      />
      <InputBox
        placeholder="비밀번호"
        value={password}
        onChangeText={setPassword}
        secureTextEntry={true}
      />
      <Btn
        title='로그인'
        onPress={() => navigation.navigate('Home')}
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
