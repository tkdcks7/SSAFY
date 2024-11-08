import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
  Dimensions,
} from 'react-native';

const { width, height } = Dimensions.get('window');

type PickerItem = {
  label: string;
  value: string;
};

type CustomPickerProps = {
  isVisible: boolean;
  selectedValue: string;
  onValueChange: (value: string) => void;
  onClose: () => void;
};

const customPickerData: PickerItem[] = [
  { label: '소설', value: '001' },
  { label: '에세이', value: '002' },
  { label: '자기계발', value: '003' },
  { label: '경제', value: '004' },
  { label: '기타', value: '005' },
];

const CustomPicker: React.FC<CustomPickerProps> = ({
  isVisible,
  selectedValue,
  onValueChange,
  onClose,
}) => {
  const renderItem = ({ item }: { item: PickerItem }) => {
    const isSelected = item.value === selectedValue;

    return (
      <TouchableOpacity
        onPress={() => onValueChange(item.value)}
        style={[styles.itemContainer, isSelected && styles.selectedItem]}
      >
        <Text
          style={[
            styles.itemText,
            isSelected && styles.selectedItemText, // 선택된 항목 스타일 적용
          ]}
        >
          {item.label}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <Modal visible={isVisible} transparent animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.pickerContainer}>
          <Text style={styles.pickerTitle}>카테고리 선택</Text>
          <FlatList
            data={customPickerData}
            keyExtractor={(item) => item.value}
            renderItem={renderItem}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
          />
          <TouchableOpacity style={styles.completeButton} onPress={onClose}>
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
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: height * 0.03,
    alignItems: 'center',
  },
  pickerTitle: {
    fontSize: width * 0.08,
    fontWeight: 'bold',
    marginBottom: height * 0.03,
    textAlign: 'center',
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
    paddingVertical: height * 0.02, // 선택된 항목의 padding 확대
  },
  selectedItemText: {
    fontSize: width * 0.1,
    color: '#3943B7',
    fontWeight: 'bold',
  },
  completeButton: {
    marginTop: height * 0.03,
    backgroundColor: '#3943B7',
    paddingVertical: height * 0.015,
    width: '80%',
    borderRadius: 8,
  },
  completeButtonText: {
    color: '#FFFFFF',
    fontSize: width * 0.06,
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default CustomPicker;
