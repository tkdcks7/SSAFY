import React from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet } from 'react-native';

interface DownloadModalProps {
  isVisible: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const DownloadModal: React.FC<DownloadModalProps> = ({ isVisible, onClose, onConfirm }) => {
  return (
    <Modal
      transparent
      visible={isVisible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>다운로드가 완료되었습니다.</Text>
          <Text style={styles.modalMessage}>바로 eBook을 읽으시겠습니까?</Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={onClose} style={styles.cancelButton}>
              <Text style={styles.buttonText}>취소</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onConfirm} style={styles.confirmButton}>
              <Text style={styles.buttonText}>확인</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
      width: '80%',
      padding: 20,
      backgroundColor: 'white',
      borderRadius: 10,
      alignItems: 'center',
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 10,
    },
    modalMessage: {
      fontSize: 16,
      marginBottom: 20,
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
    },
    cancelButton: {
      flex: 1,
      marginRight: 5,
      padding: 10,
      backgroundColor: '#ccc',
      borderRadius: 5,
      alignItems: 'center',
    },
    confirmButton: {
      flex: 1,
      marginLeft: 5,
      padding: 10,
      backgroundColor: '#3943B7',
      borderRadius: 5,
      alignItems: 'center',
    },
    buttonText: {
      color: 'white',
      fontWeight: 'bold',
    },
  });

export default DownloadModal;

