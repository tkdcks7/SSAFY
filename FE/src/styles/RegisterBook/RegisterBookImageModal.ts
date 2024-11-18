import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '85%',
    backgroundColor: 'white',
    padding: height * 0.03,
    borderRadius: 10,
  },
  title: {
    fontSize: width * 0.07,
    fontWeight: 'bold',
    marginBottom: height * 0.02,
    textAlign: 'center',
  },
  subTitle: {
    fontSize: width * 0.05,
    fontWeight: 'bold',
    marginBottom: height * 0.02,
    textAlign: 'center',
  },
  uploadPreviewContainer: {
    alignItems: 'center',
    marginBottom: height * 0.02,
  },
  previewImage: {
    width: width * 0.5,
    height: height * 0.3,
    resizeMode: 'contain',
    marginBottom: height * 0.01,
  },
  additionalImagesText: {
    fontSize: width * 0.04,
    color: '#888',
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: height * 0.02,
  },
  label: {
    fontWeight: 'bold',
    fontSize: width * 0.05,
    textAlign: 'center',
    width: '25%',
  },
  input: {
    width: '70%',
    borderColor: '#CCCCCC',
    borderWidth: 1,
    padding: height * 0.015,
    borderRadius: 5,
    fontSize: width * 0.045,
  },
  pickerButton: {
    width: '70%',
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 5,
    backgroundColor: '#3943B7',
    padding: height * 0.015,
    alignItems: 'center',
  },
  pickerText: {
    fontSize: width * 0.05,
    color: 'white',
    fontWeight: 'bold',
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: height * 0.02,
  },
  registerButton: {
    backgroundColor: '#3943B7',
    paddingVertical: height * 0.02,
    width: '90%',
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: height * 0.015,
    marginLeft: width * 0.04,
  },
  registerButtonText: {
    color: '#FFFFFF',
    fontSize: width * 0.05,
    fontWeight: 'bold',
  },
  cancelButton: {
    borderColor: '#3943B7',
    borderWidth: 2,
    backgroundColor: '#FFFFFF',
    paddingVertical: height * 0.02,
    width: '90%',
    borderRadius: 8,
    alignItems: 'center',
    marginLeft: width * 0.04,
  },
  cancelButtonText: {
    color: '#3943B7',
    fontSize: width * 0.05,
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: '#CCCCCC',
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: height * 0.03,
    minHeight: height * 0.3,
  },
  loadingText: {
    fontSize: width * 0.045,
    fontWeight: 'bold',
    marginBottom: height * 0.02,
    textAlign: 'center',
  },
  progressText: {
    fontSize: width * 0.045,
    marginBottom: height * 0.01,
    textAlign: 'center',
  },
  activityIndicator: {
    marginVertical: height * 0.02,
    transform: [{ scale: 1.5 }],
  },
  statusMessage: {
    fontSize: width * 0.045,
    color: '#333',
    textAlign: 'center',
    marginTop: height * 0.01,
    flexWrap: 'wrap',
  },
  timerText: {
    fontSize: width * 0.045,
    color: '#000',
    fontWeight: 'bold',
    marginTop: height * 0.02,
    textAlign: 'center',
  },
});
