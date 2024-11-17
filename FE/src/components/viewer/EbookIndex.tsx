// src/components/viewer/EbookIndex.tsx
import React from 'react';
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

// 목차 타입
type TocContent = {
  id: string;
  label: string;
  href: string;
  subitems?: any;
};

// 하위 컴포넌트의 Props 타입 정의
type SidebarProps = {
  indexSidebarX: SharedValue<number>;
  toggleIndex: () => void; // onPress는 반환값이 없는 함수 타입
  tocArr: TocContent[];
  tocDisPlay: (tocHref: string) => void;
};

// 목차 데이터 받아오기
const titleData: string[] = ['제목1', '제목2', '제목3', '제목4', '제목5'];

const {width, height} = Dimensions.get('window');

const EbookIndex: React.FC<SidebarProps> = ({
  indexSidebarX,
  toggleIndex,
  tocArr,
  tocDisPlay,
}) => {
  const animatedIndexStyle = useAnimatedStyle(() => ({
    transform: [{translateX: indexSidebarX.value}],
  }));

  const handleIndexPress = (tocHref: string) => {
    console.log('눌림눌림');
    console.log(`tocHref=${tocHref}`);
    tocDisPlay(tocHref);
    toggleIndex();
  };

  return (
    <Animated.View style={[styles.sidebar, animatedIndexStyle]}>
      <View style={styles.navBar}>
        <TouchableOpacity onPress={toggleIndex}>
          <Image source={leftarrowicon} style={styles.icon} />
        </TouchableOpacity>
        <Text style={styles.navBarText}>목차</Text>
        <View accessible={false} />
      </View>
      <ScrollView style={{flex: 1, marginTop: height * 0.1}}>
        <View style={styles.titleBox}>
          <Text style={styles.bookTitle}>책 제목</Text>
        </View>
        {tocArr.map((item, index) => (
          <IndexChapter
            key={index}
            chapter={item.label}
            onPress={() => handleIndexPress(item.href)}
          />
        ))}
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
    alignItems: 'center',
    paddingHorizontal: 5,
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
    zIndex: 11,
  },
});

export default EbookIndex;
