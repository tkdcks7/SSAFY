// src/pages/Main/RegisterBookPage.tsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Dimensions, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import MainHeader from '../../components/MainHeader';
import MainFooter from '../../components/MainFooter';
import RegisterBookModal from '../../components/RegisterBook/RegisterBookModal';
import guideIcon from '../../assets/icons/guide.png';

// 화면 크기 가져오기
const { width, height } = Dimensions.get('window');

const RegisterBookPage: React.FC = () => {
  const [isModalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <MainHeader title="도서 등록" isAccessibilityMode={false} isUserVisuallyImpaired={true} />
      <ScrollView contentContainerStyle={styles.contentContainer}>

         {/* 안내 텍스트 */}
         <Text
          style={styles.introText}
          accessible={false}
        >
          전자책을 만들어보세요!
        </Text>

        {/* 경고문 */}
        <Text
          style={styles.warningText}
          accessible={false} // TalkBack이 이 텍스트 자체는 읽지 않도록 설정
          accessibilityLabel="⚠️ 시각장애인이시라면 파일을 하나씩 등록하는 과정이 쉽지 않습니다. 가능한 일반인의 도움을 받는 것을 추천합니다."
          accessibilityHint="일반인의 도움을 받을 것을 추천합니다."
        >
          ⚠️ 시각장애인이시라면 파일을 하나씩 등록하는 과정이 쉽지 않습니다. 가능한 일반인의 도움을 받는 것을 추천합니다.
        </Text>



        {/* 파일 업로드 버튼 */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => setModalVisible(true)}
          accessibilityLabel="이미 완성된 파일이 있어요 버튼"
          accessibilityHint="PDF 또는 EPUB 형식의 완성된 파일을 업로드합니다."
          onAccessibilityTap={() => setModalVisible(true)}
        >
          <Text style={styles.buttonText}>이미 완성된 파일이 있어요</Text>
          <Text style={styles.fileFormatText}>(pdf, epub)</Text>
        </TouchableOpacity>

        {/* 이미지 업로드 버튼 */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('ImageUpload')}
          accessibilityLabel="이미지 업로드 버튼"
          accessibilityHint="JPEG 또는 JPG 형식의 이미지 파일을 업로드합니다."
          onAccessibilityTap={() => navigation.navigate('ImageUpload')}
        >
          <Text style={styles.buttonText}>이미지 업로드</Text>
          <Text style={styles.fileFormatText}>(jpeg, jpg)</Text>
        </TouchableOpacity>

        {/* 업로드 가이드 */}
        <TouchableOpacity
          style={styles.guideContainer}
          onPress={() => navigation.navigate('UploadGuide')}
          accessibilityLabel="업로드 가이드 버튼"
          accessibilityHint="업로드 과정에 대한 가이드를 확인합니다."
        >
          <Image source={guideIcon} style={styles.guideIcon} />
          <Text style={styles.guideText}>업로드 가이드</Text>
        </TouchableOpacity>
      </ScrollView>
      <MainFooter />

      {/* 도서 등록 모달 */}
      <RegisterBookModal isVisible={isModalVisible} onClose={() => setModalVisible(false)} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: width * 0.03,
    // paddingTop: height * 0.05,
    paddingTop: height * 0.02,
    marginBottom: height * 0.02,
    paddingBottom: height * 0.15,
  },
  warningText: {
    fontSize: width * 0.05,
    color: 'red',
    textAlign: 'center',
    marginBottom: height * 0.02,
    fontWeight: 'bold',
  },
  introText: {
    fontSize: width * 0.09,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: height * 0.02,
    color: '#3943B7',
  },
  button: {
    backgroundColor: '#3943B7',
    paddingVertical: height * 0.04,
    paddingHorizontal: width * 0.03,
    marginVertical: height * 0.02,
    borderRadius: 8,
    alignItems: 'center',
    width: '90%',
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: width * 0.07,
  },
  fileFormatText: {
    color: '#FFFFFF',
    fontSize: width * 0.06,
    marginTop: height * 0.01,
  },
  guideContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: height * 0.02,
  },
  guideIcon: {
    // width: width * 0.12,
    // height: width * 0.12,
    width: width * 0.1,
    height: width * 0.1,
    marginRight: width * 0.03,
  },
  guideText: {
    color: '#3943B7',
    fontSize: width * 0.08,
    fontWeight: 'bold',
    transform: [{ translateY: -(width * 0.01) }],
  },
});

export default RegisterBookPage;

