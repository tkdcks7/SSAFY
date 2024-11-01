// src/components/viewer/IndexChapter.tsx
import React from 'react';
import { Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';

type ProgressProps = {
    chapter: string;
    onPress?: () => void;
  }

const { width,height } = Dimensions.get('window');

// onPress를 안받았을 시 아무것도 작동 안하는 빈 함수 실행
const IndexChapter: React.FC<ProgressProps> = ({ chapter, onPress }) => {
return (
    <TouchableOpacity style={styles.chapterBox} onPress={onPress || (() => {})}>
        <Text style={styles.bookTitle}>·    {chapter}</Text>
    </TouchableOpacity>
);
};

export default IndexChapter;

const styles = StyleSheet.create({
    chapterBox: {
        width: '100%',
        height: height * 0.12,
        borderBottomWidth: 2,
        justifyContent: 'center',
        paddingHorizontal: 20,
    },
    bookTitle: {
        fontWeight: 'bold',
        fontSize: width * 0.1, // 상대적인 글꼴 크기
    }
  });