import React from 'react';
import { View, Image, StyleSheet, TouchableOpacity, Text, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

interface SelectedImageViewProps {
  image: string;
  onRemoveImage: () => void;
  isCoverImage: boolean;
  onRemoveCoverImage: () => void;
}

const SelectedImageView: React.FC<SelectedImageViewProps> = ({
  image,
  onRemoveImage,
  isCoverImage,
  onRemoveCoverImage,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: image }} style={styles.image} />
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.deleteButton} onPress={onRemoveImage}>
          <Text style={styles.buttonText}>이미지 삭제</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.coverButton, !isCoverImage && styles.disabledButton]}
          onPress={isCoverImage ? onRemoveCoverImage : undefined}
          disabled={!isCoverImage}
        >
          <Text style={[styles.buttonText, !isCoverImage && styles.disabledButtonText]}>커버 해제</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
  },
  imageContainer: {
    width: '95%',
    height: height * 0.4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: height * 0.01, // 버튼과 이미지 사이의 여백 축소
    width: '90%',
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
    paddingVertical: height * 0.01,
    paddingHorizontal: width * 0.08,
    borderRadius: 8,
    alignItems: 'center',
  },
  coverButton: {
    backgroundColor: '#3943B7',
    paddingVertical: height * 0.01,
    paddingHorizontal: width * 0.1,
    borderRadius: 8,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#B0B0B0',
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: width * 0.05, // 버튼 글자 크기 약간 축소
  },
  disabledButtonText: {
    color: '#E0E0E0',
  },
});

export default SelectedImageView;
