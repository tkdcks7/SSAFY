import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');
const responsiveFontSize = (factor: number) => width * (factor / 100);
const responsiveWidth = (factor: number) => width * (factor / 100);
const responsiveHeight = (factor: number) => height * (factor / 100);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  memberReviewContainer: {
    padding: responsiveWidth(4),
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  memberReviewText: {
    fontWeight: 'bold',
    fontSize: responsiveFontSize(8),
  },
  ratingLabel: {
    fontWeight: 'bold',
    fontSize: responsiveFontSize(5),
    textAlign: 'center',
    marginBottom: responsiveHeight(2),
  },
  ratingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: responsiveHeight(2),
  },
  star: {
    fontSize: responsiveFontSize(9),
    color: '#ccc',
  },
  starSelected: {
    fontSize: responsiveFontSize(12), // 선택 시 크기 변경
    color: '#3943B7',
    fontWeight: 'bold',
  },
  starFilled: {
    fontSize: responsiveFontSize(7),
    color: '#3943B7',
  },
  starEmpty: {
    fontSize: responsiveFontSize(7),
    color: '#ccc',
  },
  memberReviewContent: {
    fontSize: responsiveFontSize(5),
    marginBottom: responsiveHeight(2),
  },
  modifyButton: {
    backgroundColor: '#3943B7',
    paddingVertical: responsiveHeight(1.5),
    paddingHorizontal: responsiveWidth(5),
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: responsiveHeight(1),
  },
  modifyButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: responsiveFontSize(4),
  },
  deleteButton: {
    borderWidth: 1,
    borderColor: '#3943B7',
    paddingVertical: responsiveHeight(1.5),
    paddingHorizontal: responsiveWidth(5),
    borderRadius: 8,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#3943B7',
    fontWeight: 'bold',
    fontSize: responsiveFontSize(4),
  },
  reviewInputContainer: {
    padding: responsiveWidth(4),
  },
  reviewInput: {
    borderColor: '#ccc',
    borderWidth: 1,
    padding: responsiveHeight(1.5),
    marginBottom: responsiveHeight(1),
    textAlign: 'center',
    fontSize: responsiveFontSize(4),
    multiline: true, // 줄바꿈 가능하도록 설정
  },
  submitButton: {
    backgroundColor: '#3943B7',
    paddingVertical: responsiveHeight(2),
    paddingHorizontal: responsiveWidth(30),
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: responsiveHeight(1),
  },
  submitButtonDisabled: {
    backgroundColor: '#ccc', // 비활성화 색상 변경
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: responsiveFontSize(4),
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: '#3943B7',
    paddingVertical: responsiveHeight(2),
    paddingHorizontal: responsiveWidth(30),
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: responsiveHeight(2),
  },
  cancelButtonText: {
    color: '#3943B7',
    fontWeight: 'bold',
    fontSize: responsiveFontSize(4),
  },
  reviewItem: {
    padding: responsiveWidth(4),
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  nickname: {
    fontSize: responsiveFontSize(6),
    fontWeight: 'bold',
  },
  reviewContent: {
    fontSize: responsiveFontSize(6),
  },
  moreButton: {
    color: '#3943B7',
    fontSize: responsiveFontSize(4),
    fontWeight: 'bold',
  },
  date: {
    color: '#888',
    fontSize: responsiveFontSize(3.5),
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: responsiveWidth(90),
    padding: responsiveWidth(7),
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#3943B7',
  },
  modalText: {
    fontSize: responsiveFontSize(6),
    fontWeight: 'bold',
    marginBottom: responsiveHeight(1),
  },
});

export default styles;
