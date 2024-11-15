// src/pages/SignUpPage.tsx
import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../navigation/AppNavigator';
import Btn from '../components/Btn';
import InputBox from '../components/InputBox';
import PageWrapper from '../components/PageWrapper';
import apiAnonymous from '../utils/apiAnonymous';
import Tts from 'react-native-tts';
import useUserStore from '../store/userStore';

type SignupPageNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Signup'
>;

type Props = {
  navigation: SignupPageNavigationProp;
};

const SignupPage: React.FC<Props> = ({navigation}) => {
  const [isDisabled, setIsDisabled] = useState<boolean | null>(null);
  const [isMan, setIsMan] = useState<boolean | null>(null);
  const [birth, setbirth] = useState<string>('');
  const [nickname, setNickname] = useState<string>('');
  const [passwordConfirm, setPasswordConfirm] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isEmailChecked, setIsEmailChecked] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const [name, setName] = useState<string>('');

  const [isDisabledSelected, setIsDisabledSelected] = useState<boolean>(false);
  const [isGenderSelected, setIsGenderSelected] = useState<boolean>(false);
  const [isbirthEntered, setIsbirthEntered] = useState<boolean>(false);
  const [isNicknameEntered, setIsNicknameEntered] = useState<boolean>(false);
  const [isPasswordConfirmEntered, setIsPasswordConfirmEntered] =
    useState<boolean>(false);
  const [isPasswordEntered, setIsPasswordEntered] = useState<boolean>(false);
  const [isNameEntered, setIsNameEntered] = useState<boolean>(false);

  const isDisabledRef = useRef(null);
  const isManRef = useRef(null);
  const birthRef = useRef<TextInput>(null);
  const nicknameRef = useRef<TextInput>(null);
  const passwordConfirmRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  const emailRef = useRef<TextInput>(null);
  const nameRef = useRef<TextInput>(null);

  const [enteredCnt, setEnteredCnt] = useState<number>(0);
  const {setCookie} = useUserStore();

  useEffect(() => {
    nameRef.current?.focus();
  }, []);

  const isValidName = (): void => {
    const nameRegex = /^[A-Za-z가-힣]{2,15}$/;
    if (nameRegex.test(name)) {
      setIsNameEntered(true);
      emailRef.current?.focus();
      setEnteredCnt(enteredCnt + 1);
    } else {
      setName('');
      Tts.speak(
        '이름은 두 자 이상 열다섯 자 이하의 한글 및 영문만 입력할 수 있습니다.',
      );
      nameRef.current?.focus();
    }
  };

  const isValidEmail = (): void => {
    // 이메일 유효성 검사용 정규표현식
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(email)) {
      handleEmailCheck();
    } else {
      setEmail('');
      setTimeout(() => {
        emailRef.current?.focus();
      }, 100);
      Tts.speak('이메일 형식이 올바르지 않습니다.');
    }
  };

  const handleEmailCheck = async (): Promise<void> => {
    await apiAnonymous
      .post('/members/email-check', {email})
      .then(() => {
        setIsEmailChecked(true);
        nicknameRef.current?.focus();
        setEnteredCnt(enteredCnt + 1);
      })
      .catch(() => {
        setIsEmailChecked(false);
        setEmail('');
        Tts.speak('이미 존재하는 이메일입니다. 다른 이메일을 입력해주세요.');
        setTimeout(() => {
          emailRef.current?.focus();
        }, 100);
      });
  };

  const isValidNickname = (): void => {
    const nicknameRegex = /^[A-Za-z가-힣0-9]{2,15}$/;
    if (nicknameRegex) {
      setIsNicknameEntered(true);
      passwordRef.current?.focus();
      setEnteredCnt(enteredCnt + 1);
      // View로 포커스 이동? 생각해봐야함.
    } else {
      setNickname('');
      Tts.speak(
        '닉네임은 두 자 이상 열다섯 자 이하의 한글, 영문, 숫자만 가능합니다.',
      );
      setTimeout(() => {
        nicknameRef.current?.focus();
      }, 100);
    }
  };

  const isValidPassword = (): void => {
    const passwordRegex = /^[A-Za-z0-9!@#$\-_]{8,30}$/;
    if (passwordRegex.test(password)) {
      setIsPasswordEntered(true);
      passwordConfirmRef.current?.focus();
      setEnteredCnt(enteredCnt + 1);
    } else {
      setPassword('');
      Tts.speak(
        '비밀번호는 여덟 자 이상 서른 자 이하 영문, 숫자, 느낌표, 샵, 골뱅이, 달러, 붙임표, 밑줄문자만 가능합니다.',
      );
      setPasswordConfirm('');
      setTimeout(() => {
        passwordRef.current?.focus();
      }, 100);
    }
  };

  const isValidPasswordConfirm = (): void => {
    if (password === passwordConfirm) {
      setIsPasswordConfirmEntered(true);
      birthRef.current?.focus();
      setEnteredCnt(enteredCnt + 1);
    } else {
      Tts.speak('비밀번호와 일치하지 않습니다.');
      setTimeout(() => {
        passwordConfirmRef.current?.focus();
      }, 100);
    }
  };

  const isValidbirth = (): void => {
    const birthdateRegex = /^(19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])$/;
    if (birthdateRegex) {
      setIsbirthEntered(true);
      setEnteredCnt(enteredCnt + 1);
      // 뭔가의 포커스 이동?
    } else {
      Tts.speak(
        '생년월일은 연도 네 자리, 월 두 자리, 일 두 자리의 숫자만 입력해야 합니다.',
      );
      setbirth('');
      setTimeout(() => {
        birthRef.current?.focus();
      }, 100);
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
          navigation.navigate('Home');
        }
      })
      .catch(error => {
        console.error('로그인 요청 실패:', error);
      });
  };

  const handleSignup = () => {
    if (password !== passwordConfirm) {
      return;
    }
    const gender: string = isMan ? 'M' : 'F';
    const birthCon =
      birth.slice(0, 4) + '-' + birth.slice(4, 6) + '-' + birth.slice(6, 8);
    const data = {
      email,
      password,
      name,
      nickname,
      birth: birthCon,
      gender,
      blindFlag: isDisabled,
    };
    apiAnonymous
      .post('/members', data)
      .then(response => {
        if (response.status === 200) {
          console.log('회원가입 성공:', response.data);
          handleLogin();
        }
      })
      .catch(error => {
        console.error('회원가입 실패:', error);
      });
  };

  return (
    <PageWrapper>
      <Text style={styles.title}>회원가입</Text>
      <View
        style={{
          flex: 1,
          width: '100%',
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: `${enteredCnt * 15}%`,
        }}>
        <Btn
          title="가입하기"
          btnSize={2}
          onPress={handleSignup}
          style={
            isDisabledSelected ? styles.visibleStyle : styles.invisibleStyle
          }
        />

        <View
          style={[
            {
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: 20,
            },
            isGenderSelected ? styles.visibleStyle : styles.invisibleStyle,
          ]}>
          <Btn
            isWhite={isDisabled === null ? true : !isDisabled}
            title="장애인"
            btnSize={0}
            onPress={() => {
              setIsDisabled(true);
              setIsDisabledSelected(true);
            }}
            style={{marginBottom: 20}}
          />
          <Btn
            isWhite={isDisabled === null ? true : isDisabled}
            title="비장애인"
            btnSize={0}
            onPress={() => {
              setIsDisabled(false);
              setIsDisabledSelected(true);
            }}
            style={{marginBottom: 20}}
          />
        </View>

        <View
          style={[
            {flexDirection: 'row', justifyContent: 'space-between'},
            isbirthEntered ? styles.visibleStyle : styles.invisibleStyle,
          ]}>
          <Btn
            isWhite={isMan === null ? true : !isMan}
            title="남성"
            btnSize={0}
            onPress={() => {
              setIsMan(true);
              setIsGenderSelected(true);
            }}
            style={{marginBottom: 20}}
          />
          <Btn
            isWhite={isMan === null ? true : isMan}
            title="여성"
            btnSize={0}
            onPress={() => {
              setIsMan(false);
              setIsGenderSelected(true);
            }}
            style={{marginBottom: 20}}
          />
        </View>

        <InputBox
          value={birth}
          onChangeText={setbirth}
          placeholder="생년월일 숫자 여덟자리"
          ref={birthRef}
          onSubmitEditing={isValidbirth}
          style={
            isPasswordConfirmEntered
              ? styles.visibleStyle
              : styles.invisibleStyle
          }
        />

        <InputBox
          value={passwordConfirm}
          onChangeText={setPasswordConfirm}
          placeholder="비밀번호 확인"
          secureTextEntry={true}
          ref={passwordConfirmRef}
          onSubmitEditing={isValidPasswordConfirm}
          style={{
            position: isPasswordEntered ? 'relative' : 'absolute',
            opacity: isPasswordEntered ? 1 : 0,
            height: isPasswordEntered ? 'auto' : 0,
            width: isPasswordEntered ? '100%' : 0,
          }}
        />

        <InputBox
          value={password}
          onChangeText={setPassword}
          placeholder="비밀번호"
          secureTextEntry={true}
          ref={passwordRef}
          onSubmitEditing={isValidPassword}
          style={
            isNicknameEntered ? styles.visibleStyle : styles.invisibleStyle
          }
        />

        <InputBox
          value={nickname}
          onChangeText={setNickname}
          placeholder="닉네임"
          onSubmitEditing={isValidNickname}
          ref={nicknameRef}
          style={isEmailChecked ? styles.visibleStyle : styles.invisibleStyle}
        />

        <InputBox
          value={email}
          onChangeText={setEmail}
          placeholder="이메일"
          ref={emailRef}
          onSubmitEditing={isValidEmail}
          style={isNameEntered ? styles.visibleStyle : styles.invisibleStyle}
        />

        <InputBox
          value={name}
          onChangeText={setName}
          placeholder="이름"
          ref={nameRef}
          onEndEditing={isValidName}
        />

        <Btn
          isWhite={true}
          title="로그인"
          onPress={() => navigation.navigate('Login')}
          style={{marginVertical: 40}}
        />
      </View>
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
  visibleStyle: {
    position: 'relative',
    opacity: 1,
    height: 'auto',
    width: '100%',
  },
  invisibleStyle: {
    position: 'absolute',
    opacity: 0,
    height: 0,
    width: 0,
  },
});

export default SignupPage;
