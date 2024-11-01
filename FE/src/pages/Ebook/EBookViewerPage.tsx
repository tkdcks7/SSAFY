// src/pages/Ebook/EBookViewerPage.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Image, Dimensions, Button } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { LibraryStackParamList } from '../../navigation/LibraryNavigator';
import { StackNavigationProp } from '@react-navigation/stack';
import { Reader } from '@epubjs-react-native/core';
import { useFileSystem } from '@epubjs-react-native/file-system';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import leftarrowicon from '../../assets/icons/leftarrow.png';
import searchicon from '../../assets/icons/search.png';
import ProgressBar from '../../components/viewer/ProgressBar';

// 모달 등
import EbookIndex from '../../components/viewer/EbookIndex';
import EbookBookNote from '../../components/viewer/EbookBootNote';
import EbookSetting from '../../components/viewer/EbookSetting';


// 아이콘
import noteicon from '../../assets/icons/notes.png';
import indexmenuicon from '../../assets/icons/indexmenu.png';
import settingicon from '../../assets/icons/setting.png';
import headphoneicon from '../../assets/icons/headphone.png';
import prevbuttonicon from '../../assets/icons/pervbutton.png';
import playbuttonicon from '../../assets/icons/playbutton.png';
import pausebuttonicon from '../../assets/icons/pausebutton.png';


type EBookViewerPageRouteProp = RouteProp<LibraryStackParamList, 'EBookViewer'>;
type EBookViewerPageNavigateProp = StackNavigationProp<RootStackParamList, 'EBookViewer'>;

type Props = {
  route: EBookViewerPageRouteProp;
  navigation: EBookViewerPageNavigateProp;
};

const { width, height } = Dimensions.get('window');


// src에 Ebook의 주소를 넣어줘야하는데, local 파일의 경우 따로 로직 처리를 해서 주소를 넣어줘야함.
const EBookViewerPage: React.FC<Props> = ({ route, navigation }) => {
  const { bookId } = route.params;
  const [progress, setProgress] = useState<number>(0);
  const [ isTTSMode, setIsTTSMode ] = useState<boolean>(false);
  const [ isTTSPlaying, setIsTTSPlaying ] = useState<boolean>(false);


  // 화면 크기를 상태로 관리
  const [screenDimensions, setScreenDimensions] = useState(Dimensions.get('window'));
  // 화면 크기 업데이트 함수
  const updateDimensions = () => {
    setScreenDimensions(Dimensions.get('window'));
  };
  // 화면 회전 이벤트 리스너 추가
  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', updateDimensions);
    return () => subscription.remove(); // 컴포넌트 언마운트 시 리스너 제거
  }, []);
  const animHeight = screenDimensions.height * 0.20;

  // 애니메이션 설정
    // 네비게이션 바의 Y 위치를 조절하는 애니메이션 값
    const translateYNav = useSharedValue(-animHeight); // 초기에는 화면 밖에 위치
    const translateYFoot = useSharedValue(animHeight);
    const indexSidebarX = useSharedValue(-width);
    const bookNoteSideBarX = useSharedValue(width);
    const settingSideBarX = useSharedValue(width);

    // 네비게이션 바의 표시 여부 상태
    const isVisible = useSharedValue(false);
    // Nav 애니메이션 스타일
    const animatedStyleNav = useAnimatedStyle(() => { return { transform: [{ translateY: translateYNav.value }] }; });
    // footer 토글 애니메이션 스타일
    const animatedStyleFoot = useAnimatedStyle(() => { return { transform: [{ translateY: translateYFoot.value }] }; });

    // 네비게이션 바 표시/숨기기 핸들러
    const toggleNav = useCallback(() => {
      isVisible.value = !isVisible.value;
      // 네비게이션 바 위치 조절
      translateYNav.value = withTiming(isVisible.value ? 0 : -animHeight, { duration: 200 });
      translateYFoot.value = withTiming(isVisible.value ? 0 : animHeight, { duration: 200 });
    }, []);
    // useCallback을 이용하여 Index 토글하는 함수 메모이제이션
    const toggleIndex = useCallback(() => {
      indexSidebarX.value = indexSidebarX.value === 0 ? withTiming(-width, { duration: 200 }) : withTiming(0, { duration: 200 });
    }, []);
    // useCallback을 이용하여 설정창을 토글하는 함수 메모이제이션
    const toggleBookNote = useCallback(() => {
      bookNoteSideBarX.value = bookNoteSideBarX.value === 0 ? withTiming(width, { duration: 200 }) : withTiming(0, { duration: 200 });
    }, []);
    // useCallback을 이용하여 설정창을 토글하는 함수 메모이제이션
    const toggleSetting = useCallback(() => {
      settingSideBarX.value = settingSideBarX.value === 0 ? withTiming(width, { duration: 200 }) : withTiming(0, { duration: 200 });
    }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {/* 네비게이션 바 */}
      <Animated.View style={[styles.navBar, animatedStyleNav]}>
        {
          isTTSMode
          ? (
            <TouchableOpacity onPress={() => setIsTTSMode(false)} style={styles.ttsEndBox}>
              <Text style={[styles.navBarText, { color: 'black' }]}>TTS 모드 종료</Text>
            </TouchableOpacity>
          )
          :(
          <>
          <TouchableOpacity>
            <Image source={leftarrowicon} style={styles.icon} />
          </TouchableOpacity>
            <Text style={styles.navBarText}>책 타이틀</Text>
            <TouchableOpacity>
            <Image source={searchicon} style={styles.icon} />
          </TouchableOpacity>
          </>
          )
        }
      </Animated.View>
      {/* 사이드바 */}
      <EbookIndex indexSidebarX={indexSidebarX} toggleIndex={toggleIndex}/>
      {/* 독서노트 */}
      <EbookBookNote bookNoteSideBarX={bookNoteSideBarX} toggleBookNote={toggleBookNote}/>
      {/* 설정창 */}
      <EbookSetting settingSideBarX={settingSideBarX} toggleSetting={toggleSetting}/>
      <TouchableOpacity style={{ flex: 1 }} onPress={toggleNav}>
        <Reader
          src="https://s3.amazonaws.com/moby-dick/OPS/package.opf"
          fileSystem={useFileSystem}
        />
  </TouchableOpacity>
  {/* 네비게이션 바 */}
  <Animated.View style={[styles.footer, animatedStyleFoot]}>
    <View style={styles.progressview}>
      <View>
      <Text>{progress*100}%</Text>
      </View>
      <ProgressBar progress={progress}/>
    </View>
    <View style={[styles.progressview, {borderTopWidth: 2, paddingTop: 20}]}>
      {
        isTTSMode
        ? (
          <>
            <TouchableOpacity onPress={() => {}}>
              <Image source={prevbuttonicon} style={styles.footericon} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setIsTTSPlaying(!isTTSPlaying)}>
              {
                isTTSPlaying
                ? <Image source={pausebuttonicon} style={styles.footericon} />
                : <Image source={playbuttonicon} style={styles.footericon} />
              }
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {}}>
              <Image source={prevbuttonicon} style={[styles.footericon, {transform: [{scaleX: -1}]}]} />
            </TouchableOpacity>
            <TouchableOpacity onPress={toggleSetting}>
              <Image source={settingicon} style={styles.footericon} />
            </TouchableOpacity>
          </>
        )
        : (
          <>
            <TouchableOpacity onPress={toggleIndex}>
              <Image source={indexmenuicon} style={styles.footericon} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setIsTTSMode(true)}>
              <Image source={headphoneicon} style={styles.footericon} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {toggleBookNote}}>
              <Image source={noteicon} style={styles.footericon} />
            </TouchableOpacity>
            <TouchableOpacity onPress={toggleSetting}>
              <Image source={settingicon} style={styles.footericon} />
            </TouchableOpacity>
          </>
        )
      }
    </View>
  </Animated.View>
</SafeAreaView>
  );
};

const styles = StyleSheet.create({
  navBar: {
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
    fontSize: width * 0.1, // 상대적인 글꼴 크기
    fontWeight: 'bold',
  },
  button: {
    marginTop: height * 0.2, // 상대적인 마진
    padding: width * 0.03, // 상대적인 패딩
    backgroundColor: '#3943B7',
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: width * 0.04, // 상대적인 글꼴 크기
  },
  icon: {
    width: width * 0.1, // 화면 너비의 10%
    height: width * 0.1, // 화면 너비의 10% (정사각형)
    tintColor: 'white',
  },
  footericon: {
    width: width * 0.1, // 화면 너비의 10%
    height: width * 0.1, // 화면 너비의 10% (정사각형)
    tintColor: 'black'
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: height * 0.20,
    backgroundColor: 'white',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 10,
    paddingVertical: width * 0.08,
    borderWidth: 1,
  },
  progressview: {
    width: '100%',
    paddingHorizontal: width * 0.03,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sidebar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: '100%',
    // justifyContent: 'center',
    // alignItems: 'center',
    zIndex: 11
  },
  sidebarText: {
    color: '#FFFFFF',
    fontSize: 18,
  },
  ttsEndBox: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '80%',
    backgroundColor: 'white'
  }
});

export default EBookViewerPage;