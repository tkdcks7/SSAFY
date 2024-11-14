// src/components/Home/GeneralCarousel.tsx
import React, {useRef} from 'react';
import {
  View,
  // Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  Image,
} from 'react-native';

const {width} = Dimensions.get('window');

const dummyData = [
  {
    id: '8702',
    // title: '슬라이드 1',
    image: require('../../assets/images/books/carousel/carousel_sea_dict.png'),
  },
  {
    id: '9435',
    // title: '슬라이드 2',
    image: require('../../assets/images/books/carousel/carousel_economy.png'),
  },
  {
    id: '5782',
    // title: '슬라이드 3',
    image: require('../../assets/images/books/carousel/carousel_kimchi.png'),
  },
];

const GeneralCarousel: React.FC = () => {
  const scrollViewRef = useRef<ScrollView>(null);

  return (
    <View style={styles.carouselContainer}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContent}>
        {dummyData.map(item => (
          <View key={item.id} style={styles.slide}>
            <Image source={item.image} style={styles.slideImage} />
            {/* <Text style={styles.slideTitle}>{item.title}</Text> */}
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  carouselContainer: {
    height: 270,
    marginTop: 20,
  },
  scrollViewContent: {
    alignItems: 'center',
  },
  slide: {
    width: width * 0.9,
    height: '100%',
    // marginHorizontal: width * 0.1,
    marginHorizontal: 20,
    backgroundColor: '#e3f2fd',
    borderRadius: 10,
    // padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  // slideTitle: {
  //   fontSize: 20,
  //   color: '#0d47a1',
  // },
  slideImage: {
    width: '100%',
    height: '100%', // 이미지 높이 설정
    borderRadius: 10,
  },
});

export default GeneralCarousel;
