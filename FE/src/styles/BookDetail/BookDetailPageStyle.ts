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
    paddingBottom: 100, // ScrollView 하단 여백 추가
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
    fontSize: responsiveFontSize(6),
    textAlign: 'center',
    marginBottom: responsiveHeight(0.5),
  },
  bookPublisher: {
    fontSize: responsiveFontSize(6),
    textAlign: 'center',
    marginBottom: responsiveHeight(0.5),
  },
  bookCategory: {
    fontSize: responsiveFontSize(6),
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
  sectionTitleLarge: {
    fontSize: responsiveFontSize(6.5),
    marginBottom: responsiveFontSize(2),
    color: '#3943B7',
    marginLeft: responsiveWidth(3),
    fontWeight: 'bold',
  },
  buttonContainerWithMargin: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: responsiveHeight(1),
    paddingHorizontal: responsiveWidth(5),
  },
  buttonWrapper: {
    flex: 6,
    marginBottom: responsiveHeight(4),
    height: responsiveHeight(6),
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
  emptyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: responsiveHeight(1),
  },
  emptyText: {
    fontSize: responsiveFontSize(6.5),
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: responsiveWidth(4),
  },
});

export default styles;
