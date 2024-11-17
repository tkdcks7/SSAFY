import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import accessbilityicon from '../assets/icons/accessbility.png';
// import notesicon from '../assets/icons/notes.png';
import notesicon from '../assets/icons/newnote.png';

const { width, height } = Dimensions.get('window');

type MainHeaderProps = {
  title: string;
  isAccessibilityMode: boolean;
  isUserVisuallyImpaired: boolean;
  onModeToggle?: () => void; // 모드 전환 함수
  isScrolled: boolean; // 스크롤 여부 prop 추가
};

type NavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

const MainHeader: React.FC<MainHeaderProps> = ({ title, isAccessibilityMode, isUserVisuallyImpaired, onModeToggle, isScrolled }) => {
  const navigation = useNavigation<NavigationProp>();

  return (
    <View style={[
      styles.container,
      isScrolled && styles.scrolledContainer
      ]}>
      <View style={styles.leftContainer}>
        {!isUserVisuallyImpaired && (
          <TouchableOpacity style={styles.modeToggleButton} onPress={onModeToggle}>
            <Image source={accessbilityicon} style={[styles.icon, isScrolled && styles.scrolledIcon]} />
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.titleContainer}>
        <Text accessibilityLabel={title === "AudiSay" ? "오디쎄이 메인 페이지입니다." : title}
              style={[styles.title, isScrolled && styles.scrolledTitle]}>{title}</Text>
      </View>
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
    width: width * 0.15,
    alignItems: 'flex-start',
  },
  rightContainer: {
    width: width * 0.15,
    alignItems: 'flex-end',
  },
  modeToggleButton: {
    padding: width * 0.02,
  },
  icon: {
    width: width * 0.12,
    height: width * 0.12,
    tintColor: 'white',
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  title: {
    color: 'white',
    fontSize: width * 0.09,
    // fontWeight: 'bold',
    fontFamily: 'Bungee-Regular',
    includeFontPadding: false //폰트 기본 패딩 제거
  },
  bookmarkButton: {
    padding: width * 0.02,
  },
  //여기서부터는 스크롤 효과
  scrolledContainer: {
    backgroundColor: '#F5F5F5',
  },
  scrolledTitle: {
    color: '#3943B7',
  },
  scrolledIcon: {
    tintColor: '#3943B7'
  }
});

export default MainHeader;
