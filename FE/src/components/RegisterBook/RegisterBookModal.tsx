import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Dimensions,
  TextInput,
  ActivityIndicator,
  Image,
} from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import CustomPicker from './CustomPicker'; // 커스텀 Picker 컴포넌트 임포트
import { styles } from '../../styles/RegisterBook/RegisterBookModalStyle';
import fileIcon from '../../assets/icons/file.png';
import coverIcon from '../../assets/icons/cover.png';

const { width, height } = Dimensions.get('window');

const customPickerData = [
  { label: '소설', value: '001' },
  { label: '에세이', value: '002' },
  { label: '자기계발', value: '003' },
  { label: '경제', value: '004' },
  { label: '기타', value: '005' },
];

type RegisterBookModalProps = {
  isVisible: boolean;
  onClose: () => void;
};

const RegisterBookModal: React.FC<RegisterBookModalProps> = ({ isVisible, onClose }) => {
  const [currentStep, setCurrentStep] = useState<'selectFileType' | 'fileUpload' | 'metaDataInput' | 'loading' | null>(
    'selectFileType'
  );
  const [selectedFileType, setSelectedFileType] = useState<'pdf' | 'epub' | null>(null);
  const [uploadedFile, setUploadedFile] = useState<{ file: any | null; cover: any | null }>({ file: null, cover: null });
  const [metaData, setMetaData] = useState<{ title: string; author: string; category: string }>({
    title: '',
    author: '',
    category: '001',
  });
  const [loadingMessage, setLoadingMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isPickerVisible, setPickerVisible] = useState(false);

  useEffect(() => {
    if (isVisible) {
      resetModal();
    }
  }, [isVisible]);

  useEffect(() => {
    console.log('Current Step Updated:', currentStep);
  }, [currentStep]);

  useEffect(() => {
    console.log('Loading Message Updated:', loadingMessage);
  }, [loadingMessage]);

  const resetModal = () => {
    setCurrentStep('selectFileType');
    setSelectedFileType(null);
    setUploadedFile({ file: null, cover: null });
    setMetaData({ title: '', author: '', category: '001' });
    setIsLoading(false);
    setLoadingMessage('');
  };

  const handleFileTypeSelection = (fileType: 'pdf' | 'epub') => {
    setSelectedFileType(fileType);
    setCurrentStep('fileUpload');
  };

  const handleFileUpload = async (type: 'file' | 'cover') => {
    try {
      let fileType;

      if (type === 'file') {
        fileType =
          selectedFileType === 'pdf'
            ? DocumentPicker.types.pdf
            : DocumentPicker.types.allFiles; // ePub의 경우 모든 파일 허용 후 확장자 확인
      } else {
        fileType = DocumentPicker.types.images; // 표지는 항상 이미지
      }

      const res = await DocumentPicker.pick({
        type: [fileType],
      });

      // ePub 파일 체크 로직 추가
      if (type === 'file' && selectedFileType === 'epub' && !res[0].name.toLowerCase().endsWith('.epub')) {
        alert('ePub 파일만 업로드할 수 있습니다.');
        return;
      }

      // 표지 파일 확장자 확인 (JPEG와 JPG만 허용)
      if (type === 'cover' && !['.jpeg', '.jpg'].some((ext) => res[0].name.toLowerCase().endsWith(ext))) {
        alert('표지는 JPEG 또는 JPG 파일만 업로드할 수 있습니다.');
        return;
      }

      setUploadedFile((prev) => ({
        ...prev,
        [type]: res[0],
      }));
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('User cancelled the picker');
      } else {
        console.error('Unknown error: ', err);
      }
    }
  };

  const handleMetaDataSubmit = async () => {
    setCurrentStep('loading');
    setLoadingMessage('도서 변환 중...');
    setIsLoading(true);

    try {
      // 3초씩 상태를 표시하는 더미 로직
      await new Promise((resolve) => setTimeout(resolve, 3000));
      setLoadingMessage('로컬에 저장 중...');
      await new Promise((resolve) => setTimeout(resolve, 3000));
      setLoadingMessage('책 다운로드 중...');
      await new Promise((resolve) => setTimeout(resolve, 3000));
    } catch (error) {
      console.error('Error during metadata submission:', error);
    } finally {
      setIsLoading(false);
      setTimeout(() => {
        resetModal();
        onClose();
      }, 500);
    }
  };

  return (
    <Modal visible={isVisible} transparent animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          {/* 로딩 단계 */}
          {currentStep === 'loading' && (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>{loadingMessage}</Text>
              <ActivityIndicator size="large" color="#3943B7" />
            </View>
          )}

          {/* 파일 유형 선택 단계 */}
          {currentStep === 'selectFileType' && (
            <>
              <Text style={styles.title}>파일 유형을 선택하세요</Text>
              <View style={styles.fileTypeContainer}>
                <TouchableOpacity style={styles.pdfButton} onPress={() => handleFileTypeSelection('pdf')}>
                  <Text style={styles.modalButtonText}>PDF {'\n'} 파일</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.epubButton} onPress={() => handleFileTypeSelection('epub')}>
                  <Text style={styles.modalButtonText}>ePub {'\n'} 파일</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                <Text style={styles.cancelButtonText}>취소</Text>
              </TouchableOpacity>
            </>
          )}

          {/* 파일 업로드 단계 */}
          {currentStep === 'fileUpload' && (
            <>
              <Text style={styles.subTitle}>파일과 표지를 업로드하세요</Text>
              <View style={styles.uploadContainer}>
                <Image source={fileIcon} style={styles.icon} />
                <TouchableOpacity style={styles.uploadButton} onPress={() => handleFileUpload('file')}>
                  <Text style={styles.uploadButtonText}>{uploadedFile.file ? uploadedFile.file.name : '파일 업로드'}</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.uploadContainer}>
                <Image source={coverIcon} style={styles.icon} />
                <TouchableOpacity style={styles.uploadButton} onPress={() => handleFileUpload('cover')}>
                  <Text style={styles.uploadButtonText}>{uploadedFile.cover ? uploadedFile.cover.name : '표지 업로드'}</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                style={[styles.registerButton, uploadedFile.file && uploadedFile.cover ? {} : styles.disabledButton]}
                disabled={!uploadedFile.file || !uploadedFile.cover}
                onPress={() => setCurrentStep('metaDataInput')}
              >
                <Text style={styles.registerButtonText}>다음</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                <Text style={styles.cancelButtonText}>취소</Text>
              </TouchableOpacity>
            </>
          )}

          {/* 메타데이터 입력 단계 */}
          {currentStep === 'metaDataInput' && (
            <>
              <Text style={styles.title}>도서 정보 입력</Text>
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
            </>
          )}
        </View>
      </View>
    </Modal>
  );
};

export default RegisterBookModal;
