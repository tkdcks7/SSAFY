import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import CustomHeader from '../../components/CustomHeader';
import MainFooter from '../../components/MainFooter';
import ImageUploadSection from '../../components/RegisterBook/ImageUploadSection';
import SelectedImageView from '../../components/RegisterBook/SelectedImageView';
import RegisterBookImageModal from '../../components/RegisterBook/RegisterBookImageModal';

const { width, height } = Dimensions.get('window');

const ImageUploadPage: React.FC = () => {
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [selectedCoverIndex, setSelectedCoverIndex] = useState<number | null>(null);
  const [isModalVisible, setModalVisible] = useState<boolean>(false);

  const handleAddImage = (newImage: string) => {
    setUploadedImages([...uploadedImages, newImage]);
  };

  const handleSelectImage = (index: number) => {
    setSelectedImageIndex(index);
  };

  const handleSetCoverImage = (index: number) => {
    console.log('커버 이미지 설정됨:', uploadedImages[index]);
    setSelectedCoverIndex(index);
  };

  const handleRemoveCoverImage = () => {
    console.log('커버 이미지 해제됨');
    setSelectedCoverIndex(null);
  };

  const handleRegister = () => {
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <CustomHeader title="도서 등록" isAccessibilityMode={false} isUserVisuallyImpaired={true} />
      <View style={styles.contentContainer}>
        {/* 상단 이미지 업로드 섹션 */}
        <ImageUploadSection
          uploadedImages={uploadedImages}
          onAddImage={handleAddImage}
          onSelectImage={handleSelectImage}
          onSetCoverImage={handleSetCoverImage}
        />

        {/* 하단 선택된 이미지 전체 보기 */}
        {selectedImageIndex !== null && (
          <SelectedImageView
            image={uploadedImages[selectedImageIndex]}
            onRemoveImage={() => {
              const newImages = [...uploadedImages];
              newImages.splice(selectedImageIndex, 1);
              setUploadedImages(newImages);
              setSelectedImageIndex(null);
              if (selectedCoverIndex === selectedImageIndex) {
                setSelectedCoverIndex(null);
              }
            }}
            isCoverImage={selectedImageIndex === selectedCoverIndex}
            onRemoveCoverImage={handleRemoveCoverImage}
          />
        )}
      </View>

      {/* 등록 버튼 */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.registerButton,
            uploadedImages.length > 0 && selectedCoverIndex !== null ? {} : styles.disabledButton,
          ]}
          onPress={handleRegister}
          disabled={uploadedImages.length === 0 || selectedCoverIndex === null}
        >
          <Text style={styles.registerButtonText}>전자책 등록하기</Text>
        </TouchableOpacity>
      </View>
      <MainFooter />

      {/* 도서 정보 입력 모달 */}
      <RegisterBookImageModal
        isVisible={isModalVisible}
        onClose={() => setModalVisible(false)}
        uploadedImages={uploadedImages}
        selectedCoverIndex={selectedCoverIndex}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flexShrink: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: width * 0.02,
  },
  buttonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginVertical: height * 0.02,
  },
  registerButton: {
    backgroundColor: '#3943B7',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    width: '88%',
    height: height * 0.06,
  },
  disabledButton: {
    backgroundColor: '#B0B0B0',
  },
  registerButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: width * 0.045,
  },
});

export default ImageUploadPage;
