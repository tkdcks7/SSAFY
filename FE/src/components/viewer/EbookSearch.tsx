// src/components/viewer/EbookSearch.tsx
import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions, ScrollView, TextInput } from 'react-native';
import InputBox from '../../components/InputBox';


// 아이콘
import leftarrowicon from '../../assets/icons/leftarrow.png';
import searchicon from '../../assets/icons/search.png';


const { width, height } = Dimensions.get('window');

type SearchResult = {
    sentence: string;
    progress: number;
}

const exampleSearchResult: SearchResult[] = [
    { sentence:'예시문장 1', progress: 0.15 },
    { sentence:'예시문장 2', progress: 0.25 },
    { sentence:'예시문장 3', progress: 0.37 },
]

const EbookSearch: React.FC = () => {
  const [ searchInput, setSearchInput ] = useState<string>('');
  const searchInputRef = useRef<TextInput>(null);

  const handleSearchTexttChange = (input: string) => {
    setSearchInput(input);
  };

  const focusSearchInput = () => {
    searchInputRef.current?.focus();
  };

  return (
    <View style={{ width: '100%', height: '100%', zIndex: 12, backgroundColor:'red' }}>
        <View style={styles.navBar}>
        <TouchableOpacity>
            <Image source={leftarrowicon} style={styles.icon} />
        </TouchableOpacity>
            <InputBox
            value={searchInput}
            onChangeText={handleSearchTexttChange}
            placeholder='검색어를 입력하세요'
            ref={searchInputRef}
            style={{ width: '60%' }}
            />
        <TouchableOpacity>
            <Image source={searchicon} style={styles.icon} />
        </TouchableOpacity>
        </View>
        <ScrollView style={{marginTop: height * 0.1}}>
            <Text>검색결과 2건</Text>
            { exampleSearchResult.map((value) => {
                return (
                    <View>
                        <Text>{value.sentence}</Text>
                        <Text>{value.progress * 100}%</Text>
                    </View>
                )
            }) }
        </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
    navBar: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: height * 0.1, // 상대적인 높이 (화면 높이의 10%)
      backgroundColor: '#3943B7',
      justifyContent: 'space-between',
      alignItems: 'center',
      zIndex: 12,
      flexDirection: 'row',
      paddingHorizontal: width * 0.03,
    },
    icon: {
      width: width * 0.1, // 화면 너비의 10%
      height: width * 0.1, // 화면 너비의 10% (정사각형)
      tintColor: 'white',
    },
  });

export default EbookSearch;