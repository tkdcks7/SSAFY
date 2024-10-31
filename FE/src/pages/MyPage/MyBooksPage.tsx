// src/pages/MyBooksPage.tsx
import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, ScrollView } from 'react-native';
import MyPageHeader from '../../components/MyPage/MyPageHeader';
import MainFooter from '../../components/MainFooter';
import { handleScrollEndAnnouncement } from '../../utils/announceScrollEnd';
import MyBooksTab from '../../components/MyPage/MyBooksTab';

const MyBooksPage: React.FC = () => {
  const [isAccessibilityMode, setIsAccessibilityMode] = useState(false);
  const [isUserVisuallyImpaired, setIsUserVisuallyImpaired] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'출판도서' | '등록도서'>('출판도서');

  useEffect(() => {
    const userIsVisuallyImpaired = false; // 실제 유저 정보에서 가져오는 로직을 구현
    setIsUserVisuallyImpaired(userIsVisuallyImpaired);
    setIsAccessibilityMode(userIsVisuallyImpaired); // 시각장애인이라면 접근성 모드를 기본으로 설정
  }, []);

  const handleModeToggle = () => {
    setIsAccessibilityMode((prev) => !prev);
  };

  const handleTabChange = (tab: '출판도서' | '등록도서') => {
    setSelectedTab(tab);
  };

  return (
    <View style={styles.container}>
      <MyPageHeader
        title="담은 도서"
        isUserVisuallyImpaired={isUserVisuallyImpaired}
        onModeToggle={handleModeToggle}
      />
      <MyBooksTab onMenuPress={() => {}} onTabClick={handleTabChange} onSearch={() => {}} />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        onScroll={handleScrollEndAnnouncement}
        scrollEventThrottle={16} // 스크롤 이벤트 빈도 조절
      >
        <View style={styles.innerContainer}>
          {/* 여기에 출판도서 또는 등록도서 목록을 렌더링하는 컴포넌트를 추가할 예정 */}
          <Text>{selectedTab} 목록을 여기에 표시합니다.</Text>
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
    paddingHorizontal: 20,
  },
});

export default MyBooksPage;
