// src/components/viewer/EBookSetting.tsx
import React, { useState } from 'react';
import { Text, View, ScrollView, StyleSheet, Dimensions, TouchableOpacity, Image } from 'react-native';
import leftarrowicon from '../../assets/icons/leftarrow.png';
import IndexChapter from './IndexChapter';
import Animated, { useAnimatedStyle, SharedValue } from 'react-native-reanimated';

// 모달
import SpeedModal from './SpeedModal';
import VoiceSelectModal from './VoiceSelectModal';
import TimerModal from './TimerModal';

// 하위 컴포넌트의 Props 타입 정의
type SidebarProps = {
  settingTTSSideBarX: SharedValue<number>;
  toggleTTSSetting: () => void; // onPress는 반환값이 없는 함수 타입
};

const { width, height } = Dimensions.get('window');

const EbookTTSSetting: React.FC<SidebarProps> = ({ settingTTSSideBarX, toggleTTSSetting }) => {
    // 모달 띄워진 상태
    const [ isSpeedModalOpen, setisSpeedModalOpen ] = useState<boolean>(false);
    const [ isVoiceSelectModalOpen, setIsVoiceSelectModalOpen ] = useState<boolean>(false);
    const [ isTimerModalOpen, setIsTimerModalOpen ] = useState<boolean>(false);


  const animatedIndexStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: settingTTSSideBarX.value }],
  }));

  const handleSpeedModalClose = () => {
    setisSpeedModalOpen(false);
  }

  const handleVoiceSelectModalClose = () => {
    setIsVoiceSelectModalOpen(false);
  }

  const handleTimerModalClose = () => {
    setIsTimerModalOpen(false);
  }

  return (
    <Animated.View style={[styles.sidebar, animatedIndexStyle]}>
        <View style={styles.navBar}>
            <TouchableOpacity onPress={toggleTTSSetting}>
                <Image
                source={leftarrowicon}
                style={styles.icon}
                />
            </TouchableOpacity>
            <Text style={styles.navBarText}>뷰어 설정</Text>
            <View accessible={false}/>
        </View>
        <ScrollView style={{ flex: 1, marginTop: height * 0.1 }}>
            <IndexChapter chapter={'TTS 속도'} onPress={() => setisSpeedModalOpen(!isSpeedModalOpen)}/>
            <IndexChapter chapter={'TTS 보이스'} onPress={() => setIsVoiceSelectModalOpen(!isVoiceSelectModalOpen)}/>
            <IndexChapter chapter={'TTS 타이머'} onPress={() => setIsTimerModalOpen(!isTimerModalOpen)}/>
        </ScrollView>
        { isSpeedModalOpen ? <SpeedModal closeModal={handleSpeedModalClose} /> : null }
        { isVoiceSelectModalOpen ? <VoiceSelectModal closeModal={handleVoiceSelectModalClose} /> : null }
        { isTimerModalOpen ? <TimerModal closeModal={handleTimerModalClose} /> : null }
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
      // justifyContent: 'center',
      // alignItems: 'center',
      zIndex: 12,
    },
})

export default EbookTTSSetting;