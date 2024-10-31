// src/pages/MyBooksPage.tsx
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import MyPageHeader from '../../components/MyPage/MyPageHeader';
import MainFooter from '../../components/MainFooter';
import { handleScrollEndAnnouncement } from '../../utils/announceScrollEnd';
import accessbilityicon from '../../assets/icons/accessbility.png';

const MyBooksPage: React.FC = () => {
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
      <MyPageHeader
        title="좋아요한 도서"
        isUserVisuallyImpaired={isUserVisuallyImpaired}
        onModeToggle={handleModeToggle}
      />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        onScroll={handleScrollEndAnnouncement}
        scrollEventThrottle={16} // 스크롤 이벤트 빈도 조절
      >
        <View style={styles.innerContainer}>
          {/* BookList component will be added here in the future */}
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
  accessibilityButton: {
    padding: 10,
  },
  accessibilityIcon: {
    width: 24,
    height: 24,
    tintColor: 'black', // 흰색 배경에서도 잘 보이도록 색상을 검정으로 설정
  },
});

export default MyBooksPage;
