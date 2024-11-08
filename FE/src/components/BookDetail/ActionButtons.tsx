import React from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
import Btn from '../../components/Btn';
import styles from '../../styles/BookDetail/ActionButtonsStyle';
import { useNavigation } from '@react-navigation/native';

interface ActionButtonsProps {
  likedFlag: boolean;
  downloaded: boolean;
  onLikeToggle: () => void;
  bookId: number;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ likedFlag, downloaded, onLikeToggle, bookId }) => {
  const navigation = useNavigation();

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

      {/* 바로 보기와 다운로드 아이콘 */}
      <View style={styles.buttonContainerWithMargin}>
        <View style={styles.buttonWrapper}>
          <Btn
            title="바로 보기"
            btnSize={1}
            onPress={() => {}}
            accessibilityLabel="바로 보기 버튼"
            disabled={!downloaded} // 다운로드 여부에 따라 활성화/비활성화
          />
        </View>
        <View style={styles.iconWrapper}>
          <Image
            source={require('../../assets/icons/download2.png')}
            style={styles.iconImage}
            accessibilityLabel="다운로드 아이콘"
          />
        </View>
      </View>
    </>
  );
};

export default ActionButtons;
