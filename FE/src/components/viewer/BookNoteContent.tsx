// src/components/viewer/BookNoteContent.tsx
import React from 'react';
import { Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';

type ProgressProps = {
    title: string;
    progress: number;
    date: string;
    onPress?: () => void;
  }

const { width,height } = Dimensions.get('window');

// onPress를 안받았을 시 아무것도 작동 안하는 빈 함수 실행
const BookNoteContent: React.FC<ProgressProps> = ({ title, progress, date, onPress }) => {
return (
    <TouchableOpacity style={styles.noteBox} onPress={onPress || (() => {})}>
        <Text style={styles.noteTitle}>{title}</Text>
        <Text style={styles.noteInfo}>{progress + '% / ' + date.slice(10) }</Text>
    </TouchableOpacity>
);
};

export default BookNoteContent;

const styles = StyleSheet.create({
    noteBox: {
        width: '100%',
        height: height * 0.12,
        borderBottomWidth: 2,
        justifyContent: 'center',
        paddingHorizontal: 20,
    },
    noteTitle: {
        fontWeight: 'bold',
        fontSize: width * 0.05,
    },
    noteInfo: {
        fontSize: width * 0.03,
    },
  });