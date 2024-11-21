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
  ReaderProvider,
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
import RNFS from 'react-native-fs';
import Tts from 'react-native-tts';

// Store
import useSettingStore, {fontSizeTable} from '../../store/settingStore';

import {
  getReadNote,
  createReadNote,
  ICreateNote,
  IReadNote,
} from '../../services/ViewerPage/readNotes';

// service 및 utils
import {
  compareCFIStrings,
  getCurrentDate,
  timeParser,
} from '../../utils/cfiManager';
import useEpubStore from '../../store/epubStore';
import {injectedScrpt} from '../../utils/injectedScript';

// 모달 등
import EbookIndex from '../../components/viewer/EbookIndex';
import EbookBookNote from '../../components/viewer/EbookBootNote';
import EbookSetting from '../../components/viewer/EbookSetting';
import EbookTTSSetting from '../../components/viewer/EbookTTSSetting';

import ProgressBar from '../../components/viewer/ProgressBar';
import EbookSearch from '../../components/viewer/EbookSearch';
import EbookIcon from '../../components/viewer/EbookIcon';

// 아이콘
import noteicon from '../../assets/icons/notes.png';
import indexmenuicon from '../../assets/icons/indexmenu.png';
import settingicon from '../../assets/icons/setting.png';
import headphoneicon from '../../assets/icons/headphone.png';
import prevbuttonicon from '../../assets/icons/pervbutton.png';
import playbuttonicon from '../../assets/icons/playbutton.png';
import pausebuttonicon from '../../assets/icons/pausebutton.png';
import leftarrowicon from '../../assets/icons/leftarrow.png';
import searchicon from '../../assets/icons/search.png';

// Type
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

// 음성 종류 매직 테이블
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
  const [isCustomBook, setIsCustomBook] = useState<boolean>(true);
  const [hasUsedInitialCfi, setHasUsedInitialCfi] = useState(false);

  // 검색어 관리
  const [searchInput, setSearchInput] = useState('');

  // 목차 정보
  const [tocArr, setTocArr] = useState<TocContent[]>([]);

  // 타이머 설정
  const [timeLeft, setTimeLeft] = useState<number>(0); // 타이머 시간 상태
  const [isTimerOn, setIsTimerOn] = useState<boolean>(false); // 타이머 여부 상태
  const [isTimerPaused, setIsTimerPaused] = useState<boolean>(false); // 일시중지 상태
  const [isSectionMoving, setIsSectionMoving] = useState<boolean>(false); // 섹션 이동 대기 상태

  const formArrRef = useRef<FormContent[]>(formArr);
  const ttsIdxRef = useRef<number>(ttsIdx);
  const isTTSPlayingRef = useRef(isTTSPlaying);

  // store에서 메소드 꺼내기
  const {fontSizeSetting, isDarkMode, ttsSpeedSetting, ttsVoiceIndex} =
    useSettingStore();
  const {updateLastAccessedBookId} = useEpubStore();
  const navigation = useNavigation();

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
          if (bookData.myTtsFlag === false) {
            setIsCustomBook(false);
          }
          if (bookData.progressRate) {
            const initalProgress: number =
              bookData.progressRate > 1
                ? bookData.progressRate / 100
                : bookData.progressRate;
            setProgress(initalProgress);
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

  Tts.setDefaultLanguage('ko-KR'); // tts 한국어로

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

  // 타이머 관련 useEffect
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

  // 커스텀북일 시 발동시켜 페이지 위치 이동 시 로직이 잘 작동하도록 만듦
  const getFormArrForCustomBook = () => {
    injectJavascript(`getFormArrForCustomBook(); `);
  };

  // 목차 클릭 시 페이지 이동 지원
  const tocDisPlay = (tocHref: string) => {
    const hrefString: string = tocHref.split('/')[1];
    goToLocation(hrefString);
  };

  // annotation 제거를 Javascript를 주입하여 해결
  const handleRemoveAnnotation = (cfiRangeOfAnnotation: string) => {
    const functionString: string = `rendition.annotations.remove('${cfiRangeOfAnnotation}', 'highlight');`;
    injectJavascript(functionString);
  };

  // inject된 script에서 정의된 handlePageMove(cfisRange)를 주입
  // cfisRange에 해당하는 문자열이 현재 페이지에 있는지 판별 후 페이지 이동
  const handlePageMoving = (cfisRange: string): void => {
    const functionString: string = `handlePageMove('${cfisRange}');`;
    injectJavascript(functionString);
  };

  // 검색창에서 결과 선택
  const handleLocationSelect = (cfi: string) => {
    goToLocation(cfi); // 선택된 위치로 이동
    setIsSearchingOn(false); // EbookSearch 닫기
  };

  // 다음 문장으로 이동
  const ttsIdxToNext = (): void => {
    if (formArrRef.current.length - 1 > ttsIdxRef.current) {
      Tts.stop();
      playTextSequentially();
    }
  };

  // 이전 문장으로 이동
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

      if (prevIdx >= formArrRef.current.length) {
        handleRemoveAnnotation(formArrRef.current[prevIdx - 1].cfisRange);
        if (getCurrentLocation()?.atEnd) {
          handlegoBack();
          return 0;
        }
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
        ttsIdxRef.current <= formArrRef.current.length
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
        } else if (ttsIdx < 0) {
          trackCurrentTtsIdx();
        }
      }
      playTextSequentially();
    }
  }, [isTTSPlaying]);

  useEffect(() => {
    formArrRef.current = formArr;
    // formArr이 비어있지 않을 때만 TTS를 시작하도록
    if (formArr.length > 0 && isTTSPlaying) {
      playTextSequentially();
    }
  }, [formArr]);

  // TTS 시작 함수
  const handleTTSPlay = (): void => {
    if (isTTSPlaying) {
      Tts.stop();
      setIsTimerPaused(true);
      if (ttsIdx > 0) {
        handleRemoveAnnotation(formArrRef.current[ttsIdx - 1].cfisRange);
      }
    } else {
      setIsTimerPaused(false);
    }
    setIsTTSPlaying(prev => !prev);
  };

  // cfisRange가 현재 저장된 formArr의 몇 번째 index인지 반환
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

  // Ebook이 준비됐을 시 작동
  const handleOnReady = (): void => {
    if (isCustomBook) {
      getFormArrForCustomBook();
    }
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
      goNext();
      setTimeout(() => {
        goToLocation(initialCfi);
      }, 1500);
    }
    updateLastAccessedBookId(bookId);
  };

  // 특정 bookId를 가진 책의 currentCfi를 수정하는 함수
  const updateLibraryInfoOfBook = async (
    newCfi: string,
    currentProgressRate?: number,
  ) => {
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
      if (currentProgressRate) {
        library[bookIndex].progressRate = Number(
          (currentProgressRate * 100).toFixed(2),
        );
      }
      // 수정된 데이터를 JSON 파일에 다시 저장
      await RNFS.writeFile(dbPath, JSON.stringify(library), 'utf8');
    } catch (error) {
      console.error('library.json 정보 수정 중 에러 발생', error);
    }
  };

  // 뒤로 갈 떄 작동. library.json의 cfi 갱신. true를 반환해 BackHandler 작동 시 기본 동작을 막음.
  const handlegoBack = (): boolean => {
    if (
      ttsIdxRef?.current &&
      formArr.length > 0 &&
      formArr.length > ttsIdxRef.current
    ) {
      const currentCfi: string | undefined =
        formArr[ttsIdxRef.current]?.cfisRange;
      const currentProgressRate: number | undefined = progress;
      if (currentCfi) {
        updateLibraryInfoOfBook(currentCfi, currentProgressRate);
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

  // TTSMode 종료
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
            accessible={true}
            accessibilityRole="button"
            style={styles.ttsEndBox}>
            <Text style={[styles.navBarText, {color: 'black'}]}>
              {isTimerOn ? timeParser(timeLeft) : 'TTS 모드 종료'}
            </Text>
          </TouchableOpacity>
        ) : (
          <>
            <EbookIcon
              source={leftarrowicon}
              onPress={handlegoBack}
              accessibilitylabel="뷰어 나가기"
              style={{tintColor: 'white'}}
            />
            <Text style={styles.navBarText} numberOfLines={1}>
              {title ? title : '책 타이틀'}
            </Text>
            <EbookIcon
              source={searchicon}
              onPress={() => setIsSearchingOn(true)}
              accessibilitylabel="검색"
              style={{tintColor: 'white'}}
            />
          </>
        )}
      </Animated.View>
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
      {/* 목차 */}
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
      <TouchableOpacity
        style={{flex: 1}}
        onPress={toggleNav}
        accessible={true}
        accessibilityLabel={'뷰어 화면'}
        accessibilityHint={isVisible ? '네비게이션 닫기' : '네비게이션 열기'}>
        <Reader
          src={bookSrc}
          fileSystem={useFileSystem}
          flow="paginated"
          onSwipeRight={() => {
            setHasUsedInitialCfi(true);
          }}
          onSwipeLeft={() => {
            setHasUsedInitialCfi(true);
          }}
          onReady={handleOnReady} // 처음 책이 준비가 됐을 시 작동해서 formArr(아마도 cover img)를 받아옴
          onLocationsReady={() => {
            setTocArr(toc);
          }}
          defaultTheme={isDarkMode ? Themes.DARK : Themes.LIGHT}
          enableSwipe={!isTTSMode}
          onWebViewMessage={message => {
            // console.log(message);
            if (message?.formArr) {
              if (formArr) {
                setFormArr(() => [...message.formArr]);
              }
            } else if (message?.updateIdx) {
              setttsIdx(message.updateIdx);
            } else if (message?.gonextpage) {
              goNext();
            } else if (message?.reprogress) {
              setProgress(message.reprogress);
            }
          }}
          injectedJavascript={injectedScrpt}
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
            onPress={handleReadNoteSave}
            accessible={true}
            accessibilityRole="button">
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
              <EbookIcon
                source={prevbuttonicon}
                onPress={ttsIdxToPrev}
                accessibilitylabel={'이전 문장으로 이동'}
              />
              <EbookIcon
                source={isTTSPlaying ? pausebuttonicon : playbuttonicon}
                onPress={handleTTSPlay}
                accessibilitylabel={isTTSPlaying ? 'TTS 중지' : 'TTS 시작'}
              />
              <EbookIcon
                source={prevbuttonicon}
                onPress={ttsIdxToNext}
                accessibilitylabel={'다음 문장으로 이동'}
                style={{transform: [{scaleX: -1}]}}
              />
              <EbookIcon
                source={settingicon}
                onPress={() => (isTTSPlaying ? {} : toggleTTSSetting())}
                accessibilitylabel={'TTS 설정 토글'}
                style={
                  isTTSPlaying ? {tintColor: 'gray', opacity: 0.2} : undefined
                }
              />
            </>
          ) : (
            <>
              <EbookIcon
                source={indexmenuicon}
                onPress={toggleIndex}
                accessibilitylabel={'목차 토글'}
              />
              <EbookIcon
                source={headphoneicon}
                onPress={() => setIsTTSMode(true)}
                accessibilitylabel={'TTS 모드 시작'}
              />
              <EbookIcon
                source={noteicon}
                onPress={toggleBookNote}
                accessibilitylabel={'독서노트 목록 토글'}
              />
              <EbookIcon
                source={settingicon}
                onPress={toggleSetting}
                accessibilitylabel={'뷰어 설정창 토글'}
              />
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
    height: height * 0.1,
    backgroundColor: '#3943B7',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 10,
    flexDirection: 'row',
    paddingHorizontal: width * 0.03,
  },
  navBarText: {
    color: 'white',
    fontSize: width * 0.06,
    fontWeight: 'bold',
    maxWidth: '75%',
  },
  button: {
    marginTop: height * 0.2,
    padding: width * 0.03,
    backgroundColor: '#3943B7',
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: width * 0.04,
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
