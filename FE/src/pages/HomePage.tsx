import React, { useState, useEffect, useCallback } from 'react';
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
import { getAccessibilityMode, toggleAccessibilityMode } from '../utils/accessibilityMode';
import { useFocusEffect } from '@react-navigation/native'; // 페이지 포커스 감지

const HomePage: React.FC = () => {
  const [isAccessibilityMode, setIsAccessibilityMode] = useState<boolean>(false);

  // 접근성 상태 초기 설정 및 포커스 시 업데이트
  useFocusEffect(
    useCallback(() => {
      const fetchAccessibilityMode = async () => {
        const mode = await getAccessibilityMode();
        setIsAccessibilityMode(mode);
      };
      fetchAccessibilityMode();
    }, [])
  );

  // 접근성 모드 토글 핸들러
  const handleModeToggle = async () => {
    const newMode = await toggleAccessibilityMode(); // 접근성 모드 상태 변경
    setIsAccessibilityMode(newMode);
  };

  return (
    <View style={styles.container}>
      <MainHeader title="AudiSay" onModeToggle={handleModeToggle} />
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
});

export default HomePage;
