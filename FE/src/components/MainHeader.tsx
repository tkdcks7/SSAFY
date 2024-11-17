import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import notesicon from '../assets/icons/notes.png';

const { width, height } = Dimensions.get('window');

type MainHeaderProps = {
  title: string;
};

type NavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

const MainHeader: React.FC<MainHeaderProps> = ({ title }) => {
  const navigation = useNavigation<NavigationProp>();

  return (
    <View style={styles.container}>
      {/* Left Placeholder */}
      <View style={styles.leftContainer} />

      {/* Title */}
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{title}</Text>
      </View>

      {/* Right (Reading Notes) */}
      <View style={styles.rightContainer}>
        <TouchableOpacity style={styles.bookmarkButton} onPress={() => navigation.navigate('ReadingNotes')}>
          <Image source={notesicon} style={styles.icon} />
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
    fontSize: width * 0.1,
    fontWeight: 'bold',
  },
  rightContainer: {
    width: width * 0.15,
    alignItems: 'flex-end',
  },
  icon: {
    width: width * 0.12,
    height: width * 0.12,
    tintColor: 'white',
  },
  bookmarkButton: {
    padding: width * 0.02,
  },
});

export default MainHeader;
