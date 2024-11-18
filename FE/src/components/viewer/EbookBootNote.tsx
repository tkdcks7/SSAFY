// src/components/viewer/EbookBookNote.tsx
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
import Animated, {useAnimatedStyle, SharedValue} from 'react-native-reanimated';
import BookNoteContent from './BookNoteContent';
import {IReadNote} from '../../services/ViewerPage/readNotes';

// 하위 컴포넌트의 Props 타입 정의
type SidebarProps = {
  bookNoteSideBarX: SharedValue<number>;
  toggleBookNote: () => void;
  readNoteArr: IReadNote[];
  handleReadNotePress: (cfi: string) => void;
};

const {width, height} = Dimensions.get('window');

const EbookBookNote: React.FC<SidebarProps> = ({
  bookNoteSideBarX,
  toggleBookNote,
  readNoteArr,
  handleReadNotePress,
}) => {
  const animatedIndexStyle = useAnimatedStyle(() => ({
    transform: [{translateX: bookNoteSideBarX.value}],
  }));

  return (
    <Animated.View style={[styles.sidebar, animatedIndexStyle]}>
      <View style={styles.navBar}>
        <TouchableOpacity onPress={toggleBookNote}>
          <Image source={leftarrowicon} style={styles.icon} />
        </TouchableOpacity>
        <Text style={styles.navBarText}>독서노트</Text>
        <View accessible={false} />
      </View>
      <ScrollView style={{flex: 1, marginTop: height * 0.1}}>
        <View style={styles.titleBox}>
          <Text style={styles.bookTitle}>책 제목</Text>
        </View>
        {readNoteArr.map((item, index) => {
          return (
            <BookNoteContent
              key={index}
              item={item}
              handleReadNotePress={handleReadNotePress}
              toggleBookNote={toggleBookNote}
            />
          );
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
    fontWeight: 'bold',
    fontSize: width * 0.1,
  },
  icon: {
    width: width * 0.1,
    height: width * 0.1,
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
    fontSize: width * 0.1,
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

export default EbookBookNote;
