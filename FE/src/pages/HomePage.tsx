// src/pages/HomePage.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import MainHeader from '../components/MainHeader';
import MainFooter from '../components/MainFooter';

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
      <ScrollView contentContainerStyle={styles.content}>
        {isAccessibilityMode ? (
          <View style={styles.accessibilityContent}>
            <Text style={styles.accessibilityText}>접근성 모드에서 제공되는 콘텐츠</Text>
          </View>
        ) : (
          <View style={styles.normalContent}>
            <Text>일반 모드 콘텐츠</Text>
          </View>
        )}
      </ScrollView>
      <MainFooter />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingBottom: 100,
  },
  normalContent: {
    padding: 20,
  },
  accessibilityContent: {
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
  accessibilityText: {
    fontSize: 24,
  },
});

export default HomePage;
