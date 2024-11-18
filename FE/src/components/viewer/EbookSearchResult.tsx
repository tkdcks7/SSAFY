import React from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';

const {width} = Dimensions.get('window');

interface EbookSearchResultProps {
  result: {
    excerpt: string;
    cfi: string;
    section?: {label?: string};
  };
  searchTerm: string;
  onLocationSelect: (cfi: string) => void;
  onClose: () => void;
}

// 하이라이트 텍스트 함수
const highlightText = (text: string, searchTerm: string): React.ReactNode => {
  const trimmedSearchTerm = searchTerm.trim();
  if (!trimmedSearchTerm) {
    return <Text style={styles.resultText}>{text}</Text>;
  }

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

// EbookSearchResult 컴포넌트
const EbookSearchResult: React.FC<EbookSearchResultProps> = ({
  result,
  searchTerm,
  onLocationSelect,
  onClose,
}) => (
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
    </View>
  </TouchableOpacity>
);

export default EbookSearchResult;

const styles = StyleSheet.create({
  resultItem: {
    backgroundColor: '#3943b7',
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
