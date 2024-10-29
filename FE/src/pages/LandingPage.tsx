// src/pages/LandingPage.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';

type LandingPageNavigationProp = StackNavigationProp<RootStackParamList, 'Landing'>;

type Props = {
  navigation: LandingPageNavigationProp;
};

const LandingPage: React.FC<Props> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>AUDISAY</Text>
      <View style={styles.logoRegion} />
      <Text style={styles.explain}>모두를 위한 eBook 서비스</Text>
      <Text style={styles.explain}>새로운 여정을 시작하세요</Text>
      <TouchableOpacity 
      style={styles.button}
      onPress={() => navigation.navigate('Login')}
      >
        <Text style={styles.buttonText}>로그인</Text>
      </TouchableOpacity>
      <TouchableOpacity 
      style={styles.buttonSecond}
      onPress={() => navigation.navigate('Login')}
      >
        <Text style={styles.buttonTextSecond}>회원가입</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    marginTop: 30,
    marginBottom: 30,
    fontSize: 48,
    fontWeight: 'bold',
    color: '#3943B7',
  },
  logoRegion: {
    backgroundColor: 'blue',
    marginBottom: 20,
    width: 150,
    height: 150,
  },
  explain: {
    marginBottom: 20,
    fontSize: 48,
    textAlign: 'center',
    fontWeight: 'bold',
    color: 'black',
  },
  button: {
    backgroundColor: '#3943B7',  // 버튼 배경색
    width: 300,
    height: 80,
    borderRadius: 5,  // 둥근 모서리
    justifyContent: 'center',
    alignItems: 'center',
    // 조정부분
    marginTop: 'auto',
    marginBottom: 40,
  },
  buttonText: {
    color: 'white',  // 텍스트 색상
    fontSize: 36,    // 텍스트 크기
    fontWeight: 'bold',
  },
  buttonSecond: {
    backgroundColor: 'white',  // 버튼 배경색
    width: 300,
    height: 80,
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
});

export default LandingPage;
