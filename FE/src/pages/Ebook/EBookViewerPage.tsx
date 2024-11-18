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
  BackHandler,
} from 'react-native';
import {RouteProp, useNavigation} from '@react-navigation/native';
import {RootStackParamList} from '../../navigation/AppNavigator';
import {StackNavigationProp} from '@react-navigation/stack';
import {
  Reader,
  useReader,
  Themes,
  Annotation,
  Location,
  ReaderProps,
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
  ICreateNote,
  IReadNote,
} from '../../services/ViewerPage/readNotes';
import useSettingStore, {fontSizeTable} from '../../store/settingStore';
import leftarrowicon from '../../assets/icons/leftarrow.png';
import searchicon from '../../assets/icons/search.png';
import ProgressBar from '../../components/viewer/ProgressBar';
import EbookSearch from '../../components/viewer/EbookSearch';
import Tts from 'react-native-tts';
import RNFS from 'react-native-fs';
import {
  compareCFIStrings,
  getCurrentDate,
  timeParser,
} from '../../utils/cfiManager';
import useEpubStore from '../../store/epubStore';
import {ReaderProvider} from '@epubjs-react-native/core';

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

type EBookViewerPageRouteProp = RouteProp<RootStackParamList, 'EBookViewer'>;
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

// 목차 타입
type TocContent = {
  id: string;
  label: string;
  href: string;
  subitems?: any;
};

const voiceMagicTable: any = {
  여성1: 'ko-kr-x-ism-local',
  여성2: 'ko-kr-x-kob-local',
  남성1: 'ko-kr-x-kod-local',
  남성2: 'ko-kr-x-koc-local',
};

const {width, height} = Dimensions.get('window');

// ReaderProvider로 감싸기 위해 자식에서 실질적인 로직 처리
const Component: React.FC<Props> = ({route}) => {
  const {bookId} = route.params;
  const [progress, setProgress] = useState<number>(0);
  const [isTTSMode, setIsTTSMode] = useState<boolean>(false);
  const [isTTSPlaying, setIsTTSPlaying] = useState<boolean>(false);
  const [isSearchingOn, setIsSearchingOn] = useState<boolean>(false);
  const [formArr, setFormArr] = useState<FormContent[]>([]);
  const [ttsIdx, setttsIdx] = useState<number>(-1);
  const [initialCfi, setInitialCfi] = useState<string | undefined>(undefined);
  const [readNoteArr, setReadNoteArr] = useState<IReadNote[]>([]);
  const [title, setTitle] = useState<string>('');
  const [bookSrc, setBookSrc] = useState<string>('');
  const [isCustomBook, setIsCustomBook] = useState<boolean>(false);
  const [hasUsedInitialCfi, setHasUsedInitialCfi] = useState(false);
  const [isSwipable, setIsSwipable] = useState<boolean>(true);

  // 검색어 관리
  const [searchInput, setSearchInput] = useState('');
  const [tocArr, setTocArr] = useState<TocContent[]>([]);

  // 타이머 설정
  const [timeLeft, setTimeLeft] = useState<number>(0); // 타이머 시간 상태
  const [isTimerOn, setIsTimerOn] = useState<boolean>(false); // 타이머 여부 상태
  const [isTimerPaused, setIsTimerPaused] = useState<boolean>(false); // 일시중지 상태
  const [isSectionMoving, setIsSectionMoving] = useState<boolean>(false); // 섹션 이동 대기 상태

  const formArrRef = useRef<FormContent[]>(formArr);
  const ttsIdxRef = useRef<number>(ttsIdx);
  const isTTSPlayingRef = useRef(isTTSPlaying);

  const {fontSizeSetting, isDarkMode, ttsSpeedSetting, ttsVoiceIndex} =
    useSettingStore();
  const navigation = useNavigation();
  const {updateLastAccessedBookId} = useEpubStore();

  // epubjs-react-native/core 라이브러리 제공 메서드 사용
  const {
    changeTheme,
    getCurrentLocation,
    changeFontSize,
    goToLocation,
    clearSearchResults,
    addAnnotation,
    injectJavascript,
    goNext,
    toc,
    searchResults,
    isSearching,
    search,
  } = useReader();

  // 책 초기설정
  useEffect(() => {
    // library.json에서 받은 책 정보를 기반으로 렌더링 로직 변경
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
          setBookSrc(bookData.filePath);
          setTitle(bookData.title);
          if (bookData.currentCfi) {
            setInitialCfi(bookData.currentCfi);
          }
          if (bookData.myTtsFlag) {
            setIsCustomBook(true);
          }
          if (bookData.progressRate) {
            setProgress(Number((bookData.progressRate / 100).toFixed(2)));
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
      } else {
        setReadNoteArr(readNotes);
      }
    });
    BackHandler.addEventListener('hardwareBackPress', handlegoBack);
  }, []);

  // 타이머 관련 인터벌
  function useInterval(callback: () => void, delay: number | null) {
    const savedCallback = useRef<() => void>();

    useEffect(() => {
      savedCallback.current = callback;
    }, [callback]);

    useEffect(() => {
      function tick() {
        if (savedCallback.current) {
          savedCallback.current();
        }
      }
      if (delay !== null) {
        const id = setInterval(tick, delay);
        return () => clearInterval(id);
      }
    }, [delay]);
  }

  // useInterval을 사용하여 타이머가 1초마다 감소하도록 설정
  useInterval(
    () => {
      setTimeLeft(prevTime => (prevTime > 0 ? prevTime - 1 : 0));
    },
    isTimerOn && !isTimerPaused && timeLeft > 0 ? 1000 : null,
  );

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

  // 애니메이션 설정
  // 네비게이션 바의 Y 위치를 조절하는 애니메이션 값
  const translateYNav = useSharedValue(-animHeight); // 초기에는 화면 밖에 위치
  const translateYFoot = useSharedValue(animHeight);
  const indexSidebarX = useSharedValue(-width);
  const bookNoteSideBarX = useSharedValue(width);
  const settingSideBarX = useSharedValue(width);
  const settingTTSSideBarX = useSharedValue(width);

  // 나중에 한국어 모드 할거면 모드를 한국어로 변경
  // Tts.setDefaultLanguage('en-US');
  Tts.setDefaultLanguage('ko-KR');

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
    setIsSearchingOn(false); // EbookSearch 닫기
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

  // 현재 Section의 데이터를 긁어 formArr에 주입하는 로직을 Javascript inject. 커스텀북용
  const getFormArrForCustomBook = () => {
    injectJavascript(`getFormArrForCustomBook();`);
  };

  // 커스텀북일 시 발동시켜 페이지 위치 이동 시 로직이 잘 작동하도록 만듦
  const switchCustomBookMode = () => {
    injectJavascript(`isCustomBook = true; getFormArrForCustomBook(); `);
  };

  // 목차 클릭 시 페이지 이동 지원
  const tocDisPlay = (tocHref: string) => {
    injectJavascript(`
      const tempString = "${tocHref}".split('/')[1]
      window.ReactNativeWebView.postMessage(JSON.stringify({ msggs: tempString }));
      rendition.display(tempString);
      `);
  };

  const ttsIdxToNext = (): void => {
    if (formArrRef.current.length - 1 > ttsIdxRef.current) {
      Tts.stop();
      playTextSequentially();
    }
  };

  const ttsIdxToPrev = (): void => {
    if (
      ttsIdxRef.current > 1 &&
      formArrRef.current.length > ttsIdxRef.current
    ) {
      Tts.stop();
      setttsIdx(prev => {
        handleRemoveAnnotation(formArrRef.current[prev - 1].cfisRange);
        return prev - 2;
      });
      playTextSequentially();
    }
  };

  const trackCurrentTtsIdx = (): void => {
    const startCfi: string | undefined = getCurrentLocation()?.start.cfi;
    const endCfi: string | undefined = getCurrentLocation()?.end.cfi;
    if (!startCfi && !endCfi) {
      return;
    }
    if (formArr.length > ttsIdx && formArr[ttsIdx]?.cfisRange) {
      const validationNumUp = compareCFIStrings(
        startCfi,
        formArr[ttsIdx].cfisRange,
      );
      const validationNumDown = compareCFIStrings(
        formArr[ttsIdx].cfisRange,
        endCfi,
      );
      if (validationNumUp < 1 && validationNumDown < 1) {
        return;
      }
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
    setIsSectionMoving(false);
    if (formArr.length > 0) {
      playTextSequentially(); // formArr이 비어 있지 않으면 playTextSequentially 실행
    }
  };

  // TTS 작동 함수. TTS를 이어가며, 완료되면 예외처리
  const playTextSequentially = async () => {
    setttsIdx(prevIdx => {
      if (!isTTSPlayingRef.current || formArrRef.current.length === 0) {
        return prevIdx;
      }

      if (ttsIdxRef.current >= formArrRef.current.length - 1) {
        handleRemoveAnnotation(
          formArrRef.current[ttsIdxRef.current - 1].cfisRange,
        );
        setFormArr([]); // formArr 초기화
        setIsSectionMoving(true);
        goNext();
        return 0;
      }

      // TTS 문장 재생 및 다음으로 이동
      const item = formArrRef.current[prevIdx];
      Tts.speak(item.sentence);
      addAnnotation('highlight', item.cfisRange);
      if (prevIdx > 0) {
        handleRemoveAnnotation(formArrRef.current[prevIdx - 1].cfisRange);
      }
      handlePageMoving(item.cfisRange);

      return prevIdx + 1;
    });
  };

  // TTS 종료 이벤트 관리
  useEffect(() => {
    ttsIdxRef.current = ttsIdx;
    if (ttsIdx === 0 && isSectionMoving) {
      setTtsReset();
    }

    const onTtsFinish = () => {
      if (
        isTTSPlayingRef.current &&
        ttsIdxRef.current < formArrRef.current.length
      ) {
        playTextSequentially();
      }
    };

    // 이벤트 중복 방지
    Tts.removeAllListeners('tts-finish');
    Tts.addEventListener('tts-finish', onTtsFinish);

    return () => Tts.removeAllListeners('tts-finish');
  }, [ttsIdx]);

  useEffect(() => {
    formArrRef.current = formArr;
    // formArr이 비어있지 않을 때만 TTS를 시작하도록
    if (formArr.length > 0 && isTTSPlaying) {
      playTextSequentially();
    }
  }, [formArr]);

  useEffect(() => {
    isTTSPlayingRef.current = isTTSPlaying;

    if (isTTSPlaying && formArr.length > 0) {
      if (!hasUsedInitialCfi && initialCfi) {
        setttsIdx(indexOfCfis(initialCfi));
        setHasUsedInitialCfi(true);
      } else {
        if (ttsIdx > 0) {
          setttsIdx(prev => prev - 1);
          trackCurrentTtsIdx();
        }
      }
      playTextSequentially();
    }
  }, [isTTSPlaying]);

  // 타이머 관련
  useEffect(() => {
    if (timeLeft === 0) {
      handleTTSModeClose();
      return;
    }

    const timerId = setInterval(() => {
      setTimeLeft(prevTime => {
        if (prevTime <= 1) {
          clearInterval(timerId);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timerId);
  }, []);

  // TTS 시작 함수
  const handleTTSPlay = (): void => {
    if (isTTSPlaying) {
      Tts.stop();
      setIsTimerPaused(true);
      setIsSwipable(true);
      if (ttsIdx > 0) {
        handleRemoveAnnotation(formArrRef.current[ttsIdx - 1].cfisRange);
      }
    } else {
      setIsTimerPaused(false);
      setIsSwipable(false);
    }
    setIsTTSPlaying(prev => !prev);
  };

  //
  const indexOfCfis = (cfiRange: string): number => {
    const idx: number = formArrRef.current.findIndex(formItem => {
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
    const data: ICreateNote = {
      bookId: bookId,
      progressRate: progress * 100,
      sentence: formArr[currentidx].sentence,
      sentenceId: formArr[currentidx].cfisRange,
    };
    createReadNote(data).then(() => {
      addAnnotation('underline', formArr[currentidx].cfisRange, undefined, {
        color: '#f6f8ff',
        thickness: 5,
      });

      const tempNote: IReadNote = {
        noteId: data.bookId,
        progressRate: data.progressRate,
        sentence: data.sentence,
        sentenceId: data.sentenceId,
        title: data.sentence,
        createdAt: getCurrentDate(),
      };
      readNoteArr.push(tempNote);
    });
  };

  const handleOnReady = (): void => {
    isCustomBook ? switchCustomBookMode() : getFormArr();
    changeFontSize(fontSizeTable[fontSizeSetting]);
    Tts.setDefaultVoice(voiceMagicTable[ttsVoiceIndex]);
    Tts.setDefaultRate(ttsSpeedSetting / 2);
    if (readNoteArr.length > 0) {
      readNoteArr.forEach(note => {
        addAnnotation('underline', note.sentenceId, undefined, {
          color: '#0019f4',
          thickness: 5,
        });
      });
    }
    if (initialCfi) {
      goToLocation(initialCfi);
    }
    updateLastAccessedBookId(bookId);
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

  // 뒤로갈 떄 작동. library.json의 cfi 갱신. true를 반환해 BackHandler 작동 시 기본 동작을 막음.
  const handlegoBack = (): boolean => {
    if (
      ttsIdxRef?.current &&
      formArr.length > 0 &&
      formArr.length > ttsIdxRef.current
    ) {
      const currentCfi: string | undefined =
        formArr[ttsIdxRef.current]?.cfisRange;
      if (currentCfi) {
        updateLibraryInfoOfBook(currentCfi);
      }
    }
    navigation.goBack();
    return true;
  };

  // 타이머 켜는 메소드
  const handleTimerOn = (settingTime: number) => {
    setTimeLeft(settingTime);
    setIsTimerOn(true);
    handleTTSPlay();
  };

  // 타이머 끄는 메소드
  const handleTimerOff = () => {
    if (isTimerOn) {
      setIsTimerOn(false);
      setTimeLeft(0);
      handleTTSPlay();
    }
  };

  // 독서노트 press시 핸들러
  const handleReadNotePress = (cfiRange: string) => {
    goToLocation(cfiRange);
    setHasUsedInitialCfi(false);
    setTimeout(() => {
      setttsIdx(() => indexOfCfis(cfiRange) + 1);
      setHasUsedInitialCfi(true);
    }, 1000);
  };

  // TTSModoe 종료
  const handleTTSModeClose = (): void => {
    Tts.stop();
    if (isTimerOn) {
      setIsTimerOn(false);
    }
    if (isTTSPlaying) {
      setIsTTSPlaying(false);
    }
    if (isTTSMode) {
      setIsTTSMode(false);
    }
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      {/* 네비게이션 바 */}
      <Animated.View style={[styles.navBar, animatedStyleNav]}>
        {isTTSMode ? (
          <TouchableOpacity
            onPress={() => {
              isTimerOn ? handleTimerOff() : handleTTSModeClose();
            }}
            style={styles.ttsEndBox}>
            <Text style={[styles.navBarText, {color: 'black'}]}>
              {isTimerOn ? timeParser(timeLeft) : 'TTS 모드 종료'}
            </Text>
          </TouchableOpacity>
        ) : (
          <>
            <TouchableOpacity onPress={handlegoBack}>
              <Image source={leftarrowicon} style={styles.icon} />
            </TouchableOpacity>
            <Text style={styles.navBarText}>{title ? title : '책 타이틀'}</Text>
            {/* 검색 및 검색 결과 */}
            <TouchableOpacity onPress={() => setIsSearchingOn(true)}>
              <Image source={searchicon} style={styles.icon} />
            </TouchableOpacity>
          </>
        )}
      </Animated.View>
      {/*{ isSearching ? <EbookSearch /> : null}*/}
      {isSearchingOn ? (
        <EbookSearch
          onClose={() => setIsSearchingOn(false)}
          onLocationSelect={handleLocationSelect} // 위치 선택 핸들러 전달
          searchInput={searchInput}
          setSearchInput={setSearchInput}
          searchResults={searchResults}
          isSearching={isSearching}
          search={search}
          clearSearchResults={clearSearchResults}
        />
      ) : null}
      {/* 사이드바 */}
      <EbookIndex
        indexSidebarX={indexSidebarX}
        toggleIndex={toggleIndex}
        title={title}
        tocArr={tocArr}
        tocDisPlay={tocDisPlay}
      />
      {/* 독서노트 */}
      <EbookBookNote
        bookNoteSideBarX={bookNoteSideBarX}
        toggleBookNote={toggleBookNote}
        title={title}
        readNoteArr={readNoteArr}
        handleReadNotePress={handleReadNotePress}
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
        handleTimerOn={handleTimerOn}
      />
      <TouchableOpacity style={{flex: 1}} onPress={toggleNav}>
        <Reader
          src={bookSrc}
          fileSystem={useFileSystem}
          flow="paginated"
          onSwipeRight={() => {
            setHasUsedInitialCfi(true);
          }}
          onSwipeLeft={() => setHasUsedInitialCfi(true)}
          onReady={handleOnReady} // 처음 책이 준비가 됐을 시 작동해서 formArr(아마도 cover img)를 받아옴
          onLocationsReady={() => {
            setTocArr(toc);
          }}
          defaultTheme={isDarkMode ? Themes.DARK : Themes.LIGHT}
          enableSwipe={isSwipable}
          onWebViewMessage={message => {
            if (message?.formArr) {
              if (formArr) {
                setFormArr(() => [...message.formArr]);
              }
            } else if (message?.updateIdx) {
              setttsIdx(message.updateIdx);
            } else if (message?.gonextpage) {
              goNext();
            }
            if (message?.reloc) {
              setProgress(message.reloc);
            }
          }}
          injectedJavascript={`
let nowIndex = 0;
let isCustomBook = false;
window.ReactNativeWebView.postMessage(JSON.stringify({ msgg: "시작" }));

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
window.ReactNativeWebView.postMessage(JSON.stringify({ msgg: "formArr 시작" }));
  const currentLoc = await rendition.currentLocation();
  const formArr = [];
  const contentt = rendition.getContents();
  const contents = contentt[0];
  const currentView = rendition.manager.current();
  const currentSection = currentView.section;
  const paragraphs = contents.document.querySelectorAll("title, h1, h2, h3, p");

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
const locPercentage =  book.locations.percentageFromCfi(location.start.cfi)
window.ReactNativeWebView.postMessage(JSON.stringify({ reloc: locPercentage }));
  window.ReactNativeWebView.postMessage(JSON.stringify({ msgg: "리로케이트", pvi: nowIndex, ci: location.start.index }));
  if (location.start.index !== nowIndex) {
    nowIndex = location.start.index;
    if (isCustomBook) { getFormArrForCustomBook(); }
    else { getFormArr(); }
  }
});


// getFormArrForCustomBook에서 Range를 생성하고 cfisRange를 계산하는 함수
const createCfiObject = (currentSection, sentence, element, isNode) => {
  const range = document.createRange();
  try {
    if (isNode) {
      range.selectNodeContents(element);
    } else {
      const startOffset = element.textContent.indexOf(sentence);
      const endOffset = startOffset + sentence.length;
      range.setStart(element.firstChild, startOffset);
      range.setEnd(element.firstChild, endOffset);
    }
    const cfisRange = currentSection.cfiFromRange(range);
    return { sentence, cfisRange };
  } catch (error) {
    window.ReactNativeWebView.postMessage(JSON.stringify({ msgg: "에러남" }));
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
    "img, p, h1, h2, h3, span"
  );
  // 요소별 로직 처리
  for (const element of elements) {
    const tagName = element.tagName.toLowerCase();
    if (tagName === "img") {
      const sentence = element.alt;
      const tempObj = createCfiObject(currentSection, sentence, element, true);
      if (tempObj) formArr.push(tempObj);
    } else if (["h1", "h2", "h3", "span"].includes(tagName)) {
      const sentence = element.textContent;
      const tempObj = createCfiObject(currentSection, sentence, element, false);
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
              <TouchableOpacity onPress={ttsIdxToPrev}>
                <Image source={prevbuttonicon} style={styles.footericon} />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleTTSPlay}>
                {isTTSPlaying ? (
                  <Image source={pausebuttonicon} style={styles.footericon} />
                ) : (
                  <Image source={playbuttonicon} style={styles.footericon} />
                )}
              </TouchableOpacity>
              <TouchableOpacity onPress={ttsIdxToNext}>
                <Image
                  source={prevbuttonicon}
                  style={[styles.footericon, {transform: [{scaleX: -1}]}]}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => (isTTSPlaying ? {} : toggleTTSSetting())}>
                <Image
                  source={settingicon}
                  style={
                    isTTSPlaying ? styles.footericonDisable : styles.footericon
                  }
                />
              </TouchableOpacity>
            </>
          ) : (
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
    fontSize: width * 0.06, // 상대적인 글꼴 크기 0.1 > 0.04로 수정
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
  footericonDisable: {
    width: width * 0.1, // 화면 너비의 10%
    height: width * 0.1, // 화면 너비의 10% (정사각형)
    tintColor: 'gray',
    opacity: 0.2,
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

const EBookViewerPage: React.FC<Props> = ({route, navigation}) => {
  return (
    <ReaderProvider>
      <Component route={route} navigation={navigation} />
    </ReaderProvider>
  );
};

export default EBookViewerPage;
