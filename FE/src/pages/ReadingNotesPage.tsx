// src/pages/Main/ReadingNotesPage.tsx

import React from 'react';
import { View, Text, StyleSheet, FlatList, Dimensions } from 'react-native';
import { dummyNotes } from '../data/dummyNotes';
import CustomHeader from '../components/CustomHeader';
import MainFooter from '../components/MainFooter';

const { width, height } = Dimensions.get('window');

const ReadingNotesPage = () => {
  return (
    <View style={styles.container}>
      {/* 커스텀 헤더 */}
      <CustomHeader title="독서노트" />

      {/* 독서 노트 리스트 */}
      <FlatList
        data={dummyNotes}
        keyExtractor={(item) => item.noteId.toString()}
        renderItem={({ item }) => (
          <View accessible accessibilityLabel={`노트: ${item.title}`} accessibilityHint={`이 노트는 ${item.createdAt.split(' ')[0]}에 작성되었습니다.`}>
            <View style={styles.noteContainer}>
              <Text
                style={styles.date}
                accessibilityLabel={`작성일: ${item.createdAt.split(' ')[0]}`}
              >
                {item.createdAt.split(' ')[0]}
              </Text>
              <View style={styles.titleProgressContainer}>
                <Text
                  style={styles.title}
                  accessibilityLabel={`제목: ${item.title}`}
                >
                  {item.title}
                </Text>
                <Text
                  style={styles.progressRate}
                  accessibilityLabel={`진행률: ${item.progressRate} 퍼센트`}
                >
                  {item.progressRate}%
                </Text>
              </View>
              <Text
                style={styles.sentence}
                accessibilityLabel={`저장된 문장: ${item.sentence}`}
              >
                {item.sentence}
              </Text>
            </View>
            <View style={styles.separator} />
          </View>
        )}
      />

      {/* 푸터 */}
      <MainFooter />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  noteContainer: {
    paddingVertical: height * 0.02,
    paddingHorizontal: width * 0.05,
    backgroundColor: '#FFFFFF',
  },
  date: {
    fontSize: width * 0.045,
    fontWeight: 'bold',
    marginBottom: height * 0.01,
  },
  titleProgressContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: height * 0.01,
  },
  title: {
    fontSize: width * 0.08,
    fontWeight: 'bold',
  },
  progressRate: {
    fontSize: width * 0.07,
    fontWeight: 'bold',
  },
  sentence: {
    fontSize: width * 0.045,
    fontStyle: 'italic',
  },
  separator: {
    height: 2,
    backgroundColor: '#000000',
    marginVertical: height * 0.01,
  },
});

export default ReadingNotesPage;
