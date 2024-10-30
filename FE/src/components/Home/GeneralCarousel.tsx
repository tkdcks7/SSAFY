// src/components/Home/GeneralCarousel.tsx
import React, { useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const dummyData = [
  { id: '1', title: '슬라이드 1' },
  { id: '2', title: '슬라이드 2' },
  { id: '3', title: '슬라이드 3' },
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
        contentContainerStyle={styles.scrollViewContent}
      >
        {dummyData.map((item) => (
          <View key={item.id} style={styles.slide}>
            <Text style={styles.slideTitle}>{item.title}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  carouselContainer: {
    height: 150,
    marginTop: 20,
  },
  scrollViewContent: {
    alignItems: 'center',
  },
  slide: {
    width: width * 0.8,
    height: '100%',
    marginHorizontal: width * 0.1,
    backgroundColor: '#e3f2fd',
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
    fontSize: 20,
    color: '#0d47a1',
  },
});

export default GeneralCarousel;
