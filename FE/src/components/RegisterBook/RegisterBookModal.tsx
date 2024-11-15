import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Dimensions,
  TextInput,
  ActivityIndicator,
  Image,
  Alert,
} from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import CustomPicker from './CustomPicker'; // 커스텀 Picker 컴포넌트
import { styles } from '../../styles/RegisterBook/RegisterBookModalStyle';
import fileIcon from '../../assets/icons/file.png';
import coverIcon from '../../assets/icons/cover.png';
import { uploadBookFile } from '../../services/BookRegister/BookRegister'; // 파일 업로드 함수
import { downloadFileFromUrl, saveBookToLocalDatabase } from '../../services/BookDetail/BookDetail'; // 다운로드 및 저장 함수
import { v4 as uuidv4 } from 'uuid';
import { connectToSSE } from '../../services/BookRegister/SSEConnector'; // SSE 연결 함수
import categories from '../../data/categories.json';
import RNFS from 'react-native-fs';
import { LibraryContext } from '../../contexts/LibraryContext'; // LibraryContext 가져오기

const { width, height } = Dimensions.get('window');

type RegisterBookModalProps = {
  isVisible: boolean;
  onClose: () => void;
};

const RegisterBookModal: React.FC<RegisterBookModalProps> = ({ isVisible, onClose }) => {
  const { setAllBooks } = useContext(LibraryContext)!; // 전역 상태 업데이트 함수 가져오기
  const [currentStep, setCurrentStep] = useState<'selectFileType' | 'fileUpload' | 'metaDataInput' | 'loading' | null>('selectFileType');
  const [selectedFileType, setSelectedFileType] = useState<'pdf' | 'epub' | null>(null);
  const [uploadedFile, setUploadedFile] = useState<{ file: any | null; cover: any | null }>({ file: null, cover: null });
  const [metaData, setMetaData] = useState<{ title: string; author: string; category: string }>({
    title: '',
    author: '',
    category: '',
  });
  const [loadingMessage, setLoadingMessage] = useState('파일 업로드 준비 중...');
  const [isLoading, setIsLoading] = useState(false);
  const [isPickerVisible, setPickerVisible] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0); // 업로드 진행률
  const [requestId, setRequestId] = useState<string>(uuidv4()); // 고유 채널 ID
  const [startTime, setStartTime] = useState<number | null>(null); // 업로드 시작 시간
  const [elapsedTime, setElapsedTime] = useState<string>('0분 0초'); // 경과 시간

  useEffect(() => {
    if (isVisible) {
      resetModal();
    }
  }, [isVisible]);

  const resetModal = () => {
    setCurrentStep('selectFileType');
    setSelectedFileType(null);
    setUploadedFile({ file: null, cover: null });
    setMetaData({ title: '', author: '', category: '001' });
    setIsLoading(false);
    setLoadingMessage('');
    setUploadProgress(0);
    setStartTime(null); // 초기화
    setElapsedTime('0분 0초');
    setRequestId(uuidv4());
  };

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;

    if (currentStep === 'loading' && startTime) {
      timer = setInterval(() => {
        const duration = Math.floor((Date.now() - startTime) / 1000);
        const minutes = Math.floor(duration / 60);
        const seconds = duration % 60;
        setElapsedTime(`${minutes}분 ${seconds}초`);
      }, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [currentStep, startTime]);

  const handleFileTypeSelection = (fileType: 'pdf' | 'epub') => {
    setSelectedFileType(fileType);
    setCurrentStep('fileUpload');
  };

  const handleFileUpload = async (type: 'file' | 'cover') => {
    try {
      const fileType = type === 'file'
        ? selectedFileType === 'pdf'
          ? DocumentPicker.types.pdf
          : DocumentPicker.types.allFiles
        : DocumentPicker.types.images;

      const res = await DocumentPicker.pick({ type: [fileType] });

      if (type === 'file' && selectedFileType === 'epub' && !res[0].name.toLowerCase().endsWith('.epub')) {
        alert('ePub 파일만 업로드할 수 있습니다.');
        return;
      }

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
    setLoadingMessage('SSE 연결 중...');
    setIsLoading(true);
    setStartTime(Date.now()); // 업로드 시작 시간 기록

    // SSE 연결
    const disconnectSSE = connectToSSE(
      requestId,
      (data) => {
        setUploadProgress(data.progress);
        setLoadingMessage(`진행률: ${data.progress}% - ${data.status}`);
      },
      (error) => {
        console.error('SSE Error:', error);
        Alert.alert('SSE 오류', '실시간 진행 정보를 가져오는 중 오류가 발생했습니다.');
      }
    );

    try {
      const response = await uploadBookFile(
        selectedFileType!,
        uploadedFile.file!,
        uploadedFile.cover!,
        metaData,
        requestId
      );

      disconnectSSE(); // SSE 연결 종료
      const { epub, metadata } = response;

      if (!epub) throw new Error('EPUB URL이 반환되지 않았습니다.');

      const downloadedFilePath = await downloadFileFromUrl(epub, `${metadata.title}.epub`);
      const bookData = {
        id: Date.now(),
        bookId: metadata.book_id,
        title: metadata.title,
        cover: metadata.cover,
        category: metadata.category,
        author: metadata.author,
        filePath: downloadedFilePath,
        createdAt: metadata.created_at,
      };

      await saveBookToLocalDatabase(bookData);
      setAllBooks((prevBooks) => [...prevBooks, bookData]);
      Alert.alert('등록 완료', '도서가 성공적으로 등록되었습니다!');
    } catch (error) {
      disconnectSSE(); // 에러 발생 시에도 SSE 종료
      Alert.alert('오류', '등록 중 문제가 발생했습니다.');
    } finally {
      setIsLoading(false);
      onClose();
    }
  };

  return (
    <Modal visible={isVisible} transparent animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
        {currentStep === 'loading' && (
            <View style={styles.loadingContainer}>
              <Text style={styles.guideText}>도서 변환 과정은 시간이 소요될 수 있습니다. 잠시만 기다려주세요.</Text>
              <Text style={styles.loadingText}>{`진행률: ${uploadProgress}%`}</Text>
              <ActivityIndicator size="large" color="#3943B7" />
              <Text style={styles.statusMessage}>{loadingMessage}</Text>
              <Text style={styles.timerText}>경과 시간: {elapsedTime}</Text>
            </View>
          )}

          {/* Select File Type */}
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

          {/* File Upload */}
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

          {/* Meta Data Input */}
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
                    {categories.find((item) => item.category_id === metaData.category)?.category_name || '카테고리 선택'}
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
