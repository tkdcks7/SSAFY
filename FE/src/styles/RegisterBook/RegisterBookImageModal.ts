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
    padding: 20,
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
    padding: 10,
    borderRadius: 5,
    fontSize: width * 0.045,
  },
  pickerButton: {
    width: '70%',
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 5,
    backgroundColor: '#3943B7',
    padding: 10,
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
    width: '48%',
    borderRadius: 8,
    alignItems: 'center',
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
    width: '48%',
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#3943B7',
    fontSize: width * 0.05,
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: '#CCCCCC',
  },
  customPickerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  customPickerContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    width: '80%',
    padding: height * 0.03,
  },
  customPickerTitle: {
    fontSize: width * 0.08,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: height * 0.02,
  },
  customPickerItem: {
    paddingVertical: height * 0.02,
    width: '100%',
    alignItems: 'center',
  },
  customPickerItemText: {
    fontSize: width * 0.05,
    color: '#555',
  },
  customPickerSelectedItem: {
    color: '#3943B7',
    fontWeight: 'bold',
  },
  customPickerButton: {
    marginTop: height * 0.02,
    backgroundColor: '#3943B7',
    paddingVertical: height * 0.015,
    width: '80%',
    borderRadius: 8,
    alignItems: 'center',
  },
  customPickerButtonText: {
    color: '#FFFFFF',
    fontSize: width * 0.06,
    fontWeight: 'bold',
  },
});
