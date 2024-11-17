// src/pages/LandingPage.tsx
import React from 'react';
import {Text, StyleSheet, Image} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import Logo from '../assets/images/logo.png';
import PageWrapper from '../components/PageWrapper';
import Btn from '../components/Btn';

type LandingPageNavigationProp = StackNavigationProp<RootStackParamList, 'Landing'>;

type Props = {
  navigation: LandingPageNavigationProp;
};

const LandingPage: React.FC<Props> = ({ navigation }) => {
  return (
    <PageWrapper>
      <Text style={styles.title}>AUDISAY</Text>
      <Image source={Logo} style={styles.logoRegion}/>
      <Text style={styles.explain}>모두를 위한{'\n'}e-Book 서비스</Text>
      <Text style={styles.explain}>새로운 여정을{'\n'}시작하세요</Text>
      <Btn
      onPress={() => navigation.navigate('Login')}
      title='로그인'
      style={{ marginBottom: 20 }}
      />
      <Btn
      isWhite={true}
      onPress={() => navigation.navigate('Signup')}
      title='회원가입'
      style={{ marginBottom: 20 }}
      />
    </PageWrapper>
  );
};

const styles = StyleSheet.create({
  title: {
    marginBottom: 30,
    fontSize: 48,
    fontWeight: 'bold',
    color: '#3943B7',
  },
  logoRegion: {
    // backgroundColor: 'blue',
    marginBottom: 20,
    width: 160, // 150
    height: 160, // 150
    resizeMode: 'contain',
  },
  explain: {
    fontSize: 48,
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 40,
    lineHeight: 64,
  },
});

export default LandingPage;
