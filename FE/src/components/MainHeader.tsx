import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Dimensions } from 'react-native';
import accessbilityicon from '../assets/icons/accessbility.png';
import notesicon from '../assets/icons/notes.png';

const { width, height } = Dimensions.get('window');

type MainHeaderProps = {
  title: string;
  isAccessibilityMode: boolean;
  isUserVisuallyImpaired: boolean;
  onModeToggle?: () => void; // 모드 전환 함수
};

const MainHeader: React.FC<MainHeaderProps> = ({ title, isAccessibilityMode, isUserVisuallyImpaired, onModeToggle }) => {
  return (
    <View style={styles.container}>
      {!isUserVisuallyImpaired && (
        <TouchableOpacity style={styles.modeToggleButton} onPress={onModeToggle}>
          <Image source={accessbilityicon} style={styles.icon} />
        </TouchableOpacity>
      )}
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{title}</Text>
      </View>
      <TouchableOpacity style={styles.bookmarkButton}>
        <Image source={notesicon} style={styles.icon} />
      </TouchableOpacity>
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
  },
  title: {
    color: 'white',
    fontSize: width * 0.1,
    fontWeight: 'bold',
  },
  bookmarkButton: {
    padding: width * 0.02,
  },
});

export default MainHeader;
