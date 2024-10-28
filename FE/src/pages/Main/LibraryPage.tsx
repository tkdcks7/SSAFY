// src/pages/LibraryPage.tsx
import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { LibraryStackParamList } from '../../navigation/LibraryNavigator';

type LibraryPageNavigationProp = StackNavigationProp<LibraryStackParamList, 'LibraryMain'>;

type Props = {
  navigation: LibraryPageNavigationProp;
};

const LibraryPage: React.FC<Props> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Library Page</Text>
      <Button
        title="View E-Book"
        onPress={() => navigation.navigate('EBookViewer', { bookId: '123' })}
      />
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

export default LibraryPage;
