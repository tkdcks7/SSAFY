import React, { useEffect } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, Dimensions, AccessibilityInfo } from 'react-native';

interface DownloadModalProps {
  isVisible: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const DownloadModal: React.FC<DownloadModalProps> = ({ isVisible, onClose, onConfirm }) => {
  useEffect(() => {
    if (isVisible) {
      AccessibilityInfo.announceForAccessibility('다운로드가 완료되었습니다. 바로 eBook을 읽으시겠습니까?');
    }
  }, [isVisible]);

  return (
    <Modal
      transparent
      visible={isVisible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent} accessibilityLiveRegion="polite">
          <Text
            style={styles.modalTitle}
            accessibilityLabel="다운로드 완료"
            accessibilityHint="eBook을 바로 읽을 수 있습니다."
          >
            다운로드가 완료되었습니다.
          </Text>
          <Text
            style={styles.modalMessage}
            accessibilityLabel="eBook을 읽으시겠습니까?"
          >
            바로 eBook을 읽으시겠습니까?
          </Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              onPress={onConfirm}
              style={styles.confirmButton}
              accessibilityLabel="확인 버튼"
              accessibilityHint="eBook을 열어 읽을 수 있습니다."
            >
              <Text style={styles.buttonText}>확인</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onClose}
              style={styles.cancelButton}
              accessibilityLabel="취소 버튼"
              accessibilityHint="eBook을 열지 않고 닫습니다."
            >
              <Text style={styles.buttonText}>취소</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: width * 0.85,
    padding: width * 0.05,
    backgroundColor: 'white',
    borderRadius: width * 0.02,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: width * 0.06,
    fontWeight: 'bold',
    marginBottom: height * 0.02,
  },
  modalMessage: {
    fontSize: width * 0.05,
    marginBottom: height * 0.03,
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
  },
  confirmButton: {
    width: '100%',
    paddingVertical: height * 0.02,
    backgroundColor: '#3943B7',
    borderRadius: width * 0.02,
    alignItems: 'center',
    marginBottom: height * 0.015,
  },
  cancelButton: {
    width: '100%',
    paddingVertical: height * 0.02,
    backgroundColor: '#ccc',
    borderRadius: width * 0.02,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: width * 0.05,
    fontWeight: 'bold',
    color: 'white',
  },
});

export default DownloadModal;
