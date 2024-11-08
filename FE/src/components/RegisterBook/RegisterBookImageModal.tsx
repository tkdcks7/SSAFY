import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
  ScrollView,
  Image,
} from 'react-native';
import { styles } from '../../styles/RegisterBook/RegisterBookImageModal';
import CustomPicker from './CustomPicker'; // 카테고리 선택을 위한 커스텀 피커 임포트


type RegisterBookImageModalProps = {
  isVisible: boolean;
  onClose: () => void;
  uploadedImages: string[];
  selectedCoverIndex: number | null;
};

// 카테고리 선택을 위한 데이터 정의
const customPickerData = [
  { label: '소설', value: '001' },
  { label: '에세이', value: '002' },
  { label: '자기계발', value: '003' },
  { label: '경제', value: '004' },
  { label: '기타', value: '005' },
];

const RegisterBookImageModal: React.FC<RegisterBookImageModalProps> = ({
  isVisible,
  onClose,
  uploadedImages,
  selectedCoverIndex,
}) => {
  const [metaData, setMetaData] = useState<{ title: string; author: string; category: string }>({
    title: '',
    author: '',
    category: '',
  });
  const [isPickerVisible, setPickerVisible] = useState<boolean>(false);

  useEffect(() => {
    if (isVisible) {
      resetModal();
    }
  }, [isVisible]);

  const resetModal = () => {
    setMetaData({ title: '', author: '', category: '001' });
  };

  const handleMetaDataSubmit = async () => {
    // 백엔드 요청 로직 (주석 처리)
    /*
    const requestPayload = {
      uploadFile: uploadedImages, // 이미지 배열을 업로드 파일로 설정
      title: metaData.title,
      author: metaData.author,
      cover: selectedCoverIndex !== null ? uploadedImages[selectedCoverIndex] : null,
      category: metaData.category,
    };

    try {
      const response = await fetch('YOUR_BACKEND_ENDPOINT', {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: JSON.stringify(requestPayload),
      });

      const data = await response.json();
      console.log('등록 완료:', data);

      // 백엔드 응답 데이터를 로컬 데이터베이스에 추가 (주석 처리)
      // const localDatabaseData = {
      //   bookId: data.bookId,
      //   title: data.title,
      //   author: data.author,
      //   cover: data.cover,
      //   coverAlt: data.coverAlt,
      //   category: data.category,
      // };

      // 로컬 데이터베이스에 저장하는 로직 (주석 처리)
      // await saveToLocalDatabase(localDatabaseData);

      // 도서 다운로드 로직 (주석 처리)
      // await downloadBook(data.url);
    } catch (error) {
      console.error('등록 중 오류 발생:', error);
    } finally {
      onClose();
    }
    */
  };

  return (
    <Modal visible={isVisible} transparent animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>도서 정보 입력</Text>
          <ScrollView>
            {/* 이미지 및 커버 정보 */}
            <View style={styles.uploadPreviewContainer}>
              <Text style={styles.subTitle}>커버 이미지 미리보기</Text>
              {selectedCoverIndex !== null && (
                <Image source={{ uri: uploadedImages[selectedCoverIndex] }} style={styles.previewImage} />
              )}
              {uploadedImages.length > 1 && (
                <Text style={styles.additionalImagesText}>+ {uploadedImages.length - 1} 개의 이미지</Text>
              )}
            </View>

            {/* 제목 입력 */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>제목</Text>
              <TextInput
                style={styles.input}
                placeholder="제목을 입력하세요"
                value={metaData.title}
                onChangeText={(text) => setMetaData({ ...metaData, title: text })}
              />
            </View>
            {/* 저자 입력 */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>저자</Text>
              <TextInput
                style={styles.input}
                placeholder="저자를 입력하세요"
                value={metaData.author}
                onChangeText={(text) => setMetaData({ ...metaData, author: text })}
              />
            </View>
            {/* 카테고리 선택 */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>카테고리</Text>
              <TouchableOpacity style={styles.pickerButton} onPress={() => setPickerVisible(true)}>
                <Text style={styles.pickerText}>
                  {customPickerData.find((item) => item.value === metaData.category)?.label || '카테고리 선택'}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>

          {/* 등록 및 취소 버튼 */}
          <View style={styles.modalButtonContainer}>
            <TouchableOpacity
              style={[styles.registerButton, metaData.title && metaData.author ? {} : styles.disabledButton]}
              disabled={!metaData.title || !metaData.author}
              onPress={handleMetaDataSubmit}
            >
              <Text style={styles.registerButtonText}>등록</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelButtonText}>취소</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* 카테고리 선택을 위한 커스텀 피커 모달 */}
      <CustomPicker
        isVisible={isPickerVisible}
        selectedValue={metaData.category}
        onValueChange={(value) => {
          setMetaData({ ...metaData, category: value });
        }}
        onClose={() => setPickerVisible(false)}
      />
    </Modal>
  );
};

export default RegisterBookImageModal;
