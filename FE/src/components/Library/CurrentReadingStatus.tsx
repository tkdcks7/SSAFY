import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import {useNavigation} from '@react-navigation/native'; // Navigation 추가

const {width, height} = Dimensions.get('window');

type Props = {
  book: any;
};

const CurrentReadingStatus: React.FC<Props> = ({book}) => {
  const navigation = useNavigation();

  const handlePress = () => {
    if (book) {
      navigation.navigate('EBookViewer', { bookId: book.bookId }); // 'ViewerPage'로 이동
    }
  };

  return (
    <View style={styles.containerWrapper}>
      <Text style={styles.headerText}>현재 읽고 있는 책</Text>
      {book ? (
        <TouchableOpacity onPress={handlePress} style={styles.container}>
          <Image
            source={{
              uri: book.cover.startsWith('http')
                ? book.cover
                : `file://${book.cover}`,
            }}
            style={styles.bookImage}
          />
          <View style={styles.bookInfo}>
            <View style={styles.bookTitleContainer}>
              <Text
                numberOfLines={2}
                ellipsizeMode="tail"
                style={styles.bookTitle}>
                {book.title}
              </Text>
            </View>
            <View style={styles.progressContainer}>
              <Text style={styles.readingProgress}>{book.progressRate}%</Text>
            </View>
          </View>
        </TouchableOpacity>
      ) : (
        <View style={styles.container}>
          <Text style={styles.noBookText}>현재 읽고 있는 책이 없습니다.</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  containerWrapper: {
    marginHorizontal: width * 0.03,
  },
  headerText: {
    fontSize: width * 0.06,
    fontWeight: 'bold',
    color: '#3943B7',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: width * 0.02,
    paddingHorizontal: width * 0.03,
    backgroundColor: '#3943B7',
    marginVertical: height * 0.02,
    borderRadius: 8,
    elevation: 5,
  },
  bookImage: {
    width: width * 0.15,
    height: height * 0.1,
    marginRight: width * 0.03,
    borderRadius: 8,
  },
  bookInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  bookTitleContainer: {
    flex: 1,
    paddingHorizontal: width * 0.01,
    paddingVertical: height * 0.01,
  },
  bookTitle: {
    fontSize: width * 0.05,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  progressContainer: {
    backgroundColor: '#ffffff',
    paddingHorizontal: width * 0.04,
    paddingVertical: height * 0.025,
    borderRadius: 8,
    maxWidth: width * 0.2,
    alignSelf: 'flex-start',
    flexShrink: 1,
  },
  readingProgress: {
    fontSize: width * 0.045,
    fontWeight: 'bold',
    color: '#3943B7',
    textAlign: 'center',
  },
  noBookText: {
    fontSize: width * 0.045,
    color: '#ffffff',
    textAlign: 'center',
  },
});

export default CurrentReadingStatus;
