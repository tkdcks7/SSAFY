import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
  ScrollView,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { styles } from '../../styles/RegisterBook/RegisterBookImageModal';
import CustomPicker from './CustomPicker'; // 카테고리 선택을 위한 커스텀 피커 임포트
import { uploadImageBook } from '../../services/BookRegister/BookRegister'; // 이미지 업로드 함수
import { downloadFileFromUrl, saveBookToLocalDatabase } from '../../services/BookDetail/BookDetail'; // 다운로드 및 저장 함수
import { v4 as uuidv4 } from 'uuid'; // UUID 라이브러리
import { LibraryContext } from '../../contexts/LibraryContext'; // LibraryContext 가져오기
import { connectToSSE } from '../../services/BookRegister/SSEConnector'; // SSE 연결 함수

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
  const { setAllBooks } = useContext(LibraryContext)!; // 전역 상태 업데이트 함수
  const [metaData, setMetaData] = useState<{ title: string; author: string; category: string }>({
    title: '',
    author: '',
    category: '001',
  });
  const [isPickerVisible, setPickerVisible] = useState<boolean>(false);
  const [requestId, setRequestId] = useState<string>(uuidv4()); // 고유 Request ID 생성
  const [isLoading, setIsLoading] = useState<boolean>(false); // 로딩 상태
  const [loadingMessage, setLoadingMessage] = useState<string>('파일 업로드 준비 중...');
  const [progress, setProgress] = useState<number>(0); // 진행률 상태

  useEffect(() => {
    if (isVisible) {
      resetModal();
    }
  }, [isVisible]);

  const resetModal = () => {
    setMetaData({ title: '', author: '', category: '001' });
    setRequestId(uuidv4()); // 새로운 Request ID 생성
    setIsLoading(false);
    setLoadingMessage('');
    setProgress(0);
  };

  const handleMetaDataSubmit = async () => {
    if (selectedCoverIndex === null) {
      Alert.alert('오류', '커버 이미지를 선택해주세요.');
      return;
    }

    setIsLoading(true);
    setLoadingMessage('이미지 업로드 중...');

    try {
      const disconnectSSE = connectToSSE(
        requestId,
        (data) => {
          setProgress(data.progress);
          setLoadingMessage(`진행률: ${data.progress}% - ${data.status}`);
        },
        (error) => {
          console.error('SSE 연결 중 오류:', error);
          Alert.alert('SSE 오류', '실시간 진행 정보를 가져오는 중 오류가 발생했습니다.');
        }
      );

      const response = await uploadImageBook(
        uploadedImages.map((uri, index) => ({
          uri,
          type: 'image/jpeg',
          name: `image_${index + 1}.jpg`,
        })),
        {
          uri: uploadedImages[selectedCoverIndex],
          type: 'image/jpeg',
          name: 'cover.jpg',
        },
        metaData,
        requestId
      );

      console.log('Upload Response:', response);

      const { epub, metadata } = response;

      if (!epub) {
        throw new Error('EPUB URL이 반환되지 않았습니다.');
      }

      // SSE 연결 종료
      disconnectSSE();

      // 파일 다운로드
      const downloadedFilePath = await downloadFileFromUrl(epub, `${metadata.title}.epub`);

      // 로컬 데이터베이스 저장 데이터 구성
      const bookData = {
        id: Date.now(), // 새로운 ID
        bookId: metadata.book_id,
        title: metadata.title,
        cover: metadata.cover,
        coverAlt: metadata.cover_alt,
        category: metadata.category,
        author: metadata.author,
        createdAt: metadata.created_at,
        myTtsFlag: false,
        dtype: metadata.dtype,
        filePath: downloadedFilePath,
        downloadDate: new Date().toISOString(),
        currentCfi: '',
        progressRate: 0,
      };

      // 로컬 데이터베이스에 저장
      await saveBookToLocalDatabase(bookData);

      // 전역 상태 업데이트
      setAllBooks((prevBooks) => [...prevBooks, bookData]);

      Alert.alert('등록 완료', '도서가 성공적으로 등록되었습니다!');
    } catch (error) {
      console.error('등록 중 오류 발생:', error);
      Alert.alert('오류', '도서 등록 중 문제가 발생했습니다.');
    } finally {
      setIsLoading(false);
      onClose();
    }
  };

  return (
    <Modal visible={isVisible} transparent animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>{loadingMessage}</Text>
              <ActivityIndicator size="large" color="#3943B7" />
              <Text style={styles.progressText}>진행률: {progress}%</Text>
            </View>
          ) : (
            <>
              <Text style={styles.title}>도서 정보 입력</Text>
              <ScrollView>
                <View style={styles.uploadPreviewContainer}>
                  <Text style={styles.subTitle}>커버 이미지 미리보기</Text>
                  {selectedCoverIndex !== null && (
                    <Image source={{ uri: uploadedImages[selectedCoverIndex] }} style={styles.previewImage} />
                  )}
                  {uploadedImages.length > 1 && (
                    <Text style={styles.additionalImagesText}>+ {uploadedImages.length - 1} 개의 이미지</Text>
                  )}
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.label}>제목</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="제목을 입력하세요"
                    value={metaData.title}
                    onChangeText={(text) => setMetaData({ ...metaData, title: text })}
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.label}>저자</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="저자를 입력하세요"
                    value={metaData.author}
                    onChangeText={(text) => setMetaData({ ...metaData, author: text })}
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.label}>카테고리</Text>
                  <TouchableOpacity onPress={() => setPickerVisible(true)} style={styles.pickerButton}>
                    <Text style={styles.pickerText}>
                      {customPickerData.find((item) => item.value === metaData.category)?.label || '카테고리 선택'}
                    </Text>
                  </TouchableOpacity>
                </View>

                <CustomPicker
                  isVisible={isPickerVisible}
                  selectedValue={metaData.category}
                  onValueChange={(value) => setMetaData({ ...metaData, category: value })}
                  onClose={() => setPickerVisible(false)}
                />

                <TouchableOpacity
                  style={[styles.registerButton, metaData.title && metaData.author && metaData.category ? {} : styles.disabledButton]}
                  disabled={!metaData.title || !metaData.author || !metaData.category}
                  onPress={handleMetaDataSubmit}
                >
                  <Text style={styles.registerButtonText}>등록</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                  <Text style={styles.cancelButtonText}>취소</Text>
                </TouchableOpacity>
              </ScrollView>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
};

export default RegisterBookImageModal;
