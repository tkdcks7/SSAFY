import React, { useState, useEffect, useRef } from 'react';
import { View, TouchableOpacity, Text, Image, StyleSheet, Dimensions, FlatList } from 'react-native';
import plusIcon from '../../assets/icons/plus.png';
import leftIcon from '../../assets/icons/left.png';
import rightIcon from '../../assets/icons/right.png';
import { launchImageLibrary } from 'react-native-image-picker';

const { width, height } = Dimensions.get('window');

interface ImageUploadSectionProps {
  uploadedImages: string[];
  onAddImage: (newImage: string) => void;
  onSelectImage: (index: number) => void;
  onSetCoverImage: (index: number) => void;
}

const ImageUploadSection: React.FC<ImageUploadSectionProps> = ({
  uploadedImages = [],
  onAddImage,
  onSelectImage,
  onSetCoverImage,
}) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    setImages(uploadedImages || []);
  }, [uploadedImages]);

  const handleAddImage = async () => {
    const options = {
      mediaType: 'photo',
      quality: 1,
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.error('ImagePicker Error: ', response.errorMessage);
      } else if (response.assets && response.assets.length > 0) {
        response.assets.forEach((asset) => {
          if (asset.type === 'image/jpeg' || asset.type === 'image/jpg' || asset.type === 'image/png') {
            const newImages = [...images, asset.uri];
            setImages(newImages);
            onAddImage(asset.uri);
          } else {
            alert('Only jpeg, jpg, and png images are allowed.');
          }
        });
      }
    });
  };

  const handleImageClick = (index: number) => {
    setSelectedImageIndex(index);
    onSelectImage(index);

    // 선택된 이미지로 스크롤
    if (flatListRef.current) {
      flatListRef.current.scrollToIndex({
        animated: true,
        index: index,
        viewPosition: 0.5, // 중앙에 위치하도록 설정
      });
    }
  };

  const handleMoveLeft = () => {
    if (selectedImageIndex !== null && selectedImageIndex > 0) {
      const newIndex = selectedImageIndex - 1;
      handleImageClick(newIndex);
    }
  };

  const handleMoveRight = () => {
    if (selectedImageIndex !== null && selectedImageIndex < images.length - 1) {
      const newIndex = selectedImageIndex + 1;
      handleImageClick(newIndex);
    }
  };

  const renderItem = ({ item, index }: { item: string; index: number }) => (
    <TouchableOpacity
      key={`image-${index}`}
      onPress={() => handleImageClick(index)}
      style={[
        styles.imageContainer,
        selectedImageIndex === index && styles.selectedImage, // 포커스 스타일 추가
      ]}
    >
      <Image source={{ uri: item }} style={styles.image} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.scrollContainer}>
        <FlatList
          ref={flatListRef} // FlatList 참조 설정
          data={[...images, 'plus-button']}
          renderItem={({ item, index }) =>
            item === 'plus-button' ? (
              <TouchableOpacity key="plus-button" onPress={handleAddImage} style={styles.addImageContainer}>
                <Image source={plusIcon} style={styles.plusIcon} />
              </TouchableOpacity>
            ) : (
              renderItem({ item, index })
            )
          }
          keyExtractor={(item, index) => `image-${index}`}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.flatListContent}
          extraData={selectedImageIndex} // 선택 상태에 반응하도록 설정
        />
      </View>
      <View style={styles.imageCountContainer}>
        <View style={styles.imageCountSection}>
          {selectedImageIndex !== null && images.length > 0 && (
            <>
              <TouchableOpacity onPress={handleMoveLeft} style={styles.moveButton}>
                <Image source={leftIcon} style={styles.moveIcon} />
              </TouchableOpacity>
              <Text style={styles.imageCountText}>
                {selectedImageIndex + 1}/{images.length}
              </Text>
              <TouchableOpacity onPress={handleMoveRight} style={styles.moveButton}>
                <Image source={rightIcon} style={styles.moveIcon} />
              </TouchableOpacity>
            </>
          )}
        </View>
        <View style={styles.coverButtonWrapper}>
          {images.length > 0 && selectedImageIndex !== null && selectedImageIndex >= 0 && (
            <TouchableOpacity style={styles.coverSettingButton} onPress={() => onSetCoverImage(selectedImageIndex)}>
              <Text style={styles.coverSettingText}>전자책 커버로 설정</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
  },
  scrollContainer: {
    marginVertical: height * 0.01,
    width: '100%',
  },
  flatListContent: {
    alignItems: 'center',
    paddingHorizontal: width * 0.02,
  },
  imageContainer: {
    width: width * 0.2,
    height: width * 0.25,
    marginRight: width * 0.03,
    borderRadius: 8,
    overflow: 'hidden',
  },
  selectedImage: {
    borderWidth: 3,
    borderColor: '#3943B7', // 선택된 이미지 테두리 강조
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  addImageContainer: {
    width: width * 0.2,
    height: width * 0.25,
    backgroundColor: '#e0e0e0',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    marginRight: width * 0.03,
  },
  plusIcon: {
    width: width * 0.1,
    height: width * 0.1,
  },
  imageCountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: '95%',
    paddingHorizontal: width * 0.01,
    marginTop: height * 0.01,
    marginBottom: height * 0.01,
  },
  imageCountSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageCountText: {
    fontSize: width * 0.06,
    fontWeight: 'bold',
    color: '#000000',
    marginHorizontal: width * 0.01, // 페이지 카운터 텍스트의 양쪽 여백 감소
  },
  moveButton: {
    padding: width * 0.02,
  },
  moveIcon: {
    width: width * 0.05,
    height: width * 0.05,
    resizeMode: 'contain',
  },
  coverButtonWrapper: {
    marginLeft: width * 0.05,
  },
  coverSettingButton: {
    backgroundColor: '#3943B7',
    paddingVertical: height * 0.012,
    paddingHorizontal: width * 0.1,
    borderRadius: 8,
  },
  coverSettingText: {
    color: '#FFFFFF',
    fontSize: width * 0.045,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default ImageUploadSection;
