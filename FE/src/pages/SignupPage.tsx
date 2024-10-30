// src/pages/LoginPage.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import Btn from '../components/Btn';
import InputBox from '../components/InputBox';
import PageWrapper from '../components/PageWrapper';

type LoginPageNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

type Props = {
  navigation: LoginPageNavigationProp;
};

const SignupPage: React.FC<Props> = ({ navigation }) => {
  const [ isDisabled, setIsDisabled ] = useState<boolean>(true);
  const [ isMan, setIsMan ] = useState<boolean>(true);

  const [ birthday, setBirthday ] = useState<string>('');
  const [ password, setPassword ] = useState<string>('');
  const [ passwordConfirm, setPasswordConfirm ] = useState<string>('');
  const [ nickname, setNickname ] = useState<string>('');
  const [ email, setEmail ] = useState<string>('');
  const [ isEmailChecked, setIsEmailChecked ] = useState<boolean>(false);

  const handleEmailCheck = (): void => {
    console.log('이메일 체크 진행');
    // true 대신 나중에 성공 조건과 API 연결 추가
    if (true) {
      setIsEmailChecked(true);
    }
  }

  return (
    <PageWrapper>
      <Text style={styles.title}>회원가입</Text>
      <Btn
      title='가입하기'
      btnSize={2}
      onPress={() => console.log("눌림")}
      style={{marginBottom: 20}}
      />

      <View style={{width: '100%', flexDirection: 'row', justifyContent: 'space-between' }}>
      <Btn
      isWhite={!isDisabled}
      title='장애인'
      btnSize={0}
      onPress={() => setIsDisabled(true)}
      style={{marginBottom: 20}}
      />
      <Btn
      isWhite={isDisabled}
      title='비장애인'
      btnSize={0}
      onPress={() => setIsDisabled(false)}
      style={{marginBottom: 20}}
      />
      </View>

      <View style={{width: '100%', flexDirection: 'row', justifyContent: 'space-between' }}>
      <Btn
      isWhite={!isMan}
      title='남성'
      btnSize={0}
      onPress={() => setIsMan(true)}
      style={{marginBottom: 20}}
      />
      <Btn
      isWhite={isMan}
      title='여성'
      btnSize={0}
      onPress={() => setIsMan(false)}
      style={{marginBottom: 20}}
      />
      </View>

      <InputBox
      value={birthday}
      onChangeText={setBirthday}
      placeholder='생년월일'
      />
      <InputBox
      value={passwordConfirm}
      onChangeText={setPasswordConfirm}
      placeholder='비밀번호 확인'
      secureTextEntry={true}
      />
      <InputBox
      value={password}
      onChangeText={setPassword}
      placeholder='비밀번호'
      secureTextEntry={true}
      />
      <InputBox
      value={nickname}
      onChangeText={setNickname}
      placeholder='닉네임'
      />
      <Btn
      isWhite={!isEmailChecked}
      title='이메일 확인'
      onPress={handleEmailCheck}
      style={{maxHeight: 60}}
      />
      <InputBox
      value={email}
      onChangeText={setEmail}
      placeholder='이메일'
      />
      <Btn
      isWhite={true}
      title='로그인'
      onPress={() => navigation.navigate('Login')}
      style={{marginVertical: 40}}
      />
      <View style={{width: '100%', height: 300}} accessible={false}/>
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

export default SignupPage;
