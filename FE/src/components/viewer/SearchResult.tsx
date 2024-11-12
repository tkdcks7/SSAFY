/* eslint-disable react/no-array-index-key */
/* eslint-disable @typescript-eslint/no-use-before-define */
import {
    SearchResult as SearchResultType,
  } from '@epubjs-react-native/core';
  import React from 'react';
  import { StyleSheet, TouchableOpacity, View, Text } from 'react-native';
  
  interface Props {
    searchTerm: string;
    searchResult: SearchResultType;
    onPress: (searchResult: SearchResultType) => void;
  }
  
  function SearchResult({ searchTerm, searchResult, onPress }: Props) {
  
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    const parts = searchResult.excerpt.split(regex);
    return (
      <TouchableOpacity
        key={searchResult.cfi}
        style={styles.container}
        onPress={() => onPress(searchResult)}
      >
        <View style={styles.icon}>
        </View>
  
        <View style={styles.info}>
          <Text
          >
            Chapter: {searchResult.section?.label}
          </Text>
  
          <View>
            <Text
              style={{
                ...styles.excerpt,
              }}
              onPress={() => {
                onPress(searchResult);
              }}
            >
              &quot;
              {parts.filter(String).map((part, index) => {
                return regex.test(part) ? (
                  <Text style={styles.highlight} key={`${index}-part-highlight`}>
                    {part}
                  </Text>
                ) : (
                  <Text
                    key={`${index}-part`}
                  >
                    {part}
                  </Text>
                );
              })}
              &quot;
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginVertical: 10,
    },
    icon: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    info: {
      width: '85%',
    },
    chapter: { marginBottom: 2 },
    excerpt: { fontStyle: 'italic' },
    highlight: { backgroundColor: 'yellow' },
  });
  
  export default SearchResult;