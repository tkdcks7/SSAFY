import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

type CustomHeaderProps = {
  title: string;
  isScrolled?: boolean; // 스크롤 상태를 받는 prop 추가
};

const CustomHeader: React.FC<CustomHeaderProps> = ({ title, isScrolled = false }) => {
  const navigation = useNavigation();

  return (
    <View style={[styles.container, isScrolled && styles.scrolledContainer]}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
        accessibilityLabel="뒤로가기 버튼"
        accessibilityHint="이전 화면으로 돌아갑니다."
      >
        <Image
          source={require('../assets/icons/back.png')}
          style={[styles.icon, isScrolled && styles.scrolledIcon]} // 스크롤 상태에 따라 아이콘 스타일 변경
          accessible
          accessibilityLabel="뒤로가기 아이콘"
        />
      </TouchableOpacity>
      <Text
        style={[styles.title, isScrolled && styles.scrolledTitle]} // 스크롤 상태에 따라 제목 스타일 변경
        accessible
        accessibilityLabel={`${title}`}
      >
        {title}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: height * 0.1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3943B7',
    paddingHorizontal: width * 0.03,
  },
  backButton: {
    position: 'absolute',
    left: width * 0.03,
  },
  icon: {
    width: width * 0.08,
    height: width * 0.08,
    tintColor: 'white',
  },
  title: {
    color: 'white',
    fontSize: width * 0.1,
    fontWeight: 'bold',
  },
  // 스크롤 상태일 때 스타일
  scrolledContainer: {
    backgroundColor: '#F5F5F5',
  },
  scrolledIcon: {
    tintColor: '#3943B7',
  },
  scrolledTitle: {
    color: '#3943B7',
  },
});

export default CustomHeader;
