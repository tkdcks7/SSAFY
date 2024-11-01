import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Dimensions, AccessibilityInfo } from 'react-native';
import MyPageHeader from '../../components/MyPage/MyPageHeader';
import { useNavigation, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation/AppNavigator';

const { width, height } = Dimensions.get('window');

type GeneralInfoEditScreenRouteProp = RouteProp<RootStackParamList, 'GeneralInfoEdit'>;

type GeneralInfoEditPageProps = {
  route: GeneralInfoEditScreenRouteProp;
};

const GeneralInfoEditPage: React.FC<GeneralInfoEditPageProps> = ({ route }) => {
  const navigation = useNavigation();
  const { nickname: initialNickname = '', birth = '', blindFlag: initialBlindFlag = false } = route.params || {};

  const [nickname, setNickname] = useState(initialNickname);
  const [blindFlag, setBlindFlag] = useState(initialBlindFlag);
  const [statusMessage, setStatusMessage] = useState('');

  const handleSaveChanges = async () => {
    if (nickname.length < 2 || nickname.length > 15 || /[^a-zA-Z0-9가-힣]/.test(nickname)) {
      setStatusMessage('닉네임은 2~15자 이내의 영문, 숫자, 한글만 가능합니다.');
      AccessibilityInfo.announceForAccessibility('닉네임은 2~15자 이내의 영문, 숫자, 한글만 가능합니다.');
      return;
    }

    // 주석 처리된 API 요청 - 나중에 추가할 예정
    setStatusMessage('정보가 성공적으로 수정되었습니다.');
    AccessibilityInfo.announceForAccessibility('정보가 성공적으로 수정되었습니다.');
    navigation.goBack();
  };

  const handleBlindFlagChange = (value: boolean) => {
    setBlindFlag(value);
    if (value) {
      AccessibilityInfo.announceForAccessibility('접근성 모드가 활성화되었습니다. 장애 여부가 있음으로 설정되었습니다.');
    } else {
      AccessibilityInfo.announceForAccessibility('접근성 모드가 비활성화되었습니다. 장애 여부가 없음으로 설정되었습니다.');
    }
  };

  return (
    <View style={styles.container}>
      <MyPageHeader title="일반정보 수정" />
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.innerContainer}>
          <Text style={styles.label}>닉네임</Text>
          <TextInput
            style={styles.input}
            placeholder="닉네임을 입력하세요"
            value={nickname}
            onChangeText={(text) => {
              setNickname(text);
              setStatusMessage(''); // 오류 메시지 초기화
            }}
            accessibilityLabel="닉네임 입력란"
            accessible
          />
          <Text style={styles.nicknameDescription}>
            닉네임은 2~15자 이내의 영문, 숫자, 한글만 가능합니다.
          </Text>
          <Text style={styles.infoLabel}>생년월일</Text>
          <Text style={styles.infoText} accessibilityLabel={`생년월일 ${birth}`} accessible>{birth}</Text>
          <Text style={styles.label}>장애여부</Text>
          <View style={styles.toggleButtonContainer}>
            <TouchableOpacity
              style={[styles.toggleButton, blindFlag ? styles.toggleButtonActive : styles.toggleButtonInactive]}
              onPress={() => handleBlindFlagChange(true)}
              accessibilityLabel="장애 여부 있음"
              accessible
            >
              <Text style={styles.toggleButtonText}>O</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.toggleButton, !blindFlag ? styles.toggleButtonActive : styles.toggleButtonInactive]}
              onPress={() => handleBlindFlagChange(false)}
              accessibilityLabel="장애 여부 없음"
              accessible
            >
              <Text style={styles.toggleButtonText}>X</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.saveButton} onPress={handleSaveChanges} accessibilityLabel="수정 완료 버튼" accessible>
            <Text style={styles.saveButtonText}>수정 완료</Text>
          </TouchableOpacity>
          {statusMessage ? (
            <Text style={styles.statusMessage} accessibilityLiveRegion="assertive" accessible>{statusMessage}</Text>
          ) : null}
        </View>
      </ScrollView>
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
    justifyContent: 'flex-start',
    marginTop: height * 0.01,
    width: width * 0.9,
    alignSelf: 'center',
  },
  label: {
    fontSize: width * 0.08,
    fontWeight: 'bold',
    marginLeft: width * 0.02,
    marginBottom: height * 0.01,
    color: '#3943B7',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: width * 0.04,
    marginBottom: height * 0.01,
    borderRadius: 5,
    fontSize: width * 0.07,
  },
  nicknameDescription: {
    fontSize: width * 0.045,
    color: '#666',
    marginBottom: height * 0.03,
    marginLeft: width * 0.02,
  },
  infoLabel: {
    fontSize: width * 0.08,
    fontWeight: 'bold',
    marginBottom: height * 0.03,
    color: '#3943B7',
  },
  infoText: {
    fontSize: width * 0.1,
    marginBottom: height * 0.05,
  },
  toggleButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: height * 0.05,
  },
  toggleButton: {
    height: height * 0.08,
    width: width * 0.35,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  toggleButtonActive: {
    backgroundColor: '#3943B7',
  },
  toggleButtonInactive: {
    backgroundColor: '#ccc',
  },
  toggleButtonText: {
    color: '#FFFFFF',
    fontSize: width * 0.12,
    fontWeight: 'bold',
  },
  saveButton: {
    height: height * 0.1,
    width: width * 0.8,
    backgroundColor: '#3943B7',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    alignSelf: 'center',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: width * 0.06,
    fontWeight: 'bold',
  },
  statusMessage: {
    marginTop: height * 0.02,
    fontSize: width * 0.05,
    color: '#FF0000',
    textAlign: 'center',
  },
});

export default GeneralInfoEditPage;
