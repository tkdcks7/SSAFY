import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');
const responsiveFontSize = (factor: number) => width * (factor / 100);
const responsiveWidth = (factor: number) => width * (factor / 100);
const responsiveHeight = (factor: number) => height * (factor / 100);

const styles = StyleSheet.create({
  container: {
    padding: responsiveWidth(4),
    marginBottom: responsiveHeight(4),
  },
  title: {
    fontWeight: 'bold',
    fontSize: responsiveFontSize(6),
    textAlign: 'center',
    marginBottom: responsiveHeight(2),
  },
  starsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: responsiveHeight(2),
  },
  starFilled: {
    fontSize: responsiveFontSize(7),
    color: '#3943B7',
  },
  starEmpty: {
    fontSize: responsiveFontSize(7),
    color: '#ccc',
  },
  averageScore: {
    fontSize: responsiveFontSize(6),
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
});

export default styles;
