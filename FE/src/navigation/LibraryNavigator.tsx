// src/navigation/LibraryNavigator.tsx
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LibraryPage from '../pages/Main/LibraryPage';
import EBookViewerPage from '../pages/Ebook/EBookViewerPage';

export type LibraryStackParamList = {
  LibraryMain: undefined;
  EBookViewer: { bookId: string };
};

const Stack = createStackNavigator<LibraryStackParamList>();

const LibraryNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="LibraryMain" component={LibraryPage} options={{ title: '내 서재' }} />
      <Stack.Screen name="EBookViewer" component={EBookViewerPage} options={{ title: 'E-Book 뷰어' }} />
    </Stack.Navigator>
  );
};

export default LibraryNavigator;
