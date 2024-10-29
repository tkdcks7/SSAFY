// src/components/MainFooter.tsx
import React from 'react';
import { View, TouchableOpacity, StyleSheet, Image, Text, Dimensions } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator'; // AppNavigator의 RootStackParamList 사용
import libraryIcon from '../assets/icons/library.png';
import searchIcon from '../assets/icons/search.png';
import homeIcon from '../assets/icons/home.png';
import bookIcon from '../assets/icons/book.png';
import profileIcon from '../assets/icons/profile.png';

const { width } = Dimensions.get('window');

const MainFooter: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  return (
    <View style={styles.footerContainer}>
      <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('Library')}>
        <Image source={libraryIcon} style={styles.icon} />
        <Text style={styles.iconText}>내 서재</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('Search')}>
        <Image source={searchIcon} style={styles.icon} />
        <Text style={styles.iconText}>검색</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('Home')}>
        <Image source={homeIcon} style={styles.icon} />
        <Text style={styles.iconText}>홈</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('RegisterBook')}>
        <Image source={bookIcon} style={styles.icon} />
        <Text style={styles.iconText}>도서 등록</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('MyPage')}>
        <Image source={profileIcon} style={styles.icon} />
        <Text style={styles.iconText}>My</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  footerContainer: {
    width: '100%',
    height: 80,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  iconButton: {
    alignItems: 'center',
  },
  icon: {
    width: width * 0.08,
    height: width * 0.08,
  },
  iconText: {
    marginTop: 4,
    fontSize: width * 0.03,
    color: '#333333',
  },
});

export default MainFooter;
