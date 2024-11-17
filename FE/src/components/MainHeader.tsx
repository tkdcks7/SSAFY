import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import notesicon from '../assets/icons/newnote.png';

const { width, height } = Dimensions.get('window');

type MainHeaderProps = {
  title: string;
  isScrolled?: boolean; // isScrolled를 optional로 설정
};

type NavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

const MainHeader: React.FC<MainHeaderProps> = ({ title, isScrolled = false }) => {
  const navigation = useNavigation<NavigationProp>();

  return (
    <View style={[styles.container, isScrolled && styles.scrolledContainer]}>
      {/* Left Placeholder */}
      <View style={styles.leftContainer} />

      {/* Title */}
      <View style={styles.titleContainer}>
        <Text style={[styles.title, isScrolled && styles.scrolledTitle]}>{title}</Text>
      </View>

      {/* Right (Reading Notes) */}
      <View style={styles.rightContainer}>
        <TouchableOpacity style={styles.bookmarkButton} onPress={() => navigation.navigate('ReadingNotes')}>
          <Image source={notesicon} style={[styles.icon, isScrolled && styles.scrolledIcon]} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: height * 0.1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#3943B7',
    paddingHorizontal: width * 0.03,
  },
  leftContainer: {
    width: width * 0.15, // 오른쪽과 균형을 맞추기 위한 여백
  },
  titleContainer: {
    position: 'absolute', // 타이틀을 정중앙에 위치
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    color: 'white',
    fontSize: width * 0.09,
    fontFamily: 'Bungee-Regular',
    includeFontPadding: false, // 폰트 기본 패딩 제거
  },
  rightContainer: {
    width: width * 0.15,
    alignItems: 'flex-end',
  },
  icon: {
    width: width * 0.15,
    height: width * 0.15,
    tintColor: 'white',
  },
  bookmarkButton: {
    padding: width * 0.02,
  },
  // 스크롤 효과 스타일
  scrolledContainer: {
    backgroundColor: '#F5F5F5',
  },
  scrolledTitle: {
    color: '#3943B7',
  },
  scrolledIcon: {
    tintColor: '#3943B7',
  },
});

export default MainHeader;
