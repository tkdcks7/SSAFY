import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
  Dimensions,
  TextInput,
} from 'react-native';
import categories from '../../data/categories.json'; // categories.json 파일 불러오기

const { width, height } = Dimensions.get('window');

type PickerItem = {
  category_id: string;
  category_name: string;
  level: string;
};

type CustomPickerProps = {
  isVisible: boolean;
  selectedValue: string;
  onValueChange: (value: string) => void;
  onClose: () => void;
};

const majorCategories = [
  { category_id: '000', category_name: '총류', level: 'MAJOR' },
  { category_id: '100', category_name: '철학', level: 'MAJOR' },
  { category_id: '200', category_name: '종교', level: 'MAJOR' },
  { category_id: '300', category_name: '사회과학', level: 'MAJOR' },
  { category_id: '400', category_name: '자연과학', level: 'MAJOR' },
  { category_id: '500', category_name: '기술과학', level: 'MAJOR' },
  { category_id: '600', category_name: '예술', level: 'MAJOR' },
  { category_id: '700', category_name: '언어(어학)', level: 'MAJOR' },
  { category_id: '800', category_name: '문학', level: 'MAJOR' },
  { category_id: '900', category_name: '역사', level: 'MAJOR' },
];

const CustomPicker: React.FC<CustomPickerProps> = ({
  isVisible,
  selectedValue,
  onValueChange,
  onClose,
}) => {
  const [searchText, setSearchText] = useState('');
  const [filteredCategories, setFilteredCategories] = useState<PickerItem[]>(majorCategories);
  const [currentLevel, setCurrentLevel] = useState<'MAJOR' | 'MIDDLE'>('MAJOR');
  const [parentCategory, setParentCategory] = useState<string | null>(null);
  const [tempSelectedValue, setTempSelectedValue] = useState<string>(selectedValue); // 임시 선택 값

  useEffect(() => {
    if (searchText) {
      const filtered = categories.filter((item) =>
        item.category_name.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredCategories(filtered);
    } else {
      setFilteredCategories(currentLevel === 'MAJOR' ? majorCategories : getMiddleCategories(parentCategory!));
    }
  }, [searchText, currentLevel, parentCategory]);

  const getMiddleCategories = (parentId: string) => {
    return categories.filter(
      (item) => item.category_id.startsWith(parentId.substring(0, 1)) && item.level === 'MIDDLE'
    );
  };

  const handleCategorySelect = (category: PickerItem) => {
    if (category.level === 'MAJOR') {
      setCurrentLevel('MIDDLE');
      setParentCategory(category.category_id);
      setFilteredCategories(getMiddleCategories(category.category_id));
    } else {
      setTempSelectedValue(category.category_id); // 하위 카테고리 임시 선택
    }
  };

  const renderItem = ({ item }: { item: PickerItem }) => {
    const isSelected = item.category_id === tempSelectedValue;

    return (
      <TouchableOpacity
        onPress={() => handleCategorySelect(item)}
        style={[styles.itemContainer, isSelected && styles.selectedItem]}
      >
        <Text style={[styles.itemText, isSelected && styles.selectedItemText]}>
          {currentLevel === 'MAJOR' ? `${item.category_name} (${item.category_id})` : item.category_name}
        </Text>
      </TouchableOpacity>
    );
  };


  return (
    <Modal visible={isVisible} transparent animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.pickerContainer}>
          <Text style={styles.pickerTitle}>카테고리 선택</Text>
          <Text style={styles.pickerDescription}>
           - 국립중앙도서관의 한국십진분류표 기준 -
          </Text>

          {/* 검색 인풋 */}
          <TextInput
            style={styles.searchInput}
            placeholder="카테고리 검색..."
            value={searchText}
            onChangeText={setSearchText}
          />

          <FlatList
            data={filteredCategories}
            keyExtractor={(item) => item.category_id}
            renderItem={renderItem}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
          />

          {currentLevel === 'MIDDLE' && (
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => {
                setCurrentLevel('MAJOR');
                setParentCategory(null);
                setFilteredCategories(majorCategories);
              }}
            >
              <Text style={styles.backButtonText}>뒤로</Text>
            </TouchableOpacity>
          )}

            <TouchableOpacity
              style={[styles.completeButton, !tempSelectedValue && styles.disabledButton]}
              onPress={() => {
                if (tempSelectedValue) {
                  console.log('Selected category_id:', tempSelectedValue); // 로그 추가
                  onValueChange(tempSelectedValue); // category_id 반환
                  onClose();
                }
              }}
              disabled={!tempSelectedValue}
            >
              <Text style={styles.completeButtonText}>선택</Text>
            </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  pickerContainer: {
    width: '90%',
    height: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: height * 0.03,
    alignItems: 'center',
  },
  pickerTitle: {
    fontSize: width * 0.08,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  pickerDescription: {
    fontSize: width * 0.044,
    color: '#555',
    textAlign: 'center',
    marginVertical: height * 0.01,
  },
  searchInput: {
    width: '100%',
    height: height * 0.05,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: height * 0.02,
    fontSize: width * 0.05,
  },
  listContainer: {
    alignItems: 'center',
    paddingBottom: height * 0.02,
  },
  itemContainer: {
    paddingVertical: height * 0.015,
    width: '100%',
    alignItems: 'center',
  },
  itemText: {
    fontSize: width * 0.05,
    color: '#555',
  },
  selectedItem: {
    borderRadius: 8,
    paddingVertical: height * 0.02,
  },
  selectedItemText: {
    fontSize: width * 0.08,
    color: '#3943B7',
    fontWeight: 'bold',
  },
  backButton: {
    marginTop: height * 0.02,
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#3943B7',
    paddingVertical: height * 0.015,
    width: '60%',
    borderRadius: 8,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#3943B7',
    fontSize: width * 0.05,
  },
  completeButton: {
    marginTop: height * 0.02,
    backgroundColor: '#3943B7',
    paddingVertical: height * 0.015,
    width: '80%',
    borderRadius: 8,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#aaa',
  },
  completeButtonText: {
    color: '#FFFFFF',
    fontSize: width * 0.06,
  },
});

export default CustomPicker;
