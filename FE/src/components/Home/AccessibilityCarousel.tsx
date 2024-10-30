import React, { useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const responsiveFontSize = (factor) => width * (factor / 100);

const dummyData = [
  { id: '1', title: '캐러셀 슬라이드 1' },
  { id: '2', title: '캐러셀 슬라이드 2' },
  { id: '3', title: '캐러셀 슬라이드 3' },
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
            accessibilityLabel={item.title}
            accessibilityHint="이 캐러셀을 스와이프하여 다음 슬라이드를 볼 수 있습니다."
          >
            <Text style={styles.slideTitle}>{item.title}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  carouselContainer: {
    height: 200, // 고정 높이 설정
    marginTop: 20,
  },
  scrollViewContent: {
    alignItems: 'center',
  },
  slide: {
    width: width * 0.8,
    height: '100%',
    marginHorizontal: width * 0.1,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  slideTitle: {
    fontSize: responsiveFontSize(5),
    fontWeight: 'bold',
    color: '#333',
  },
});

export default AccessibilityCarousel;
