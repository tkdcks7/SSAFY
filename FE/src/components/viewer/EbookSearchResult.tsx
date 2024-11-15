import React from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';

const {width, height} = Dimensions.get('window');

const highlightText = (text: string, searchTerm: string) => {
  // searchTerm의 앞뒤 공백 제거
  const trimmedSearchTerm = searchTerm.trim();
  if (!trimmedSearchTerm) return <Text style={styles.resultText}>{text}</Text>;

  const regex = new RegExp(`(${trimmedSearchTerm})`, 'gi');
  const parts = text.split(regex);

  return (
    <Text style={styles.resultText}>
      {parts.map((part, index) =>
        regex.test(part) ? (
          <Text key={index} style={styles.highlight}>
            {part}
          </Text>
        ) : (
          part
        ),
      )}
    </Text>
  );
};

const EbookSearchResult = ({result, searchTerm, onLocationSelect, onClose}) => (
  <TouchableOpacity
    onPress={() => {
      onLocationSelect(result.cfi);
      onClose();
    }}>
    <View style={styles.resultItem}>
      {highlightText(result.excerpt, searchTerm)}
      <View style={styles.divider} />
      <Text style={styles.chapterText}>
        {result.section?.label ? result.section.label.trim() : ''}
      </Text>
      <Text>{result.cfi}</Text>
    </View>
  </TouchableOpacity>
);

export default EbookSearchResult;

const styles = StyleSheet.create({
  resultItem: {
    backgroundColor: '#007AFF',
    borderRadius: 10,
    padding: width * 0.04,
    marginBottom: width * 0.02,
  },
  resultText: {
    color: 'white',
    fontSize: width * 0.08,
    marginBottom: width * 0.01,
  },
  highlight: {
    color: 'black',
    backgroundColor: 'yellow', // 하이라이트 색상
    fontWeight: 'bold', // 굵게 표시
  },
  divider: {
    borderBottomColor: 'white',
    borderBottomWidth: 1,
    marginVertical: 5,
  },
  chapterText: {
    color: 'white',
    fontSize: width * 0.06,
    fontWeight: 'bold',
    textAlign: 'center',
    padding: width * 0.02,
  },
});
