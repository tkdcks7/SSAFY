import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, Dimensions, TouchableOpacity, AccessibilityInfo } from 'react-native';

const { width } = Dimensions.get('window');

type Book = {
  id: number;
  title: string;
  author: string;
  cover: string;
};

type GeneralBookListProps = {
  books: Book[];
};

const GeneralBookList: React.FC<GeneralBookListProps> = ({ books }) => {
  return (
    <FlatList
      data={books}
      keyExtractor={(item) => item.id.toString()}
      numColumns={3}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={styles.bookItem}
          onPress={() => {
            AccessibilityInfo.announceForAccessibility(`${item.title} 상세보기 페이지로 이동합니다.`);
          }}
          accessibilityLabel={`${item.title} 선택됨`}
          accessibilityHint="상세 정보를 확인하려면 두 번 탭하세요."
        >
          <Image
            source={{ uri: item.cover.startsWith('http') ? item.cover : `file://${item.cover}` }}
            style={styles.bookImage}
            accessibilityLabel={`표지 이미지: ${item.title}`}
          />
          <Text
            style={styles.bookTitle}
            numberOfLines={2}
            ellipsizeMode="tail"
            accessibilityLabel={`제목: ${item.title}`}
          >
            {item.title}
          </Text>
        </TouchableOpacity>
      )}
      contentContainerStyle={styles.flatListContent}
    />
  );
};

const styles = StyleSheet.create({
  flatListContent: {
    paddingHorizontal: width * 0.02,
  },
  bookItem: {
    flexBasis: '30%',
    marginBottom: width * 0.04,
    marginHorizontal: width * 0.02,
    alignItems: 'center',
  },
  bookImage: {
    width: width * 0.3,
    height: width * 0.35,
    resizeMode: 'contain',
    borderRadius: 8,
  },
  bookTitle: {
    marginTop: 5,
    fontSize: 12,
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default GeneralBookList;
