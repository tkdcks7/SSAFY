
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const SearchPage: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>검색 페이지</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default SearchPage;
