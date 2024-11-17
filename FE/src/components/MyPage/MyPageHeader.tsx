import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import backIcon from '../../assets/icons/back.png';

const { width, height } = Dimensions.get('window');

type MyPageHeaderProps = {
  title: string;
};

const MyPageHeader: React.FC<MyPageHeaderProps> = ({ title }) => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Image source={backIcon} style={styles.icon} resizeMode="contain" />
      </TouchableOpacity>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{title}</Text>
      </View>
      <View style={styles.rightContainer}>
        {/* 여기에 추가 버튼이나 UI 요소를 배치할 수 있음 */}
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
    backgroundColor: '#FFFFFF',
    paddingHorizontal: width * 0.03,
  },
  backButton: {
    padding: width * 0.02,
  },
  icon: {
    width: width * 0.08,
    height: width * 0.08,
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    color: '#000000',
    fontSize: width * 0.1,
    fontWeight: 'bold',
  },
  rightContainer: {
    width: width * 0.15,
    alignItems: 'flex-end',
  },
});

export default MyPageHeader;
