// src/pages/EBookViewerPage.tsx
import React from 'react';
import { View, Text, StyleSheet, SafeAreaView  } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { LibraryStackParamList } from '../../navigation/LibraryNavigator';
import { Reader } from '@epubjs-react-native/core';
import { useFileSystem } from '@epubjs-react-native/file-system';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

// 이런 선언을 안하면 gesture가 인식을 못한다고 무한 warning을 띄우며 인식이 ebook viewer가 뜨지 않음.
const gesture = Gesture.Tap()
  .onStart((event) => {
    'worklet';
    console.log("Gesture started", event);
  })
  .onEnd(() => {
    'worklet';
    // 작업 수행
  });


type EBookViewerPageRouteProp = RouteProp<LibraryStackParamList, 'EBookViewer'>;

type Props = {
  route: EBookViewerPageRouteProp;
};


// src에 Ebook의 주소를 넣어줘야하는데, local 파일의 경우 따로 로직 처리를 해서 주소를 넣어줘야함.
const EBookViewerPage: React.FC<Props> = ({ route }) => {
  const { bookId } = route.params;
  return (
    <SafeAreaView style={{ flex: 1 }}>
  <Reader
    src="https://s3.amazonaws.com/moby-dick/OPS/package.opf"
    fileSystem={useFileSystem}
  />
</SafeAreaView>
  );
};

export default EBookViewerPage;
