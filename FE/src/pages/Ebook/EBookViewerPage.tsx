// src/pages/Ebook/EBookViewerPage.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Image, Dimensions, Button } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { LibraryStackParamList } from '../../navigation/LibraryNavigator';
import { StackNavigationProp } from '@react-navigation/stack';
import { Reader, useReader, Location } from '@epubjs-react-native/core';
import { useFileSystem } from '@epubjs-react-native/file-system';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import leftarrowicon from '../../assets/icons/leftarrow.png';
import searchicon from '../../assets/icons/search.png';
import ProgressBar from '../../components/viewer/ProgressBar';
import EbookSearch from '../../components/viewer/EbookSearch';

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

const { width, height } = Dimensions.get('window');


// src에 Ebook의 주소를 넣어줘야하는데, local 파일의 경우 따로 로직 처리를 해서 주소를 넣어줘야함.
const EBookViewerPage: React.FC<Props> = ({ route, navigation }) => {
  const { bookId } = route.params;
  const [progress, setProgress] = useState<number>(0);
  const [ isTTSMode, setIsTTSMode ] = useState<boolean>(false);
  const [ isTTSPlaying, setIsTTSPlaying ] = useState<boolean>(false);
  const [ isSearching, setIsSearching ] = useState<boolean>(false);
  const [ aval, setAval ] = useState<string>('');

  
  const { getCurrentLocation, changeFontSize, getLocations, goToLocation, section, addAnnotation, injectJavascript,  } = useReader();


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
    const settingTTSSideBarX = useSharedValue(width);

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


  const cfiToExtract = "epubcfi(/6/8!/4/2,/2/2/1:0,/8[n1]/2/1:48)";

  const iscript = () => {
    injectJavascript(`
            rendition.display("epubcfi(/6/94!/4/2/22/1:36)")
            const k = pageFromCfi("epubcfi(/6/94!/4/2/22/1:36)")
            window.ReactNativeWebView.postMessage(JSON.stringify({ pg: k }));
      `);
  };


  const rangeSelectScript = () => {
    injectJavascript(`
        document.addEventListener('selectionchange', () => {
        const selectedText = window.getSelection().toString();
        if (selectedText) {
          window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'textSelected', text: selectedText }));
        }
      });
  `)
  }


  const bscript= () => {
    injectJavascript(`
      rendition.on("relocated", (location) => {
  const currentCFI = location.start.cfi;
  window.ReactNativeWebView.postMessage(JSON.stringify({ curCfi: currentCFI }));
});

      `);
  }

  const afunc = () => {
    const aaa: Location | null = getCurrentLocation();
    if (aaa !== null) {console.log(`
      start: ${aaa.start.cfi}, 
      end: ${aaa.end.cfi}, 
      pr = ${aaa.end.percentage*100}%, 
      pg: ${aaa.start.displayed.page}, 
      epg: ${aaa.end.displayed.page}`);
      setProgress(aaa.end.percentage)
    }
  };

  const scrrr = `

            rendition.on("relocated", () => {
              rendition.getContents().forEach((content) => {
                const paragraphs = content.document.querySelectorAll("p");
                paragraphs.forEach((paragraph, index) => {
                window.ReactNativeWebView.postMessage(JSON.stringify({ idx: index, line: paragraph.innerText }));
                // window.ReactNativeWebView.postMessage(JSON.stringify({ msg: "페이지이동" }));
                });
              });
            });
        `

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
          <TouchableOpacity onPress={() => console.log(getLocations())}>
            <Image source={leftarrowicon} style={styles.icon} />
          </TouchableOpacity>
            <Text style={styles.navBarText}>책 타이틀</Text>
          <TouchableOpacity onPress={() => setIsSearching(true)}>
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
      {/* <TouchableOpacity onPress={() => {console.log(getCurrentLocation()); }}><Text>aaa</Text></TouchableOpacity> */}
      <TouchableOpacity style={{ flex: 1 }} onPress={toggleNav}>
        <Reader
          src="https://s3.amazonaws.com/moby-dick/OPS/package.opf"
          fileSystem={useFileSystem}
          enableSelection={true}
          onSelected={(selectedText: string, cfiRange: string) => {}}
          flow='paginated'
          onLocationChange={afunc}
          width={"100%"}
          height={"100%"}
          onReady={(totalLocations, currentLocation, progress) => console.log(`ready: ${currentLocation.end.cfi}`)}
          getInjectionJavascriptFn={iscript}
          injectedJavascript={`
            // epubcfi 두 개를 받아서 하나의 범위 epubcfi로 변환하는 함수
function combineCFI(startCFI, endCFI) {
  if (!startCFI.startsWith("epubcfi(") || !endCFI.startsWith("epubcfi(")) {
    throw new Error("Invalid CFI format");
  }
  let startPath = startCFI.slice(9, -1);
  let endPath = endCFI.slice(9, -1);
  let startParts = startPath.split("/");
  let endParts = endPath.split("/");
  let commonPathLength = 0;
  while (
    commonPathLength < startParts.length &&
    commonPathLength < endParts.length &&
    startParts[commonPathLength] === endParts[commonPathLength]
  ) {
    commonPathLength++;
  }
  let commonPath = startParts.slice(0, commonPathLength).join("/");
  let startRemainder = startParts.slice(commonPathLength).join("/");
  let endRemainder = endParts.slice(commonPathLength).join("/");
  return (
    "epubcfi(" + commonPath + "," + startRemainder + "," + endRemainder + ")"
  );
}

// 노드 탐색
function traverseChildrenIncludingText(element, cfiBase) {
  window.ReactNativeWebView.postMessage(JSON.stringify({ cfiBase }));
  Array.from(element.childNodes).forEach(child => {
    if (child.nodeType === 1) {
      window.ReactNativeWebView.postMessage(JSON.stringify({ elementTag: child.tagName }));
      if (child.tagName === 'P') {
            window.ReactNativeWebView.postMessage(JSON.stringify({ ndd: child.textContent.trim() }));
            window.ReactNativeWebView.postMessage(JSON.stringify({ ndd: typeof child }));
            // const scfi = rendition.cfiFromElement(child);
            // if (scfi) {
            // window.ReactNativeWebView.postMessage(JSON.stringify({ mmsg: "nddd 존재" }));
            // rendition.annotations.add("highlight", nddd);
            // } else {
            //     window.ReactNativeWebView.postMessage(JSON.stringify({ mmsg: "faillll" }));
            // }
      }
      traverseChildrenIncludingText(child);
    }
    // else if (child.nodeType === 3) {
    //  if (child.textContent.trim() !== '') {
    //   window.ReactNativeWebView.postMessage(JSON.stringify({ elementtext: child.textContent.trim() }));
    //   }
    // }
  });
}
  
rendition.on("relocated", () => {
  if (rendition.location) {
      if (book.pageList) { window.ReactNativeWebView.postMessage(JSON.stringify({ aade: book.totalPages })); }
      // book.spine.spineItems.forEach((item) => { window.ReactNativeWebView.postMessage(JSON.stringify({ [item.index]: item.cfiBase })); })
    const domm = rendition.getContents()[0];
    traverseChildrenIncludingText(domm.content, domm.cfiBase);
    const currentPage = rendition.location.start.cfi;
    const currentPageE = rendition.location.end.cfi;
    const currentCFI = rendition.location.start.cfi;
    const endCFI = rendition.location.end.cfi;
    const totalPage = rendition.location.start.displayed.total;
    // const rrr = book.getRange("epubcfi(/6/6!/4/2,/2/2/1:0,/4[q1]/2/14/2/1:14)")
    // .then((rnm) => {window.ReactNativeWebView.postMessage(JSON.stringify({ rnm: rnm.innerText }));})
    // .catch(() => {window.ReactNativeWebView.postMessage(JSON.stringify({ rnm: "failli" }));})
    window.ReactNativeWebView.postMessage(
      JSON.stringify({ cpf: currentPage, epf: currentPageE, tp: totalPage })
    );
    const ran = combineCFI(currentCFI, endCFI);
    if (ran) {
      window.ReactNativeWebView.postMessage(JSON.stringify({ ran }));
      // rendition.annotations.add("highlight", ran);
      book
        .getRange(ran)
        .then((ranl) => {
          if (ranl) {
            const selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(ranl);
          } else {
            window.ReactNativeWebView.postMessage(
              JSON.stringify({ msggg: "ranl 추출 실패" })
            );
          }
        })
        .catch((err) => {
          window.ReactNativeWebView.postMessage(
            JSON.stringify({ msgggg: "err로빠짐" })
          );
        });
    } else {
      window.ReactNativeWebView.postMessage(
        JSON.stringify({
          msgggggg: "텍스트 추출 실패",
          error: "범위 내 텍스트 없음",
        })
      );
    }
  }
});

        `}
          onWebViewMessage={(message) => console.log(message)}
        />
  </TouchableOpacity>
  {/* 네비게이션 바 */}
  <Animated.View style={[styles.footer, animatedStyleFoot, isTTSMode && { height: height * 0.25, paddingTop: 0 }]}>
    {
    isTTSMode
    ? <TouchableOpacity style={styles.saveNote}><Text style={styles.saveNoteText}>읽고 있는 문장 저장</Text></TouchableOpacity>
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
            <TouchableOpacity onPress={toggleTTSSetting}>
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