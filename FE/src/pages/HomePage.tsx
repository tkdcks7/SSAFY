import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, ScrollView, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import MainHeader from '../components/MainHeader';
import MainFooter from '../components/MainFooter';
import GeneralCarousel from '../components/Home/GeneralCarousel';
import AccessibilityCarousel from '../components/Home/AccessibilityCarousel';
import AccessibilityBookInfo from '../components/Home/AccessibilityBookInfo';
import RecommendedBooks from '../components/Home/RecommendedBooks';
import MonthlyPopularBooks from '../components/Home/MonthlyPopularBooks';
import AgeGenderPopularBooks from '../components/Home/AgeGenderPopularBooks';
import { handleScrollEndAnnouncement } from '../utils/announceScrollEnd';
import { getAccessibilityMode } from '../utils/accessibilityMode';
import { useFocusEffect } from '@react-navigation/native'; // 페이지 포커스 감지

const HomePage: React.FC = () => {
  const [isAccessibilityMode, setIsAccessibilityMode] = useState<boolean>(false);
  const [scrollPosition, setScrollPosition] = useState<number>(0); // 스크롤 위치 상태 추가

  // 페이지 포커스 시 접근성 모드 상태 업데이트
  useFocusEffect(
    useCallback(() => {
      const fetchAccessibilityMode = async () => {
        const mode = await getAccessibilityMode();
        setIsAccessibilityMode(mode);
      };
      fetchAccessibilityMode();
    }, [])
  );

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const currentPosition = event.nativeEvent.contentOffset.y;
    setScrollPosition(currentPosition); // 스크롤 위치 업데이트
    handleScrollEndAnnouncement(event); // 기존 스크롤 끝 처리 함수 호출
  };

  return (
    <View style={styles.container}>
      <MainHeader
        title="AudiSay"
        isScrolled={scrollPosition > 0} // 스크롤 위치에 따라 스타일 변경
      />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        onScroll={handleScroll} // 스크롤 이벤트 핸들러 연결
        scrollEventThrottle={16}
      >
        <View style={styles.innerContainer}>
          {isAccessibilityMode ? (
            <>
              <AccessibilityCarousel />
              <AccessibilityBookInfo />
            </>
          ) : (
            <>
              <GeneralCarousel />
              <RecommendedBooks />
              <MonthlyPopularBooks />
              <AgeGenderPopularBooks />
            </>
          )}
        </View>
      </ScrollView>
      <MainFooter />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 100,
  },
  innerContainer: {
    flex: 1,
  },
});

export default HomePage;
