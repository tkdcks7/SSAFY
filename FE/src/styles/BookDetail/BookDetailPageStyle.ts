import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const responsiveFontSize = (factor: number) => width * (factor / 100);
const responsiveWidth = (factor: number) => width * (factor / 100);
const responsiveHeight = (factor: number) => height * (factor / 100);

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: responsiveWidth(3),
    backgroundColor: '#FFFFFF',
    flexGrow: 1,
    paddingBottom: 60, // ScrollView 하단 여백 추가
  },
  bookImage: {
    width: responsiveWidth(40),
    height: responsiveWidth(60),
    alignSelf: 'center',
    resizeMode: 'contain',
    marginBottom: responsiveHeight(2),
  },
  bookInfoContainer: {
    marginBottom: responsiveHeight(2),
  },
  bookTitleLarge: {
    fontSize: responsiveFontSize(9),
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: responsiveHeight(2),
  },
  bookAuthor: {
    fontSize: responsiveFontSize(5),
    textAlign: 'center',
    marginBottom: responsiveHeight(0.5),
  },
  bookPublisher: {
    fontSize: responsiveFontSize(5),
    textAlign: 'center',
    marginBottom: responsiveHeight(0.5),
  },
  bookCategory: {
    fontSize: responsiveFontSize(5),
    textAlign: 'center',
  },
  bookStoryContainer: {
    paddingHorizontal: responsiveWidth(4),
    marginBottom: responsiveHeight(2),
  },
  bookStory: {
    fontSize: responsiveFontSize(4.5),
    lineHeight: responsiveHeight(3),
    textAlign: 'justify',
    marginBottom: responsiveHeight(1),
  },
  moreButtonText: {
    fontSize: responsiveFontSize(4),
    color: '#3943B7',
    textAlign: 'right',
  },
  reviewContainer: {
    marginVertical: responsiveHeight(2),
    paddingHorizontal: responsiveWidth(3),
  },
  reviewDistributionTitle: {
    fontSize: responsiveFontSize(7),
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: responsiveHeight(1),
  },
  starsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: responsiveHeight(2),
  },
  starFilled: {
    color: '#3943B7',
    fontSize: responsiveFontSize(9),
  },
  starEmpty: {
    color: '#CCCCCC',
    fontSize: responsiveFontSize(9),
  },
  averageScore: {
    fontSize: responsiveFontSize(9),
    fontWeight: 'bold',
    marginLeft: responsiveWidth(2),
  },
  reviewBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: responsiveHeight(1),
  },
  reviewText: {
    width: '10%',
    fontSize: responsiveFontSize(4),
  },
  reviewBar: {
    flex: 1,
    height: responsiveHeight(1.5),
    backgroundColor: '#e0e0e0',
    marginHorizontal: responsiveWidth(3),
    borderRadius: 5,
  },
  reviewBarFill: {
    height: '100%',
    backgroundColor: '#3943B7',
    borderRadius: 5,
  },
  reviewPercentage: {
    width: '10%',
    fontSize: responsiveFontSize(3),
  },
  buttonContainerWithMargin: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: responsiveHeight(1), // 버튼 사이 여백 설정
    paddingHorizontal: responsiveWidth(5),
  },
  buttonWrapper: {
    flex: 6,
    marginBottom: responsiveHeight(4), // 버튼 간의 수직 여백 설정
    height: responsiveHeight(6), // 버튼의 높이 조정
  },
  iconWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconImage: {
    width: responsiveWidth(15),
    height: responsiveWidth(15),
    marginBottom: responsiveFontSize(2),
  },
  sectionTitleLarge: {
    fontSize: responsiveFontSize(8),
    marginBottom: responsiveFontSize(2),
    fontWeight: 'bold',
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: responsiveFontSize(5),
    color: '#FF0000',
  },
});

export default styles;
