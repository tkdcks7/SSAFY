import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  ScrollView,
} from 'react-native';
import DownloadIcon from '../../assets/icons/download.png';
import DictionaryIcon from '../../assets/icons/dictionary.png';
import CategoryIcon from '../../assets/icons/category.png';

const { width, height } = Dimensions.get('window');

interface SidebarProps {
  onClose: () => void;
  onFilterSelect: (filter: '다운로드 순' | '사전 순' | '카테고리 순' | string) => void;
  selectedFilter: string;
  categories: string[];
}

const Sidebar: React.FC<SidebarProps> = ({ onClose, onFilterSelect, selectedFilter, categories }) => {
  return (
    <View style={styles.container}>
      <View style={styles.headerBox}>
        <Text style={styles.headerText}>정렬 - {selectedFilter}</Text>
      </View>
      <TouchableOpacity style={styles.filterItem} onPress={() => onFilterSelect('다운로드 순')}>
        <Image source={DownloadIcon} style={styles.icon} />
        <Text style={styles.filterText}>다운로드 순</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.filterItem} onPress={() => onFilterSelect('사전 순')}>
        <Image source={DictionaryIcon} style={styles.icon} />
        <Text style={styles.filterText}>사전 순</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.filterItem} onPress={() => onFilterSelect('카테고리 순')}>
        <Image source={CategoryIcon} style={styles.icon} />
        <Text style={styles.filterText}>카테고리 순</Text>
      </TouchableOpacity>

      {/* 스크롤 가능한 카테고리 리스트 */}
      <ScrollView style={styles.categoryScroll}>
        <View style={styles.categoryContainer}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              style={styles.categoryItem}
              onPress={() => onFilterSelect(category)}
            >
              <Text style={styles.categoryText}> ▶ {category}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <TouchableOpacity style={styles.resetButton} onPress={() => onFilterSelect('다운로드 순')}>
        <Text style={styles.resetButtonText}>선택 초기화</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <Text style={styles.closeButtonText}>닫기</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    right: 0,
    height: '100%',
    width: '100%',
    backgroundColor: '#3943B7',
    padding: width * 0.04,
    zIndex: 10,
    justifyContent: 'flex-start',
  },
  headerBox: {
    backgroundColor: '#000000',
    padding: width * 0.04,
    marginBottom: height * 0.02,
  },
  headerText: {
    color: '#ffffff',
    textAlign: 'center',
    fontSize: width * 0.07,
    fontWeight: 'bold',
  },
  filterItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: height * 0.025,
  },
  icon: {
    width: width * 0.08,
    height: width * 0.08,
    marginRight: width * 0.04,
  },
  filterText: {
    color: '#ffffff',
    fontSize: width * 0.08,
    fontWeight: 'bold',
  },
  categoryScroll: {
    maxHeight: height * 0.5,
  },
  categoryContainer: {
    marginLeft: width * 0.12,
  },
  categoryItem: {
    paddingVertical: height * 0.005,
  },
  categoryText: {
    color: '#ffffff',
    fontSize: width * 0.06,
  },
  resetButton: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: width * 0.04,
    backgroundColor: '#ffffff',
    borderRadius: width * 0.02,
    marginBottom: height * 0.01,
  },
  resetButtonText: {
    color: '#3943B7',
    fontSize: width * 0.07,
    fontWeight: 'bold',
  },
  closeButton: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: width * 0.04,
    backgroundColor: '#ffffff',
    borderRadius: width * 0.02,
  },
  closeButtonText: {
    color: '#3943B7',
    fontSize: width * 0.07,
    fontWeight: 'bold',
  },
});

export default Sidebar;
