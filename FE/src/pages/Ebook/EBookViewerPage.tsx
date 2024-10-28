// src/pages/EBookViewerPage.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { LibraryStackParamList } from '../../navigation/LibraryNavigator';

type EBookViewerPageRouteProp = RouteProp<LibraryStackParamList, 'EBookViewer'>;

type Props = {
  route: EBookViewerPageRouteProp;
};

const EBookViewerPage: React.FC<Props> = ({ route }) => {
  const { bookId } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>E-Book Viewer</Text>
      <Text>Viewing Book ID: {bookId}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default EBookViewerPage;
