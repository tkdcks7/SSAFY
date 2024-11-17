import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Image, ScrollView } from 'react-native';
import CustomHeader from '../../components/CustomHeader';
import leftArrowIcon from '../../assets/icons/leftarrow.png';
import rightArrowIcon from '../../assets/icons/rightarrow.png';

const { width, height } = Dimensions.get('window');

const UploadGuidePage: React.FC = () => {
  const [activeMainTab, setActiveMainTab] = useState<'file' | 'image'>('file');
  const [activeSubTab, setActiveSubTab] = useState<number>(0);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);

  // 파일 업로드 과정 이미지 및 설명 데이터
  const fileUploadSteps = [
    {
      title: '파일 타입 선택',
      description: '등록 가능 파일 : PDF, ePub\n적절한 파일을 선택해주세요.',
      images: [
        require('../../assets/images/UploadGuide/fileTypeSelection.png'),
      ],
    },
    {
      title: '파일 & 표지 업로드',
      description: '전자책 파일과(pdf, epub)\n표지 이미지(jpg, jpeg)를\n업로드합니다.',
      images: [
        require('../../assets/images/UploadGuide/fileAndCoverUpload.png'),
      ],
    },
    {
      title: '도서 정보 입력',
      description: '도서의 제목, 저자를 입력하고\n카테고리를 선택해서\n등록버튼을 눌러주세요.',
      images: [
        require('../../assets/images/UploadGuide/bookInfoInput1.png'),
        require('../../assets/images/UploadGuide/categorySelect.png'),
      ],
    },
    {
      title: '도서 등록',
      description: '등록버튼을 누르면\n도서를 변환하고\n앱에 다운로드합니다.\n(짧게는 몇십초, 길게는 분단위의 시간이 필요합니다)',
      images: [
        require('../../assets/images/UploadGuide/bookRegistration1.png'),
        require('../../assets/images/UploadGuide/bookRegistering.png'),
      ],
    },
  ];

  // 이미지 업로드 과정 이미지 및 설명 데이터
  const imageUploadSteps = [
    {
      title: '이미지 업로드',
      description: '+ 버튼을 눌러 도서 페이지\n이미지를 업로드합니다.\nJPEG, JPG 파일만 가능합니다.',
      images: [
        require('../../assets/images/UploadGuide/imageUpload1.png'),
      ],
    },
    {
      title: '커버 설정',
      description: '이미지 중 하나를 커버로 설정할 수 있습니다. 커버를 등록했다면 커버 해제 버튼과 전자책등록버튼도 활성화됩니다',
      images: [
        require('../../assets/images/UploadGuide/coverSetting1.png'),
        require('../../assets/images/UploadGuide/coverSetting2.png'),
      ],
    },
    {
      title: '도서 정보 입력',
      description: '도서의 제목, 저자를 입력하고  카테고리를 선택해서 등록버튼을 눌러주세요.',
      images: [
        require('../../assets/images/UploadGuide/bookRegistration2.png'),
        require('../../assets/images/UploadGuide/categorySelect.png'),
      ],
    },
    {
      title: '도서 등록',
      description: '등록버튼을 누르면 도서를 변환하고 앱에 다운로드합니다.     (짧게는 몇십초, 길게는 분단위의 시간이 필요합니다)',
      images: [
        require('../../assets/images/UploadGuide/bookRegistration2.png'),
        require('../../assets/images/UploadGuide/bookRegistering.png'),
      ],
    },
  ];

  const steps = activeMainTab === 'file' ? fileUploadSteps : imageUploadSteps;
  const currentStep = steps[activeSubTab];

  const handleNextImage = () => {
    if (currentImageIndex < currentStep.images.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };

  const handlePreviousImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  return (
    <View style={styles.container}>
      <CustomHeader title="업로드 가이드" isAccessibilityMode={false} isUserVisuallyImpaired={true} />
      <View style={styles.mainTabContainer}>
        <TouchableOpacity
          style={[styles.mainTab, activeMainTab === 'file' && styles.selectedTabButton]}
          onPress={() => {
            setActiveMainTab('file');
            setActiveSubTab(0);
            setCurrentImageIndex(0);
          }}
        >
          <Text style={[styles.mainTabText, activeMainTab === 'file' && styles.selectedTabButtonText]}>파일 업로드</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.mainTab, activeMainTab === 'image' && styles.selectedTabButton]}
          onPress={() => {
            setActiveMainTab('image');
            setActiveSubTab(0);
            setCurrentImageIndex(0);
          }}
        >
          <Text style={[styles.mainTabText, activeMainTab === 'image' && styles.selectedTabButtonText]}>이미지 업로드</Text>
        </TouchableOpacity>
      </View>

      {/* 하단 순서 탭 */}
      <View>
        <ScrollView
            horizontal
            contentContainerStyle={styles.subTabContainer}
            showsHorizontalScrollIndicator={false}>
          {steps.map((step, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.subTab, activeSubTab === index && styles.activeSubTab]}
              onPress={() => {
                setActiveSubTab(index);
                setCurrentImageIndex(0);
              }}
            >
              <Text style={[styles.subTabText, activeSubTab === index && styles.selectedSubTabText]}>{`${index + 1}. ${step.title}`}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      {/* 이미지 및 설명 표시 */}
      <View style={styles.contentContainer}>
        <View style={styles.imageContainer}>
          {currentStep.images.length > 1 && currentImageIndex > 0 && (
            <TouchableOpacity onPress={handlePreviousImage}>
              <Image source={leftArrowIcon} style={styles.arrowIcon} />
            </TouchableOpacity>
          )}
          <Image source={currentStep.images[currentImageIndex]} style={styles.stepImage} />
          {currentStep.images.length > 1 && currentImageIndex < currentStep.images.length - 1 && (
            <TouchableOpacity onPress={handleNextImage}>
              <Image source={rightArrowIcon} style={styles.arrowIcon} />
            </TouchableOpacity>
          )}
        </View>
        <Text style={styles.descriptionText}>{currentStep.description}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  mainTabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: height * 0.005,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  mainTab: {
    flex: 1,
    paddingVertical: height * 0.01,
    paddingHorizontal: width * 0.01,
    marginHorizontal: width * 0.01,
    alignItems: 'center',
  },
  selectedTabButton: {
    backgroundColor: '#3943B7',
    borderRadius: 4,
  },
  mainTabText: {
    fontSize: width * 0.05,
    fontWeight: 'bold',
    color: '#3943B7',
  },
  selectedTabButtonText: {
    color: '#ffffff',
  },
  subTabContainer: {
    height: height * 0.06,
    paddingHorizontal: 0,
    marginBottom: 0,
  },
  subTab: {
    paddingVertical: height * 0.005,
    paddingHorizontal: width * 0.05,
    marginHorizontal: width * 0.01,
    borderWidth: 1,
    borderColor: '#3943B7',
    borderRadius: 8,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeSubTab: {
    backgroundColor: '#3943B7',
  },
  subTabText: {
    fontSize: width * 0.045,
    color: '#3943B7',
    fontWeight: 'bold',
  },
  selectedSubTabText: {
    color: '#ffffff',
  },
  contentContainer: {
    flex: 1,
    // justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: width * 0.05,
    // paddingBottom: height * 0.02,
  },
  imageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: height * 0.01, // 이미지와 설명 사이의 여백 추가
  },
  stepImage: {
    width: width * 0.85, // 이미지 크기 확대
    height: height * 0.5,
    resizeMode: 'contain',
  },
  arrowIcon: {
    width: width * 0.1,
    height: height * 0.1,
    marginHorizontal: width * 0.01, // 화살표와 이미지 사이의 여백을 줄임
  },
  descriptionText: {
    flex: 1,
    fontSize: width * 0.06, // 글자 크기 확대
    textAlign: 'center',
    color: '#333333', // 진한 색으로 변경
    fontWeight: 'bold',
    // marginTop: height * 0.015, // 이미지와 설명 사이의 여백 추가
    marginVertical: height * 0.015,
    paddingHorizontal: width * 0.05, // 텍스트에 좌우 여백 추가
  },
});

export default UploadGuidePage;
