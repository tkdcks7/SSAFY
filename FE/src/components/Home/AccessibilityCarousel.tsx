import React, { useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, Image } from 'react-native';

const { width } = Dimensions.get('window');

const responsiveFontSize = (factor: number) => width * (factor / 100);

const dummyData = [
  // { id: '1', title: '캐러셀 슬라이드 1' },
  // { id: '2', title: '캐러셀 슬라이드 2' },
  // { id: '3', title: '캐러셀 슬라이드 3' },
  {
    id: '8702',
    title: '(정말정말) 신기한 바다생물 백과사전',
    image: require('../../assets/images/books/carousel/carousel_sea_dict.png'),
  },
  {
    id: '9435',
    title: '경제기사 궁금증 300문 300답 :어려운 경제 쉽게 읽는 법',
    image: require('../../assets/images/books/carousel/carousel_economy.png'),
  },
  {
    id: '5782',
    title: '김치 특공대',
    image: require('../../assets/images/books/carousel/carousel_kimchi.png'),
  },
];

const AccessibilityCarousel: React.FC = () => {
  const scrollViewRef = useRef<ScrollView>(null);

  return (
    <View style={styles.carouselContainer}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContent}
      >
        {dummyData.map((item) => (
          <View
            key={item.id}
            style={styles.slide}
            accessible={true}
            // accessibilityLabel={item.title}
            accessibilityLabel={`${item.title}`}
            accessibilityHint="이 캐러셀을 스와이프하여 다음 슬라이드를 볼 수 있습니다."
          >
              <Image
              source={item.image}
              style={styles.slideImage}
              accessibilityLabel={item.title}
              accessibilityHint="이 이미지는 도서 표지입니다."
            />
            {/* <Text style={styles.slideTitle}>{item.title}</Text> */}
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  carouselContainer: {
    height: 270, // 고정 높이 설정
    marginTop: 20,
  },
  scrollViewContent: {
    alignItems: 'center',
  }, 
  slide: {
    width: width * 0.95,
    height: '100%',
    // marginHorizontal: width * 0.1,
    marginHorizontal: 10,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    // padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  // slideTitle: {
  //   fontSize: responsiveFontSize(5),
  //   fontWeight: 'bold',
  //   color: '#333',
  // },
  slideImage: {
    width: '100%',
    height: '100%', // 이미지 높이 설정
    borderRadius: 10,
  },
});

export default AccessibilityCarousel;
