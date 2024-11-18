// src/components/viewer/EBookSetting.tsx
import React, {useEffect, useState} from 'react';
import {
  Text,
  View,
  ScrollView,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Image,
} from 'react-native';
import leftarrowicon from '../../assets/icons/leftarrow.png';
import IndexChapter from './IndexChapter';
import Animated, {useAnimatedStyle, SharedValue} from 'react-native-reanimated';
import {Theme} from '@epubjs-react-native/core';
import useSettingStore from '../../store/settingStore';
import {useNavigation} from '@react-navigation/native';

// 모달
import FontSizeSettingModal from './FontSizeSettingModal';

// 하위 컴포넌트의 Props 타입 정의
type SidebarProps = {
  settingSideBarX: SharedValue<number>;
  toggleSetting: () => void; // onPress는 반환값이 없는 함수 타입
  changeFontSize: (size: string) => void;
  changeTheme: (theme: Theme) => void;
};

const {width, height} = Dimensions.get('window');

const EbookSetting: React.FC<SidebarProps> = ({
  settingSideBarX,
  toggleSetting,
  changeFontSize,
}) => {
  // 모달 띄워진 상태
  const [isFontSizeModalOpen, setIsFontSizeModalOpen] =
    useState<boolean>(false);

  const {isDarkMode, setIsDarkMode} = useSettingStore();

  const navigation = useNavigation();

  const animatedIndexStyle = useAnimatedStyle(() => ({
    transform: [{translateX: settingSideBarX.value}],
  }));

  const handleFontSizeModalClose = () => {
    setIsFontSizeModalOpen(false);
  };

  // 다크 모드 OR 라이트 모드 전환
  const handleSwitchDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    navigation.goBack();
  };

  return (
    <Animated.View style={[styles.sidebar, animatedIndexStyle]}>
      <View style={styles.navBar}>
        <TouchableOpacity onPress={toggleSetting}>
          <Image source={leftarrowicon} style={styles.icon} />
        </TouchableOpacity>
        <Text style={styles.navBarText}>뷰어 설정</Text>
        <View accessible={false} />
      </View>
      <ScrollView style={{flex: 1, marginTop: height * 0.1}}>
        <IndexChapter
          chapter={'글자 크기'}
          onPress={() => setIsFontSizeModalOpen(!isFontSizeModalOpen)}
        />
        <IndexChapter
          chapter={isDarkMode ? '라이트 모드 전환' : '다크 모드 전환'}
          onPress={handleSwitchDarkMode}
        />
      </ScrollView>
      {isFontSizeModalOpen ? (
        <FontSizeSettingModal
          changeFontSize={changeFontSize}
          closeModal={handleFontSizeModalClose}
        />
      ) : null}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  navBar: {
    flex: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: height * 0.1, // 상대적인 높이 (화면 높이의 10%)
    backgroundColor: '#3943B7',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 10,
    flexDirection: 'row',
    paddingHorizontal: width * 0.03,
  },
  navBarText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: width * 0.1, // 상대적인 글꼴 크기
  },
  icon: {
    width: width * 0.1, // 화면 너비의 10%
    height: width * 0.1, // 화면 너비의 10% (정사각형)
    tintColor: 'white',
  },
  sidebar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: '100%',
    backgroundColor: '#FFFFFF',

    zIndex: 12,
  },
});

export default EbookSetting;
