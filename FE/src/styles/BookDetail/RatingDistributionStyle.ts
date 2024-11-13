import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    padding: width * 0.01,
    marginBottom: height * 0.02,
  },
  title: {
    fontWeight: 'bold',
    fontSize: width * 0.08,
    textAlign: 'center',
    marginBottom: height * 0.01,
  },
  starsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: height * 0.02,
  },
  averageScore: {
    fontSize: width * 0.06,
    fontWeight: 'bold',
    marginLeft: width * 0.02,
  },
  reviewBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: height * 0.005,
    marginLeft: 0,
  },
  reviewText: {
    width: '10%',
    fontSize: width * 0.05,
    textAlign: 'right',
    marginRight: width * 0.01, // 프로그레스바와 점수 간 여백 추가
  },
  reviewBar: {
    flex: 1,
    width: '40%',
    height: height * 0.015,
    backgroundColor: '#e0e0e0',
    marginHorizontal: width * 0.02, // 프로그레스바와 텍스트 간 여백
    borderRadius: 5,
  },
  reviewBarFill: {
    height: '100%',
    backgroundColor: '#3943B7',
    borderRadius: 5,
  },
  reviewPercentage: {
    width: '15%',
    fontSize: width * 0.05,
    textAlign: 'left',
    marginLeft: width * 0.01, // 프로그레스바와 분포 비율 간 여백 추가
  },
});

export default styles;
