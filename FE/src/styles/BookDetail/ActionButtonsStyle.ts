import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');
const responsiveFontSize = (factor: number) => width * (factor / 100);
const responsiveWidth = (factor: number) => width * (factor / 100);
const responsiveHeight = (factor: number) => height * (factor / 100);

const styles = StyleSheet.create({
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
  disabledButton: {
    backgroundColor: '#D3D3D3', // 비활성화된 버튼 색상
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
});

export default styles;
