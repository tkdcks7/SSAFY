import React, { useRef, useState } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Dimensions,
  Image,
  Text,
  TouchableOpacity,
  AccessibilityInfo,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';
import { StackNavigationProp } from '@react-navigation/stack';
import LeftArrow from '../assets/icons/leftarrow.png';
import RightArrow from '../assets/icons/rightarrow.png';

const { width, height } = Dimensions.get('window');

const responsiveWidth = (factor: number) => width * (factor / 100);
const responsiveHeight = (factor: number) => height * (factor / 100);
const responsiveFontSize = (factor: number) => width * (factor / 100);

interface CarouselProps {
  items: { bookId: string; cover: string; title: string }[];
}

const Carousel: React.FC<CarouselProps> = ({ items }) => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const flatListRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const ITEM_WIDTH = responsiveWidth(42); // 아이템의 너비 + 여백

  const scrollToIndex = (direction: 'left' | 'right') => {
    let newIndex = currentIndex;
    if (direction === 'left' && currentIndex > 0) {
      newIndex -= 1;
    } else if (direction === 'right' && currentIndex < items.length - 1) {
      newIndex += 1;
    }

    setCurrentIndex(newIndex);
    flatListRef.current?.scrollToOffset({
      offset: newIndex * ITEM_WIDTH,
      animated: true,
    });

    // 현재 인덱스 아나운스
    AccessibilityInfo.announceForAccessibility(`현재 위치: ${newIndex + 1} / ${items.length}`);
  };

  return (
    <View style={styles.carouselContainer}>
      <TouchableOpacity
        onPress={() => scrollToIndex('left')}
        style={styles.arrowButton}
        accessibilityLabel="이전 책 보기"
        accessibilityHint={`현재 위치: ${currentIndex + 1} / ${items.length}`}
        disabled={currentIndex === 0}
      >
        <Image source={LeftArrow} style={styles.arrowIcon} />
      </TouchableOpacity>

      <FlatList
        ref={flatListRef}
        horizontal
        data={items}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            style={styles.itemContainer}
            onPress={() => navigation.navigate('BookDetail', { bookId: item.bookId })}
            accessibilityLabel={`책 제목: ${item.title}`}
            accessibilityHint="자세한 정보를 보려면 두 번 탭하세요."
            accessible={index === currentIndex} // 현재 포커스된 아이템만 접근 가능하도록 설정
          >
            <Image source={{ uri: item.cover }} style={styles.carouselImage} />
            <Text style={styles.carouselTitle} numberOfLines={1} ellipsizeMode='tail'>{item.title}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.bookId}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContent}
        nestedScrollEnabled={true}
      />

      <TouchableOpacity
        onPress={() => scrollToIndex('right')}
        style={styles.arrowButton}
        accessibilityLabel="다음 책 보기"
        accessibilityHint={`현재 위치: ${currentIndex + 1} / ${items.length}`}
        disabled={currentIndex === items.length - 1}
      >
        <Image source={RightArrow} style={styles.arrowIcon} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  carouselContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: responsiveHeight(2),
  },
  scrollViewContent: {
    paddingHorizontal: responsiveWidth(2.5),
    alignItems: 'center',
  },
  itemContainer: {
    width: responsiveWidth(42),
    marginRight: responsiveWidth(3),
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
    fontSize: responsiveFontSize(4),
    fontWeight: 'bold',
  },
  arrowButton: {
    width: responsiveWidth(10),
    height: responsiveHeight(10),
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowIcon: {
    width: responsiveWidth(8),
    height: responsiveHeight(8),
    resizeMode: 'contain',
  },
});

export default Carousel;
