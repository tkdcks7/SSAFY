import React, { useState, useEffect, useContext } from 'react';
import { View, TouchableOpacity, Image, Alert, AccessibilityInfo } from 'react-native';
import Btn from '../../components/Btn';
import styles from '../../styles/BookDetail/ActionButtonsStyle';
import { useNavigation } from '@react-navigation/native';
import {
  downloadBook,
  saveBookToLocalDatabase,
  downloadFileFromUrl,
  isBookAlreadyDownloaded,
  toggleBookCart,
} from '../../services/BookDetail/BookDetail';
import DownloadModal from './DownloadModal';
import { LibraryContext } from '../../contexts/LibraryContext';

interface ActionButtonsProps {
  likedFlag: boolean;
  epubFlag: boolean;
  initialCartFlag: boolean;
  bookId: number;
  onLikeToggle: () => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  likedFlag,
  epubFlag,
  initialCartFlag,
  bookId,
  onLikeToggle,
}) => {
  const navigation = useNavigation();
  const { addBook } = useContext(LibraryContext)!; // LibraryContext에서 addBook 가져오기
  const [isModalVisible, setModalVisible] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [cartFlag, setCartFlag] = useState(initialCartFlag); // true: 담기된 상태, false: 담기되지 않음
  const [isAlreadyDownloaded, setAlreadyDownloaded] = useState(false);

  useEffect(() => {
    const checkDownloadStatus = async () => {
      const downloaded = await isBookAlreadyDownloaded(bookId, '맹꽁이 서당'); // 제목은 실제 데이터에서 가져오기
      setAlreadyDownloaded(downloaded);
    };

    checkDownloadStatus();
  }, [bookId]);

  const handleDownload = async () => {
    try {
      setDownloading(true);

      if (isAlreadyDownloaded) {
        setDownloading(false);
        Alert.alert('다운로드 완료', '이미 다운로드된 도서입니다.');
        return;
      }

      const metadata = await downloadBook(bookId);
      const filePath = await downloadFileFromUrl(metadata.url, `${metadata.title}.epub`);

      const downloadDate = new Date().toISOString();
      const bookData = {
        id: Date.now(), // 고유 ID 생성
        bookId: metadata.bookId,
        title: metadata.title,
        cover: metadata.cover,
        coverAlt: metadata.coverAlt,
        category: metadata.category,
        author: metadata.author,
        publisher: metadata.publisher,
        publishedAt: metadata.publishedAt,
        createdAt: metadata.createdAt,
        dtype: metadata.dtype,
        filePath,
        downloadDate,
        myTtsFlag: metadata.myTtsFlag,
        currentCfi: '',
        progressRate: 0,
      };

      await saveBookToLocalDatabase(bookData);
      addBook(bookData); // 전역 상태에 새 도서 추가

      setAlreadyDownloaded(true);
      setDownloading(false);
      setModalVisible(true);

      AccessibilityInfo.announceForAccessibility('도서가 성공적으로 다운로드되었습니다.');
    } catch (error) {
      setDownloading(false);
      Alert.alert('다운로드 실패', '파일을 다운로드할 수 없습니다.');
    }
  };

  const handleToggleCart = async () => {
    try {
      await toggleBookCart(bookId, !cartFlag); // cartFlag 반전하여 요청
      setCartFlag((prev) => !prev);
      AccessibilityInfo.announceForAccessibility(
        cartFlag ? '도서가 목록에서 제거되었습니다.' : '도서가 담겼습니다.'
      );
      Alert.alert('성공', cartFlag ? '도서가 목록에서 제거되었습니다.' : '도서가 담겼습니다.');
    } catch (error) {
      AccessibilityInfo.announceForAccessibility('도서 상태 변경에 실패했습니다.');
      Alert.alert('오류', '도서 상태를 변경할 수 없습니다.');
    }
  };

  return (
    <>
      {/* 리뷰 보기와 좋아요 아이콘 */}
      <View style={styles.buttonContainerWithMargin}>
        <View style={styles.buttonWrapper}>
          <Btn
            title="리뷰 보기"
            btnSize={1}
            onPress={() => navigation.navigate('Review', { bookId })}
            accessibilityLabel="리뷰 보기 버튼"
          />
        </View>
        <View style={styles.iconWrapper}>
          <TouchableOpacity onPress={onLikeToggle} accessibilityLabel="좋아요 아이콘">
            <Image
              source={likedFlag ? require('../../assets/icons/heart.png') : require('../../assets/icons/heart2.png')}
              style={styles.iconImage}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* 도서 담기/삭제와 다운로드 아이콘 */}
      <View style={styles.buttonContainerWithMargin}>
        <View style={styles.buttonWrapper}>
          <Btn
            title={cartFlag ? '담은 도서 빼기' : '도서 담기'}
            btnSize={1}
            onPress={handleToggleCart}
            accessibilityLabel={cartFlag ? '담은 도서 빼기 버튼' : '도서 담기 버튼'}
            accessibilityHint={cartFlag ? '도서를 담은 목록에서 제거합니다.' : '도서를 담을 수 있습니다.'}
          />
        </View>
        <View style={styles.iconWrapper}>
          <TouchableOpacity
            onPress={handleDownload}
            disabled={!epubFlag || downloading || isAlreadyDownloaded}
            accessibilityLabel="다운로드 아이콘"
            accessibilityHint={
              !epubFlag
                ? '현재 EPUB 파일이 없습니다.'
                : isAlreadyDownloaded
                ? '이미 다운로드된 도서입니다.'
                : '파일을 다운로드합니다.'
            }
          >
            <Image
              source={require('../../assets/icons/download2.png')}
              style={[styles.iconImage, (!epubFlag || downloading || isAlreadyDownloaded) && { opacity: 0.5 }]}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* 다운로드 후 모달 */}
      <DownloadModal
        isVisible={isModalVisible}
        onClose={() => setModalVisible(false)}
        onConfirm={() => {
          setModalVisible(false);
          navigation.navigate('EBookReader', { bookId }); // eBook 리더로 이동
        }}
      />
    </>
  );
};

export default ActionButtons;
