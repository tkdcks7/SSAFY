import React from 'react';
import { View, FlatList, StyleSheet, Dimensions, Image, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';
import { StackNavigationProp } from '@react-navigation/stack';

const { width, height } = Dimensions.get('window');

// 유틸리티 함수로 크기를 상대적으로 계산
const responsiveWidth = (factor: number) => width * (factor / 100);
const responsiveHeight = (factor: number) => height * (factor / 100);
const responsiveFontSize = (factor: number) => width * (factor / 100);

interface CarouselProps {
  items: { bookId: string; cover: any; title: string }[];
}

const Carousel: React.FC<CarouselProps> = ({ items }) => {
  // BookDetail로 이동하기 위해 navigation 사용
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  return (
    <FlatList
      horizontal
      data={items}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={styles.itemContainer}
          onPress={() => navigation.navigate('BookDetail', { bookId: item.bookId })}
        >
          <Image source={item.cover} style={styles.carouselImage} />
          <Text style={styles.carouselTitle}>{item.title}</Text>
        </TouchableOpacity>
      )}
      keyExtractor={(item) => item.bookId}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scrollViewContent}
      nestedScrollEnabled={true}
    />
  );
};

const styles = StyleSheet.create({
  scrollViewContent: {
    paddingHorizontal: responsiveWidth(2.5),
    alignItems: 'center',
  },
  itemContainer: {
    width: responsiveWidth(42),
    marginRight: responsiveWidth(3),
    marginBottom: responsiveHeight(1),
    alignItems: 'center',
  },
  carouselImage: {
    width: responsiveWidth(30),
    height: responsiveHeight(20),
    resizeMode: 'cover',
    marginBottom: responsiveHeight(1),
  },
  carouselTitle: {
    textAlign: 'center',
    fontSize: responsiveFontSize(6),
    fontWeight: 'bold',
  },
});

export default Carousel;
