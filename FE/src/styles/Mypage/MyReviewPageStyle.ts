import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: width * 0.03,
    marginVertical: height * 0.02,
  },
  searchInput: {
    flex: 1,
    height: height * 0.06,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: width * 0.03,
    borderRadius: 8,
    fontSize: width * 0.045,
  },
  clearButton: {
    marginLeft: width * 0.02,
    backgroundColor: '#3943B7',
    paddingVertical: height * 0.015,
    paddingHorizontal: width * 0.04,
    borderRadius: 8,
  },
  clearButtonText: {
    color: '#fff',
    fontSize: width * 0.04,
    fontWeight: 'bold',
  },
  scrollContent: {
    paddingBottom: height * 0.1,
    paddingHorizontal: width * 0.03,
  },
  reviewBox: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: width * 0.04,
    marginBottom: height * 0.03,
  },
  reviewTitle: {
    fontSize: width * 0.06,
    fontWeight: 'bold',
  },
  reviewContent: {
    fontSize: width * 0.045,
    marginBottom: height * 0.01,
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reviewDate: {
    fontSize: width * 0.04,
    color: '#666',
  },
  ratingContainer: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
    marginBottom: height * 0.01,
  },
  starFilled: {
    color: '#3943B7',
    fontSize: width * 0.07,
  },
  starEmpty: {
    color: '#ccc',
    fontSize: width * 0.07,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: height * 0.02,
  },
  deleteButton: {
    width: width * 0.4,
    height: height * 0.06,
    borderWidth: 2,
    borderColor: '#3943B7',
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  deleteButtonText: {
    color: '#3943B7',
    fontSize: width * 0.045,
    fontWeight: 'bold',
  },
  editButton: {
    width: width * 0.4,
    height: height * 0.06,
    backgroundColor: '#3943B7',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  editButtonText: {
    color: '#FFFFFF',
    fontSize: width * 0.045,
    fontWeight: 'bold',
  },
  noReviewsText: {
    fontSize: width * 0.05,
    color: '#666',
    textAlign: 'center',
    marginTop: height * 0.02,
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: width * 0.9,
    padding: width * 0.07,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#3943B7',
  },
  modalText: {
    fontSize: width * 0.05,
    fontWeight: 'bold',
    marginBottom: height * 0.02,
  },
  submitButton: {
    width: width * 0.7,
    height: height * 0.06,
    backgroundColor: '#3943B7',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginVertical: height * 0.01,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: width * 0.045,
  },
  cancelButton: {
    width: width * 0.7,
    height: height * 0.06,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#3943B7',
    marginVertical: height * 0.01,
  },
  cancelButtonText: {
    color: '#000',
    fontSize: width * 0.045,
  },
});

export default styles;
