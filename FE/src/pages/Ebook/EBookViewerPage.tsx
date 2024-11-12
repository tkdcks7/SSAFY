// src/pages/Ebook/EBookViewerPage.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Image, Dimensions, Button } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { LibraryStackParamList } from '../../navigation/LibraryNavigator';
import { StackNavigationProp } from '@react-navigation/stack';
import { Reader, useReader, Location, Annotation, AnnotationType } from '@epubjs-react-native/core';
import { useFileSystem } from '@epubjs-react-native/file-system';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import leftarrowicon from '../../assets/icons/leftarrow.png';
import searchicon from '../../assets/icons/search.png';
import ProgressBar from '../../components/viewer/ProgressBar';
import EbookSearch from '../../components/viewer/EbookSearch';
import Tts from 'react-native-tts';

// 모달 등
import EbookIndex from '../../components/viewer/EbookIndex';
import EbookBookNote from '../../components/viewer/EbookBootNote';
import EbookSetting from '../../components/viewer/EbookSetting';
import EbookTTSSetting from '../../components/viewer/EbookTTSSetting';


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

type FormContent = {
  sentence: string;
  cfisRange: string;
}

const { width, height } = Dimensions.get('window');


// src에 Ebook의 주소를 넣어줘야하는데, local 파일의 경우 따로 로직 처리를 해서 주소를 넣어줘야함.
const EBookViewerPage: React.FC<Props> = ({ route, navigation }) => {
  const { bookId } = route.params;
  const [progress, setProgress] = useState<number>(0);
  const [ isTTSMode, setIsTTSMode ] = useState<boolean>(false);
  const [ isTTSPlaying, setIsTTSPlaying ] = useState<boolean | null>(null);
  const [ isSearching, setIsSearching ] = useState<boolean>(false);
  const [ formArr, setFromArr ] = useState<FormContent[]>([]);
  const [ tempMark, setTempMark ] = useState<Annotation | null>(null);
  const [ ttsIdx, setttsIdx ] = useState<number>(0);
  const [ lastInitialCfi, setLastInitialCfi ] = useState<string>('');

  const { changeTheme, removeAnnotationByCfi, removeAnnotation, getCurrentLocation, annotations, changeFontSize, getLocations, goToLocation, section, addAnnotation, injectJavascript, goNext  } = useReader();


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
  const saaa = `https://s3.ap-northeast-2.amazonaws.com/audisay/epub/published/valentin-hauy.epub?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20241112T070838Z&X-Amz-SignedHeaders=host&X-Amz-Expires=300&X-Amz-Credential=AKIA2YICALD7MZ3XV3TG%2F20241112%2Fap-northeast-2%2Fs3%2Faws4_request&X-Amz-Signature=6ec25ef2ea6ee821ad5b2007b86b1f9dae20975660c16328bab5063762a42864`

  // 애니메이션 설정
    // 네비게이션 바의 Y 위치를 조절하는 애니메이션 값
    const translateYNav = useSharedValue(-animHeight); // 초기에는 화면 밖에 위치
    const translateYFoot = useSharedValue(animHeight);
    const indexSidebarX = useSharedValue(-width);
    const bookNoteSideBarX = useSharedValue(width);
    const settingSideBarX = useSharedValue(width);
    const settingTTSSideBarX = useSharedValue(width);

    Tts.setDefaultLanguage('en-US');


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
    // useCallback을 이용하여 TTS설정창을 토글하는 함수 메모이제이션
    const toggleTTSSetting = useCallback(() => {
      settingTTSSideBarX.value = settingTTSSideBarX.value === 0 ? withTiming(width, { duration: 200 }) : withTiming(0, { duration: 200 });
    }, []);


  // 현재 Section의 데이터를 긁어 formArr에 주입하는 로직을 Javascript inject
  const getFormArr = () => { injectJavascript(`getFormArr();`); };

  // annotation 제거를 Javascript를 주입하여 해결
  const handleRemoveAnnotation = (cfiRangeOfAnnotation: string) => {
    const sss: string = "rendition.annotations.remove(" + "'" + cfiRangeOfAnnotation + "'" + ", 'highlight');";
    injectJavascript(sss);
  };

  // const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
  // const handleReading = async (idx: number) => {
  //   if (tempMark) { handleRemoveAnnotation(tempMark.cfiRange); }
  //   if (formArr[idx].pagenum > -1) { goNext(); }
  //   if (formArr.length > idx) {
  //     addAnnotation("highlight", formArr[idx].cfisRange);
  //     // await sleep(1500);
  //     await setTimeout(() => { handleReading(idx + 1); }, 1500);
  //   } else {
  //     goNext();
  //   }
  // };


  // WebView 단에서 동작하는 로직을 javascript를 주입하여 강제 실행
  const handlePageMoving = (cfisRange: string): void => {
    const allString: string = "handlePageMove(" + "'" + cfisRange + "'" + ")"
    injectJavascript(allString);
  };

  const playTextSequentially = (idx: number = 0) => {
    if (idx >= formArr.length) {
      console.log("TTS 끝!");
      setttsIdx(-1);
      goNext();
      if (isTTSPlaying) { setTimeout(() => {
        console.log("실행실행");
        if (formArr.length > 0) { playTextSequentially(0); }
      }, 8000); }
      return;
    }


    const item = formArr[idx];
    console.log(idx, item.cfisRange, item.sentence);
    setttsIdx(idx);
    Tts.speak(item.sentence);
    addAnnotation('highlight', item.cfisRange);
    if (idx > 0) { handleRemoveAnnotation(formArr[idx - 1].cfisRange); }
    handlePageMoving(item.cfisRange);
    // TTS 음성이 종료되면 무언가의 로직을 처리하도록 하거나, 안되면 문자 길이에 따라 Time을 조절해야할듯
    setTimeout(() => { playTextSequentially(idx + 1)}, 6000);
  };

  // Tts.addEventListener('tts-finish', playTextSequentially);

  const handleReadNoteSave = (): void => {
    console.log(`문장 저장 성공! index = ${ttsIdx}`);
    console.log(`저장된 문장=${formArr[ttsIdx].sentence}`);
    console.log(`저장된 cfi=${formArr[ttsIdx].cfisRange}`);
  }

  // 책 진행률 변경 핸들러
  const handleProgressGage = (): void => {
    const gage: number | undefined = getCurrentLocation()?.end.percentage;
    if (gage) { setProgress(gage); }
  };

  const handleTTSPlay = (): void => {
    if (isTTSPlaying) {
      setIsTTSPlaying(false);
    } else if (isTTSPlaying === null) {
      setIsTTSPlaying(true);
      if (formArr.length > 0) {
        playTextSequentially(0);
      }
    } else {
      setIsTTSPlaying(true);
      playTextSequentially(ttsIdx);
    }
  };

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
          : (
          <>
          <TouchableOpacity onPress={getFormArr}>
            <Image source={leftarrowicon} style={styles.icon} />
          </TouchableOpacity>
            <Text style={styles.navBarText}>책 타이틀</Text>
          <TouchableOpacity onPress={() => {}}>
            <Image source={searchicon} style={styles.icon} />
          </TouchableOpacity>
          </>
          )
        }
      </Animated.View>
      { isSearching ? <EbookSearch /> : null}
      {/* 사이드바 */}
      <EbookIndex indexSidebarX={indexSidebarX} toggleIndex={toggleIndex}/>
      {/* 독서노트 */}
      <EbookBookNote bookNoteSideBarX={bookNoteSideBarX} toggleBookNote={toggleBookNote}/>
      {/* 설정창 */}
      <EbookSetting settingSideBarX={settingSideBarX} toggleSetting={toggleSetting}/>
      {/* TTS 설정창 */}
      <EbookTTSSetting settingTTSSideBarX={settingTTSSideBarX} toggleTTSSetting={toggleTTSSetting}/>
      <TouchableOpacity style={{ flex: 1 }} onPress={toggleNav}>
        <Reader
          src={"https://s3.amazonaws.com/moby-dick/OPS/package.opf"}
          fileSystem={useFileSystem}
          flow='paginated'
          onLocationChange={() => handleProgressGage()}
          // onAddAnnotation={(annotation: Annotation<any>) => {setTempMark(annotation)}}
          // initialLocation="epubcfi(/6/2!/4/486[rgn_cnt_0498],/1:0,/1:23)"
          onWebViewMessage={(message) => {
            console.log(message);
            if (message?.formArr) {
              console.log("formArr 저장됨");
              if (formArr) {
                setFromArr([...message.formArr]);
              } else {
                setFromArr([...formArr, ...message.formArr]);
              }
            } else if (message?.gonextpage) {
              console.log("페이지 이동");
              goNext();
            } else if (message?.resetFromArr) {
              setFromArr([]);
            } else if (message?.keepPlay) {
              console.log("로직 생성 할지도?");
            }
             }}
          injectedJavascript={`
let nowIndex = 0;

const handlePageMove = async (cfisRange) => {
  const currentLoc = await rendition.currentLocation();
  const currentLocEnd = currentLoc.end.cfi;
  const vallnum = rendition.epubcfi.compare(cfisRange, currentLocEnd);
  if (vallnum > -1) {
    window.ReactNativeWebView.postMessage(JSON.stringify({ gonextpage: 1 }));
  } else {
    window.ReactNativeWebView.postMessage(
      JSON.stringify({ msg: "vallnum is -1" })
    );
  }
};

const getFormArr = async () => {
  window.ReactNativeWebView.postMessage(
    JSON.stringify({ msgg: "getFormArr 시작" })
  );
  const currentLoc = await rendition.currentLocation();
  const formArr = [];
  const contentt = rendition.getContents();
  const contents = contentt[0];
  const currentView = rendition.manager.current();
  const currentSection = currentView.section;
  const paragraphs = contents.document.querySelectorAll("p");

  for (const element of paragraphs) {
    const sentences = element.textContent.match(/[^.!?]+[.!?]+|[^.!?]+$/g);
    for (const sentenceRan of sentences) {
      const sentence = sentenceRan.trim();
      const range = document.createRange();
      const startOffset = element.textContent.indexOf(sentence);
      const endOffset = startOffset + sentence.length;

      try {
        range.setStart(element.firstChild, startOffset);
        range.setEnd(element.firstChild, endOffset);
      } catch (error) {
        continue;
      }

      const cfisRange = currentSection.cfiFromRange(range);
      const tempObj = { sentence, cfisRange };
      formArr.push(tempObj);
    }
  }
  window.ReactNativeWebView.postMessage(JSON.stringify({ formArr }));
};

rendition.on("relocated", (location) => {
  window.ReactNativeWebView.postMessage(JSON.stringify({ msgg: "리로케이트" }));
  if (location.start.index !== nowIndex) {
    nowIndex = location.start.index;
    window.ReactNativeWebView.postMessage(JSON.stringify({ resetFromArr: "0" }));
    getFormArr();
  }
  window.ReactNativeWebView.postMessage(JSON.stringify({ stt: location?.start, endd: location?.end }));
  window.ReactNativeWebView.postMessage(JSON.stringify({ nowIndex }));
});
        `}
        />
  </TouchableOpacity>
  {/* 네비게이션 바 */}
  <Animated.View style={[styles.footer, animatedStyleFoot, isTTSMode && { height: height * 0.25, paddingTop: 0 }]}>
    {
    isTTSMode
    ? <TouchableOpacity style={styles.saveNote} onPress={handleReadNoteSave}><Text style={styles.saveNoteText}>읽고 있는 문장 저장</Text></TouchableOpacity>
    : null
    }
    <View style={styles.progressview}>
      <View>
      <Text>{(progress*100).toString().slice(0, 4)}%</Text>
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
            <TouchableOpacity onPress={handleTTSPlay}>
              {
                isTTSPlaying
                ? <Image source={pausebuttonicon} style={styles.footericon} />
                : <Image source={playbuttonicon} style={styles.footericon} />
              }
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {}}>
              <Image source={prevbuttonicon} style={[styles.footericon, {transform: [{scaleX: -1}]}]} />
            </TouchableOpacity>
            <TouchableOpacity onPress={toggleTTSSetting}>
              <Image source={settingicon} style={styles.footericon} />
            </TouchableOpacity>
          </>
        )
        : (
          <>
            <TouchableOpacity onPress={() => goNext()}>
              <Image source={indexmenuicon} style={styles.footericon} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setIsTTSMode(true)}>
              <Image source={headphoneicon} style={styles.footericon} />
            </TouchableOpacity>
            <TouchableOpacity onPress={toggleBookNote}>
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
    paddingHorizontal: width * 0.08,
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
  },
  saveNote: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#3943B7',
    width: '100%',
    height: height * 0.05,
  },
  saveNoteText: {
    fontSize: width * 0.04,
    color: 'white',
    fontWeight: 'bold',
  },
});

export default EBookViewerPage;