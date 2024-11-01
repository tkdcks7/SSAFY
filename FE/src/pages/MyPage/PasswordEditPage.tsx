import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, AccessibilityInfo, ScrollView, Dimensions } from 'react-native';
import MyPageHeader from '../../components/MyPage/MyPageHeader';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

const PasswordEditPage: React.FC = () => {
  const navigation = useNavigation();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      AccessibilityInfo.announceForAccessibility('오류: 새 비밀번호와 확인이 일치하지 않습니다.');
      return;
    }
    // try {
    //   // 비밀번호 변경 API 요청 보내기 (예시)
    //   const response = await axios.post('https://your-api-endpoint.com/change-password', {
    //     oldPassword: currentPassword,
    //     newPassword: newPassword,
    //   });
    //   console.log('비밀번호 변경 성공:', response.data);
    //   AccessibilityInfo.announceForAccessibility('성공: 비밀번호가 변경되었습니다.');
    //   navigation.goBack();
    // } catch (error) {
    //   console.error('비밀번호 변경 오류:', error);
    //   AccessibilityInfo.announceForAccessibility('오류: 비밀번호 변경에 실패했습니다. 다시 시도해주세요.');
    // }

    // 아래는 API 연결 전 시나리오 테스트용 코드
    AccessibilityInfo.announceForAccessibility('성공: 비밀번호가 변경되었습니다.');
    navigation.goBack();
  };

  const handleConfirmPasswordBlur = () => {
    if (newPassword && confirmPassword && newPassword !== confirmPassword) {
      AccessibilityInfo.announceForAccessibility('오류: 새 비밀번호와 확인이 일치하지 않습니다.');
    }
  };

  return (
    <View style={styles.container}>
      <MyPageHeader title="내 정보 수정" />
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.innerContainer}>
          <TouchableOpacity style={styles.changeButton} onPress={handlePasswordChange}>
            <Text style={styles.changeButtonText}>비밀번호 변경</Text>
          </TouchableOpacity>
          <Text style={styles.label}>기존 비밀번호</Text>
          <TextInput
            style={styles.input}
            placeholder="기존 비밀번호"
            secureTextEntry={true}
            value={currentPassword}
            onChangeText={setCurrentPassword}
          />
          <Text style={styles.label}>새 비밀번호</Text>
          <TextInput
            style={styles.input}
            placeholder="새 비밀번호"
            secureTextEntry={true}
            value={newPassword}
            onChangeText={setNewPassword}
          />
          <Text style={styles.label}>새 비밀번호 확인</Text>
          <TextInput
            style={styles.input}
            placeholder="새 비밀번호 확인"
            secureTextEntry={true}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            onBlur={handleConfirmPasswordBlur}
          />
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
    padding: width * 0.1,
    justifyContent: 'flex-start',
    marginTop: height * 0.02,
  },
  changeButton: {
    height: height * 0.15,
    width: width * 0.8,
    backgroundColor: '#3943B7',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginBottom: height * 0.03,
    alignSelf: 'center',
  },
  changeButtonText: {
    color: '#FFFFFF',
    fontSize: width * 0.1,
    fontWeight: 'bold',
  },
  label: {
    fontSize: width * 0.08,
    fontWeight: 'bold',
    marginTop: height * 0.01,
    marginBottom: height * 0.01,
    color: '#3943B7',
  },
  input: {
    borderWidth: 3,
    borderColor: '#ccc',
    padding: width * 0.04,
    marginBottom: height * 0.02,
    borderRadius: 5,
    fontSize: width * 0.05,
  },
});

export default PasswordEditPage;
