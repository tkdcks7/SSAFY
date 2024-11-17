// src/components/viewer/NumberPicker.tsx
import React, {useRef, useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';

type NumberPickerProps<T> = {
  selectedValue: T;
  arrData: T[];
  onValueChange: (value: T) => void;
};

const NumberPicker = <T extends number | string>({
  selectedValue,
  arrData,
  onValueChange,
}: NumberPickerProps<T>) => {
  const flatListRef = useRef<FlatList<T>>(null);
  const ITEM_HEIGHT = 150;
  const [isUserScrolling, setIsUserScrolling] = useState(false);

  useEffect(() => {
    if (!isUserScrolling) {
      // selectedValue가 변경될 때마다 해당 위치로 스크롤
      const index: number = arrData.indexOf(selectedValue);
      if (flatListRef.current && index !== -1) {
        flatListRef.current.scrollToOffset({
          offset: index * ITEM_HEIGHT,
          animated: true,
        });
      }
    }
  }, [selectedValue, isUserScrolling]);

  const handleScroll = (event: any) => {
    if (!isUserScrolling) {
      const offsetY = event.nativeEvent.contentOffset.y;
      const index = Math.round(offsetY / ITEM_HEIGHT);
      if (
        index >= 0 &&
        index < arrData.length &&
        arrData[index] !== selectedValue
      ) {
        onValueChange(arrData[index]);
      }
    }
  };

  const handlePress = (item: T) => {
    setIsUserScrolling(true); // 터치 시 스크롤 무시
    onValueChange(item);
    const index: number = arrData.indexOf(item);
    if (flatListRef.current && index !== -1) {
      flatListRef.current.scrollToOffset({
        offset: index * ITEM_HEIGHT,
        animated: true,
      });
    }
    setTimeout(() => setIsUserScrolling(false), 300); // 약간의 지연 후 스크롤 이벤트 다시 활성화
  };

  return (
    <FlatList
      ref={flatListRef}
      data={arrData}
      keyExtractor={item => item.toString()}
      renderItem={({item}) => (
        <TouchableOpacity
          onPress={() => handlePress(item)}
          style={[styles.item, item === selectedValue && styles.selectedItem]}>
          <Text
            style={[
              styles.itemText,
              item === selectedValue && styles.itemSelectedText,
            ]}>
            {item}
          </Text>
        </TouchableOpacity>
      )}
      getItemLayout={(_, index) => ({
        length: ITEM_HEIGHT,
        offset: ITEM_HEIGHT * index,
        index,
      })}
      showsVerticalScrollIndicator={false}
      snapToOffsets={arrData.map((_, i) => i * ITEM_HEIGHT)}
      decelerationRate="fast"
      onScroll={handleScroll}
      contentContainerStyle={{
        paddingVertical: (Dimensions.get('window').height - ITEM_HEIGHT) / 2,
      }}
      style={{width: '80%'}}
    />
  );
};

const styles = StyleSheet.create({
  item: {
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#DDD',
  },
  itemSelectedText: {
    fontSize: 64,
    fontWeight: 'bold',
    color: '#3943B7',
  },
  selectedItem: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#DDD',
    borderRadius: 5,
  },
});

export default NumberPicker;
