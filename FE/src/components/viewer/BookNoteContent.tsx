// src/components/viewer/BookNoteContent.tsx
import React from 'react';
import {Text, StyleSheet, Dimensions, TouchableOpacity} from 'react-native';
import {IReadNote} from '../../services/ViewerPage/readNotes';

type ProgressProps = {
  item: IReadNote;
  goToLocation: (cfi: string) => void;
  toggleBookNote: () => void;
};

const {width, height} = Dimensions.get('window');

// onPress를 안받았을 시 아무것도 작동 안하는 빈 함수 실행
const BookNoteContent: React.FC<ProgressProps> = ({
  item,
  goToLocation,
  toggleBookNote,
}) => {
  const {title, progressRate, sentence, sentenceId, createdAt} = item;

  return (
    <TouchableOpacity
      style={styles.noteBox}
      onPress={() => {
        toggleBookNote();
        goToLocation(sentenceId);
      }}>
      <Text style={styles.noteTitle}>
        {sentence.length > 30 ? sentence.slice(0, 30) + '...' : sentence}
      </Text>
      <Text style={styles.noteInfo}>
        {progressRate.toFixed(2) + '% / ' + createdAt.slice(0, 10)}
      </Text>
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
