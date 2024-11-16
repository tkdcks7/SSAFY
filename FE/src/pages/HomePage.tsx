// src/pages/HomePage.tsx
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import MainHeader from '../components/MainHeader';
import MainFooter from '../components/MainFooter';
import GeneralCarousel from '../components/Home/GeneralCarousel';
import AccessibilityCarousel from '../components/Home/AccessibilityCarousel';
import AccessibilityBookInfo from '../components/Home/AccessibilityBookInfo';
import RecommendedBooks from '../components/Home/RecommendedBooks';
import MonthlyPopularBooks from '../components/Home/MonthlyPopularBooks';
import AgeGenderPopularBooks from '../components/Home/AgeGenderPopularBooks';
import { handleScrollEndAnnouncement } from '../utils/announceScrollEnd';

const HomePage: React.FC = () => {
  const [isAccessibilityMode, setIsAccessibilityMode] = useState(false);
  const [isUserVisuallyImpaired, setIsUserVisuallyImpaired] = useState(false);

  useEffect(() => {
    const userIsVisuallyImpaired = false; // 실제 유저 정보에서 가져오는 로직을 구현
    setIsUserVisuallyImpaired(userIsVisuallyImpaired);
    setIsAccessibilityMode(userIsVisuallyImpaired); // 시각장애인이라면 접근성 모드를 기본으로 설정
  }, []);

  const handleModeToggle = () => {
    setIsAccessibilityMode((prev) => !prev);
  };

  return (
    <View style={styles.container}>
      <MainHeader
        title="AudiSay"
        isAccessibilityMode={isAccessibilityMode}
        isUserVisuallyImpaired={isUserVisuallyImpaired}
        onModeToggle={handleModeToggle}
      />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        onScroll={handleScrollEndAnnouncement}
        scrollEventThrottle={16} // 스크롤 이벤트 빈도 조절
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
  componentWrapper: {
    marginHorizontal: 20,
    marginVertical: 10
  }
});

export default HomePage;
