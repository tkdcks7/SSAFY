// src/components/viewer/EbookIndex.tsx
import React from 'react';
import { Text, View, ScrollView, StyleSheet, Dimensions, TouchableOpacity, Image } from 'react-native';
import leftarrowicon from '../../assets/icons/leftarrow.png';
import Animated, { useAnimatedStyle, SharedValue } from 'react-native-reanimated';
import BookNoteContent from './BookNoteContent';

// 하위 컴포넌트의 Props 타입 정의
type SidebarProps = {
  bookNoteSideBarX: SharedValue<number>;
  toggleBookNote: () => void; // onPress는 반환값이 없는 함수 타입
};

interface IBookNote {
    noteId: number;
    bookId: number;
    title: string;
    progressRate: number;
    createdAt: string;
    sentence: string;
    sentenceId: string;
};


// 임시 데이터
const noteList: IBookNote[] = [
          {
            "noteId": 1356,
            "bookId": 16142,
            "title": "제목",
            "progressRate": 42,
            "createdAt": "2024-10-18 23:44",
            "sentence": "예시 문장입니다.",
            "sentenceId": "391"
        },
        {
            "noteId": 1357,
            "bookId": 16143,
            "title": "두 번째 제목",
            "progressRate": 25,
            "createdAt": "2024-10-19 08:22",
            "sentence": "이것은 두 번째 예시 문장입니다.",
            "sentenceId": "392"
        },
        {
            "noteId": 1358,
            "bookId": 16144,
            "title": "세 번째 제목",
            "progressRate": 60,
            "createdAt": "2024-10-20 15:18",
            "sentence": "이것은 세 번째 예시 문장입니다.",
            "sentenceId": "393"
        },
        {
            "noteId": 1359,
            "bookId": 16145,
            "title": "네 번째 제목",
            "progressRate": 80,
            "createdAt": "2024-10-21 10:30",
            "sentence": "이것은 네 번째 예시 문장입니다.",
            "sentenceId": "394"
        },
        {
            "noteId": 1360,
            "bookId": 16146,
            "title": "다섯 번째 제목",
            "progressRate": 95,
            "createdAt": "2024-10-22 21:00",
            "sentence": "이것은 다섯 번째 예시 문장입니다.",
            "sentenceId": "395"
        }
]


const { width, height } = Dimensions.get('window');

const EbookBookNote: React.FC<SidebarProps> = ({ bookNoteSideBarX, toggleBookNote }) => {
  const animatedIndexStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: bookNoteSideBarX.value }],
  }));

  return (
    <Animated.View style={[styles.sidebar, animatedIndexStyle]}>
        <View style={styles.navBar}>
            <TouchableOpacity onPress={toggleBookNote}>
                <Image
                source={leftarrowicon}
                style={styles.icon}
                />
            </TouchableOpacity>
        <Text style={styles.navBarText}>독서노트</Text>
        <View accessible={false}/>
        </View>
        <ScrollView style={{ flex: 1, marginTop: height * 0.1 }}>
            <View style={styles.titleBox}>
                <Text style={styles.bookTitle}>책 제목</Text>
            </View>
            { noteList.map((item, index) => {
                return <BookNoteContent key={index} title={item.title} progress={item.progressRate} date={item.createdAt}/>
                })}
        </ScrollView>
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
    titleBox: {
        width: '100%',
        height: height * 0.15,
        borderWidth: 3,
        justifyContent: 'center',
        alignItems:'center',
        paddingHorizontal: 5
    },
    bookTitle: {
        fontWeight: 'bold',
        fontSize: width * 0.1, // 상대적인 글꼴 크기
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
      zIndex: 12
    },
})

export default EbookBookNote;