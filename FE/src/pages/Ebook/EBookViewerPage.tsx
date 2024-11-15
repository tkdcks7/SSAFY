// src/pages/Ebook/EBookViewerPage.tsx
import React, {useState, useEffect, useCallback, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Dimensions,
  Button,
} from 'react-native';
import {RouteProp, useNavigation} from '@react-navigation/native';
import {RootStackParamList} from '../../navigation/AppNavigator';
import {LibraryStackParamList} from '../../navigation/LibraryNavigator';
import {StackNavigationProp} from '@react-navigation/stack';
import {
  Reader,
  useReader,
  Location,
  Annotation,
  AnnotationType,
  Themes,
} from '@epubjs-react-native/core';
import {useFileSystem} from '@epubjs-react-native/file-system';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import {
  getReadNote,
  createReadNote,
  deleteNote,
  ICreateNote,
  INoteList,
  IReadNote,
} from '../../services/ViewerPage/readNotes';
import useSettingStore, {fontSizeTable} from '../../store/settingStore';
import leftarrowicon from '../../assets/icons/leftarrow.png';
import searchicon from '../../assets/icons/search.png';
import ProgressBar from '../../components/viewer/ProgressBar';
import EbookSearch from '../../components/viewer/EbookSearch';
import Tts from 'react-native-tts';
import RNFS from 'react-native-fs';
import {compareCFIStrings} from '../../utils/cfiManager';

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
type EBookViewerPageNavigateProp = StackNavigationProp<
  RootStackParamList,
  'EBookViewer'
>;

type Props = {
  route: EBookViewerPageRouteProp;
  navigation: EBookViewerPageNavigateProp;
};

type FormContent = {
  sentence: string;
  cfisRange: string;
};

const {width, height} = Dimensions.get('window');

// src에 Ebook의 주소를 넣어줘야하는데, local 파일의 경우 따로 로직 처리를 해서 주소를 넣어줘야함.
const EBookViewerPage: React.FC<Props> = ({route, navigation}) => {
  const {bookId} = route.params;
  const [progress, setProgress] = useState<number>(0);
  const [isTTSMode, setIsTTSMode] = useState<boolean>(false);
  const [isTTSPlaying, setIsTTSPlaying] = useState<boolean | null>(null);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [formArr, setFormArr] = useState<FormContent[]>([]);
  const [ttsIdx, setttsIdx] = useState<number>(0);
  const [initialCfi, setInitialCfi] = useState<string | undefined>(undefined);
  const [readNoteArr, setReadNoteArr] = useState<IReadNote[]>([]);
  const [title, setTitle] = useState<string>('');
  const [bookSrc, setBookSrc] = useState<string>('');
  const [isCustomBook, setIsCustomBook] = useState<boolean>(false);
  // 검색어 관리
  const [searchInput, setSearchInput] = useState('');
  const [currentCfis, setCurrentCfis] = useState<string>();

  const formArrRef = useRef<FormContent[]>(formArr);
  const ttsIdxRef = useRef<number>(ttsIdx);
  const isTTSPlayingRef = useRef(isTTSPlaying);

  const {fontSizeSetting, isDarkMode, ttsSpeedSetting} = useSettingStore();

  const {
    changeTheme,
    getCurrentLocation,
    changeFontSize,
    goToLocation,
    clearSearchResults,
    addAnnotation,
    injectJavascript,
    goNext,
  } = useReader();

  useEffect(() => {
    const getBookInfo = async () => {
      try {
        const dbPath = `${RNFS.DocumentDirectoryPath}/library.json`;
        const dbExists = await RNFS.exists(dbPath);
        let library = [];
        if (dbExists) {
          const currentData = await RNFS.readFile(dbPath, 'utf8');
          library = JSON.parse(currentData);
        }
        // 중복 확인 및 추가
        const bookData = library.find((book: any) => {
          return book.bookId === bookId;
        });
        if (bookData && bookData.filePath) {
          // setIsCustomBook(true);
          setBookSrc(bookData.filePath);
          setTitle(bookData.title);
          if (bookData.currentCfi) {
            setInitialCfi(bookData.currentCfi);
          }
        } else {
          throw new Error('Failed to read book metadata:');
        }
      } catch (error) {
        console.error('Failed to read book metadata:', error);
      }
    };
    getBookInfo();
    getReadNote(bookId).then(readNotes => {
      if (readNotes === undefined) {
        console.log('readNote 없음');
      } else {
        setReadNoteArr(readNotes);
      }
    });
  }, []);

  // 화면 크기를 상태로 관리
  const [screenDimensions, setScreenDimensions] = useState(
    Dimensions.get('window'),
  );
  // 화면 크기 업데이트 함수
  const updateDimensions = () => {
    setScreenDimensions(Dimensions.get('window'));
  };
  // 화면 회전 이벤트 리스너 추가
  useEffect(() => {
    const subscription = Dimensions.addEventListener(
      'change',
      updateDimensions,
    );
    // 처음 웹뷰 실행시 검색 결과 초기화
    clearSearchResults();
    return () => subscription.remove(); // 컴포넌트 언마운트 시 리스너 제거
  }, []);
  const animHeight = screenDimensions.height * 0.2;

  // 테스트용 epub 주소
  const saaa = `https://s3.ap-northeast-2.amazonaws.com/audisay/epub/published/valentin-hauy.epub?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20241112T070838Z&X-Amz-SignedHeaders=host&X-Amz-Expires=300&X-Amz-Credential=AKIA2YICALD7MZ3XV3TG%2F20241112%2Fap-northeast-2%2Fs3%2Faws4_request&X-Amz-Signature=6ec25ef2ea6ee821ad5b2007b86b1f9dae20975660c16328bab5063762a42864`;

  // 애니메이션 설정
  // 네비게이션 바의 Y 위치를 조절하는 애니메이션 값
  const translateYNav = useSharedValue(-animHeight); // 초기에는 화면 밖에 위치
  const translateYFoot = useSharedValue(animHeight);
  const indexSidebarX = useSharedValue(-width);
  const bookNoteSideBarX = useSharedValue(width);
  const settingSideBarX = useSharedValue(width);
  const settingTTSSideBarX = useSharedValue(width);

  // 나중에 한국어 모드 할거면 모드를 한국어로 변경
  Tts.setDefaultLanguage('en-US');
  // Tts.setDefaultLanguage('ko-KR');

  // 네비게이션 바의 표시 여부 상태
  const isVisible = useSharedValue(false);
  // Nav 애니메이션 스타일
  const animatedStyleNav = useAnimatedStyle(() => {
    return {transform: [{translateY: translateYNav.value}]};
  });
  // footer 토글 애니메이션 스타일
  const animatedStyleFoot = useAnimatedStyle(() => {
    return {transform: [{translateY: translateYFoot.value}]};
  });

  // 검색창에서 결과 선택
  const handleLocationSelect = cfi => {
    goToLocation(cfi); // 선택된 위치로 이동
    setIsSearching(false); // EbookSearch 닫기
  };

  // 네비게이션 바 표시/숨기기 핸들러
  const toggleNav = useCallback(() => {
    isVisible.value = !isVisible.value;
    // 네비게이션 바 위치 조절
    translateYNav.value = withTiming(isVisible.value ? 0 : -animHeight, {
      duration: 200,
    });
    translateYFoot.value = withTiming(isVisible.value ? 0 : animHeight, {
      duration: 200,
    });
  }, []);
  // useCallback을 이용하여 Index 토글하는 함수 메모이제이션
  const toggleIndex = useCallback(() => {
    indexSidebarX.value =
      indexSidebarX.value === 0
        ? withTiming(-width, {duration: 200})
        : withTiming(0, {duration: 200});
  }, []);
  // useCallback을 이용하여 설정창을 토글하는 함수 메모이제이션
  const toggleBookNote = useCallback(() => {
    bookNoteSideBarX.value =
      bookNoteSideBarX.value === 0
        ? withTiming(width, {duration: 200})
        : withTiming(0, {duration: 200});
  }, []);
  // useCallback을 이용하여 설정창을 토글하는 함수 메모이제이션
  const toggleSetting = useCallback(() => {
    settingSideBarX.value =
      settingSideBarX.value === 0
        ? withTiming(width, {duration: 200})
        : withTiming(0, {duration: 200});
  }, []);
  // useCallback을 이용하여 TTS설정창을 토글하는 함수 메모이제이션
  const toggleTTSSetting = useCallback(() => {
    settingTTSSideBarX.value =
      settingTTSSideBarX.value === 0
        ? withTiming(width, {duration: 200})
        : withTiming(0, {duration: 200});
  }, []);

  // 현재 Section의 데이터를 긁어 formArr에 주입하는 로직을 Javascript inject
  const getFormArr = () => {
    injectJavascript(`getFormArr();`);
  };
  const getFormArrForCustomBook = () => {
    injectJavascript(`getFormArrForCustomBook();`);
  };
  const switchCustomBookMode = () => {
    injectJavascript(`isCustomBook = true; getFormArrForCustomBook(); `);
  };
  const currentPageFirstIndex = () => {
    const startCfi: string | undefined = getCurrentLocation()?.start.cfi;
    if (startCfi) {
      const arrString: string = JSON.stringify(formArrRef.current);
      const functionString: string =
        'currentPageFirstIndex(' +
        "'" +
        startCfi +
        "'" +
        ',' +
        arrString +
        ');';
      injectJavascript(functionString);
    } else {
      console.log('startCfi가 없습니다.');
    }
  };

  const trackCurrentTtsIdx = (): void => {
    const startCfi: string | undefined = getCurrentLocation()?.start.cfi;
    if (!startCfi) {
      console.log('현재 위치의 cfi가 존재하지 않습니다.');
      return;
    }
    const idx: number = formArr.findIndex(formItem => {
      const vall: number = compareCFIStrings(formItem.cfisRange, startCfi);
      return vall > -1;
    });
    if (idx !== -1) {
      setttsIdx(idx);
    }
    return;
  };

  // annotation 제거를 Javascript를 주입하여 해결
  const handleRemoveAnnotation = (cfiRangeOfAnnotation: string) => {
    const functionString: string =
      'rendition.annotations.remove(' +
      "'" +
      cfiRangeOfAnnotation +
      "'" +
      ", 'highlight');";
    injectJavascript(functionString);
  };

  // inject된 script에서 정의된 handlePageMove(cfisRange)를 주입
  // cfisRange에 해당하는 문자열이 현재 페이지에 있는지 판별 후 페이지 이동
  const handlePageMoving = (cfisRange: string): void => {
    const allString: string = 'handlePageMove(' + "'" + cfisRange + "'" + ')';
    injectJavascript(allString);
  };

  const setTtsReset = () => {
    setttsIdx(() => {
      return 0;
    });
    playTextSequentially();
  };

  // TTS가 완료되면(tttsIdx === formArr.length일 때) 호출
  const playTextSequentially = async () => {
    if (ttsIdxRef.current >= formArrRef?.current.length) {
      handleRemoveAnnotation(
        formArrRef.current[ttsIdxRef.current - 1].cfisRange,
      );
      setFormArr(() => {
        return [];
      }); // formArr 초기화
      goNext(); // 페이지 이동
      return await setTimeout(() => {
        setTtsReset();
      }, 6000);
    }
    setttsIdx(prevIdx => {
      if (!isTTSPlayingRef.current) {
        return prevIdx;
      }
      const item = formArrRef.current[prevIdx];
      Tts.speak(item.sentence); // tts 재생
      addAnnotation('highlight', item.cfisRange); // 문장 하이라이트
      if (prevIdx > 0)
        handleRemoveAnnotation(formArrRef.current[prevIdx - 1].cfisRange); // 이전 하이라이트 제거
      handlePageMoving(item.cfisRange); // 페이지 이동 판단

      return prevIdx + 1; // 다음 ttsIdx로 이동
    });
  };

  // formArr이 업데이트될 때마다 formArrRef에도 최신 값을 설정
  useEffect(() => {
    formArrRef.current = formArr;
  }, [formArr]);

  // ttsIdxRef 갱신 및 TTS 종료 시 playTextSequentially 호출
  useEffect(() => {
    ttsIdxRef.current = ttsIdx;
    const onTtsFinish = () => playTextSequentially();
    Tts.addEventListener('tts-finish', onTtsFinish);
    return () => Tts.removeAllListeners('tts-finish');
  }, [ttsIdx]);

  useEffect(() => {
    isTTSPlayingRef.current = isTTSPlaying;
    if (isTTSPlaying && formArr.length > 0) {
      playTextSequentially();
    }
  }, [isTTSPlaying]);

  // TTS 재생 및 일시 정지 관리
  const handleTTSPlay = (): void => {
    if (isTTSPlaying === null && initialCfi) {
      setttsIdx(() => indexOfCfis(initialCfi));
    }
    trackCurrentTtsIdx();
    setIsTTSPlaying(prev => !prev);
  };

  //
  const indexOfCfis = (cfiRange: string): number => {
    const idx: number = formArr.findIndex(formItem => {
      return formItem.cfisRange === cfiRange;
    });
    if (idx !== -1) {
      return idx;
    }
    return 0;
  };

  // 문장 저장
  const handleReadNoteSave = (): void => {
    const currentidx = ttsIdx - 1 ? ttsIdx - 1 : 0;
    // console.log(`index = ${currentidx}`);
    // console.log(`저장된 문장=${formArr[currentidx].sentence}`);
    // console.log(`저장된 cfi=${formArr[currentidx].cfisRange}`);

    const data: ICreateNote = {
      bookId: bookId,
      progressRate: progress * 100,
      sentence: formArr[currentidx].sentence,
      sentenceId: formArr[currentidx].cfisRange,
    };
    createReadNote(data).then(stat => {
      addAnnotation('underline', formArr[currentidx].cfisRange, undefined, {
        color: '#f6f8ff',
      });
    });
  };

  // 책 진행률 변경 핸들러
  const handleProgressGage = (): void => {
    const gage: number | undefined = getCurrentLocation()?.end.percentage;
    if (gage) {
      setProgress(gage);
    }
  };

  const handleOnReady = (): void => {
    // console.log(`isCustomBook=${isCustomBook}`);
    isCustomBook ? switchCustomBookMode() : getFormArr();
    changeFontSize(fontSizeTable[fontSizeSetting]);
    console.log(`ttsSpeedSetting = ${ttsSpeedSetting}`);
    Tts.setDefaultRate(ttsSpeedSetting / 2);
    if (initialCfi) {
      goToLocation(initialCfi);
    }
  };

  // 특정 bookId를 가진 책의 currentCfi를 수정하는 함수
  const updateLibraryInfoOfBook = async (newCfi: string) => {
    try {
      // JSON 파일 읽기
      const dbPath = `${RNFS.DocumentDirectoryPath}/library.json`;
      const fileData = await RNFS.readFile(dbPath, 'utf8');
      const library: any[] = JSON.parse(fileData);

      // bookId를 기준으로 해당 책 찾기
      const bookIndex = library.findIndex(book => book.bookId === bookId);
      if (bookIndex === -1) {
        console.log(`Book with ID ${bookId} not found`);
        return;
      }
      // currentCfi 값 수정
      library[bookIndex].currentCfi = newCfi;
      library[bookIndex].progressRate = Number((progress * 100).toFixed(2));

      // 수정된 데이터를 JSON 파일에 다시 저장
      await RNFS.writeFile(dbPath, JSON.stringify(library), 'utf8');
    } catch (error) {
      console.error('Error updating currentCfi:', error);
    }
  };

  const handlegoBack = () => {
    if (formArr.length > ttsIdx) {
      const currentCfi: string = formArr[ttsIdx - 1].cfisRange;
      updateLibraryInfoOfBook(currentCfi);
      console.log(
        `currentCfi를 ${ttsIdx - 1} 번 인덱스의 값인 ${currentCfi}로 갱신!`,
      );
    } else {
      console.log(
        `currentCfi 갱신 못함. 인덱스 = ${ttsIdx - 1}, cfirange = ${
          formArr[ttsIdx - 1].cfisRange
        }`,
      );
    }
    navigation.goBack();
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      {/* 네비게이션 바 */}
      <Animated.View style={[styles.navBar, animatedStyleNav]}>
        {isTTSMode ? (
          <TouchableOpacity
            onPress={() => setIsTTSMode(false)}
            style={styles.ttsEndBox}>
            <Text style={[styles.navBarText, {color: 'black'}]}>
              TTS 모드 종료
            </Text>
          </TouchableOpacity>
        ) : (
          <>
            <TouchableOpacity onPress={() => {}}>
              <Image source={leftarrowicon} style={styles.icon} />
            </TouchableOpacity>
            <Text style={styles.navBarText}>{title ? title : '책 타이틀'}</Text>
            {/* 검색 및 검색 결과 */}
            <TouchableOpacity onPress={() => setIsSearching(true)}>
              <Image source={searchicon} style={styles.icon} />
            </TouchableOpacity>
          </>
        )}
      </Animated.View>
      {/*{ isSearching ? <EbookSearch /> : null}*/}
      {isSearching ? (
        <EbookSearch
          onClose={() => setIsSearching(false)}
          onLocationSelect={handleLocationSelect} // 위치 선택 핸들러 전달
          searchInput={searchInput}
          setSearchInput={setSearchInput}
        />
      ) : null}
      {/* 사이드바 */}
      <EbookIndex indexSidebarX={indexSidebarX} toggleIndex={toggleIndex} />
      {/* 독서노트 */}
      <EbookBookNote
        bookNoteSideBarX={bookNoteSideBarX}
        toggleBookNote={toggleBookNote}
        readNoteArr={readNoteArr}
      />
      {/* 설정창 */}
      <EbookSetting
        settingSideBarX={settingSideBarX}
        toggleSetting={toggleSetting}
        changeTheme={changeTheme}
        changeFontSize={changeFontSize}
      />
      {/* TTS 설정창 */}
      <EbookTTSSetting
        settingTTSSideBarX={settingTTSSideBarX}
        toggleTTSSetting={toggleTTSSetting}
      />
      <TouchableOpacity style={{flex: 1}} onPress={toggleNav}>
        <Reader
          src={bookSrc}
          fileSystem={useFileSystem}
          flow="paginated"
          onLocationChange={() => {
            handleProgressGage();
          }}
          onReady={handleOnReady} // 처음 책이 준비가 됐을 시 작동해서 formArr(아마도 cover img)를 받아옴
          initialLocation={initialCfi ? initialCfi : undefined}
          defaultTheme={isDarkMode ? Themes.DARK : Themes.LIGHT}
          onWebViewMessage={message => {
            console.log(message);
            if (message?.formArr) {
              if (formArr) {
                setFormArr([...message.formArr]);
                console.log('formArr 저장됨');
              }
            } else if (message?.gonextpage) {
              console.log('페이지 이동');
              goNext();
            } else if (message?.updateIdx) {
              setttsIdx(message.updateIdx);
            }
          }}
          injectedJavascript={`
let nowIndex = 0;
let isCustomBook = false;

const handlePageMove = async (cfisRange) => {
  const currentLoc = await rendition.currentLocation();
  const currentLocEnd = currentLoc.end.cfi;
  const vallnum = rendition.epubcfi.compare(cfisRange, currentLocEnd);
  if (vallnum > -1) {
    window.ReactNativeWebView.postMessage(JSON.stringify({ gonextpage: 1 }));
  }
};

const currentPageFirstIndex = async (startCfi, arr) => {
  const arrParse = JSON.parse(arr);
  rendition.epubcfi.compare(startCfi, formItem.cfisRange);
  const updateIdx = arrParse.findIndex((formItem) => {
    const vall = rendition.epubcfi.compare(startCfi, formItem.cfisRange);
    return vall < 1
  });
  window.ReactNativeWebView.postMessage(JSON.stringify({ updateIdx }));
}

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
  window.ReactNativeWebView.postMessage(JSON.stringify({ msgg: "리로케이트", pvi: nowIndex, ci: location.start.index }));
  if (location.start.index !== nowIndex) {
    nowIndex = location.start.index;
    if (isCustomBook) { getFormArrForCustomBook(); }
    else { getFormArr(); }
  }
});


// getFormArrForCustomBook에서 Range를 생성하고 cfisRange를 계산하는 함수
const createCfiObject = (sentence, element, isNode) => {
  const range = document.createRange();
  try {
    isNode ? range.selectNode(element) : range.setStart(element.firstChild, 0);
    isNode || range.setEnd(element.firstChild, sentence.length);
    const cfisRange = currentSection.cfiFromRange(range);
    return { sentence, cfisRange };
  } catch (error) {
    return null;
  }
};


// 커스텀북의 태그별로 처리하여 formArr 생성해 전송하는 함수
const getFormArrForCustomBook = () => {
  window.ReactNativeWebView.postMessage(
    JSON.stringify({ msgg: "CustomBook 로직 시작" })
  );

  const formArr = [];
  const contentt = rendition.getContents();
  const contents = contentt[0];
  const currentView = rendition.manager.current();
  const currentSection = currentView.section;
  const elements = contents.document.querySelectorAll(
    "img, p, h1, h2, h3, title"
  );

  // 요소별 로직 처리
  for (const element of elements) {
    const tagName = element.tagName.toLowerCase();

    if (tagName === "p") {
      const spanTags = element.querySelectorAll("span");
      for (const line of spanTags) {
        const sentence = line.textContent;
        const tempObj = createCfiObject(sentence, line, false);
        if (tempObj) formArr.push(tempObj);
      }
    } else if (tagName === "img") {
      const sentence = element.alt;
      const tempObj = createCfiObject(sentence, element, true);
      if (tempObj) formArr.push(tempObj);
    } else if (["title", "h1", "h2", "h3"].includes(tagName)) {
      const sentence = element.textContent;
      const tempObj = createCfiObject(sentence, element, false);
      if (tempObj) formArr.push(tempObj);
    }
  }
  window.ReactNativeWebView.postMessage(JSON.stringify({ formArr }));
};
        `}
        />
      </TouchableOpacity>
      {/* 네비게이션 바 */}
      <Animated.View
        style={[
          styles.footer,
          animatedStyleFoot,
          isTTSMode && {height: height * 0.25, paddingTop: 0},
        ]}>
        {isTTSMode ? (
          <TouchableOpacity
            style={styles.saveNote}
            onPress={handleReadNoteSave}>
            <Text style={styles.saveNoteText}>읽고 있는 문장 저장</Text>
          </TouchableOpacity>
        ) : null}
        <View style={styles.progressview}>
          <View>
            <Text>{(progress * 100).toString().slice(0, 4)}%</Text>
          </View>
          <ProgressBar progress={progress} />
        </View>
        <View
          style={[styles.progressview, {borderTopWidth: 2, paddingTop: 20}]}>
          {isTTSMode ? (
            <>
              <TouchableOpacity onPress={() => {}}>
                <Image source={prevbuttonicon} style={styles.footericon} />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleTTSPlay}>
                {isTTSPlaying ? (
                  <Image source={pausebuttonicon} style={styles.footericon} />
                ) : (
                  <Image source={playbuttonicon} style={styles.footericon} />
                )}
              </TouchableOpacity>
              <TouchableOpacity onPress={() => {}}>
                <Image
                  source={prevbuttonicon}
                  style={[styles.footericon, {transform: [{scaleX: -1}]}]}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={toggleTTSSetting}>
                <Image source={settingicon} style={styles.footericon} />
              </TouchableOpacity>
            </>
          ) : (
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
          )}
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
    fontSize: width * 0.04, // 상대적인 글꼴 크기 0.1 > 0.04로 수정
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
    tintColor: 'black',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: height * 0.2,
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
    zIndex: 11,
  },
  sidebarText: {
    color: '#FFFFFF',
    fontSize: width * 0.1,
  },
  ttsEndBox: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '80%',
    backgroundColor: 'white',
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
