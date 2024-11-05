// src/components/CustomHeader.tsx

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

type CustomHeaderProps = {
  title: string;
};

const CustomHeader: React.FC<CustomHeaderProps> = ({ title }) => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
        accessibilityLabel="뒤로가기 버튼"
        accessibilityHint="이전 화면으로 돌아갑니다."
      >
        <Image
          source={require('../assets/icons/back.png')}
          style={styles.icon}
          accessible
          accessibilityLabel="뒤로가기 아이콘"
        />
      </TouchableOpacity>
      <Text
        style={styles.title}
        accessible
        accessibilityLabel={`현재 페이지 제목: ${title}`}
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
});

export default CustomHeader;
