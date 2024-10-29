// src/pages/LoginPage.tsx
import React, { useState } from 'react';
import { Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';

import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import PageWrapper from '../components/PageWrapper';


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
      <TextInput
        style={styles.input}
        placeholder="이메일"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="비밀번호"
        value={password}
        onChangeText={setPassword}
        secureTextEntry={true}
      />
      <TouchableOpacity style={styles.button}
        onPress={() => navigation.navigate('Home')}
      >
        <Text style={styles.buttonText}>로그인</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.buttonSecond}
        onPress={() => navigation.navigate('Home')}
      >
        <Text style={styles.buttonTextSecond}>회원가입</Text>
      </TouchableOpacity>
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
  button: {
    backgroundColor: '#3943B7',  // 버튼 배경색
    width: '100%',
    height: '15%',
    borderRadius: 5,  // 둥근 모서리
    justifyContent: 'center',
    alignItems: 'center',
    // 조정부분
    marginTop: 80,
    marginBottom: 40,
  },
  buttonText: {
    color: 'white',  // 텍스트 색상
    fontSize: 36,    // 텍스트 크기
    fontWeight: 'bold',
  },
  buttonSecond: {
    backgroundColor: 'white',  // 버튼 배경색
    width: '100%',
    height: '15%',
    minHeight: 80,
    borderRadius: 5,  // 둥근 모서리
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#3943B7',
    // 조정부분
    marginBottom: 80,
  },
  buttonTextSecond: {
    color: '#3943B7',  // 텍스트 색상
    fontSize: 36,    // 텍스트 크기
    fontWeight: 'bold',
  },
  input: {
    width: '100%',
    height: '10%',
    fontSize: 36,
    minHeight: 80,
    maxHeight: 120,
    backgroundColor: '#E0E0E0',
    paddingHorizontal: 10,
    marginTop: 20,
  },

});


export default LoginPage;
