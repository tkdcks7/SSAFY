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
    minHeight: 300, // 적절한 최소 높이를 추가해 모달이 너무 작아지지 않도록 함
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    flexDirection: 'column', // 메시지와 스피너를 세로로 정렬합니다.
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20, // 여백을 추가하여 텍스트와 스피너가 겹치지 않도록 합니다.
    minHeight: 200, // 적당한 높이 값을 추가하여 요소들이 좁혀지지 않도록 합니다.
  },
  loadingText: {
    width: '100%', // 텍스트가 컨테이너의 너비를 모두 차지하도록 합니다.
    fontSize: width * 0.05,
    fontWeight: 'bold',
    marginBottom: 20, // 스피너와 텍스트 사이의 간격을 확보
    textAlign: 'center',
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
  fileTypeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: height * 0.02,
  },
  pdfButton: {
    backgroundColor: '#3943B7',
    paddingVertical: height * 0.04,
    paddingHorizontal: width * 0.05,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    width: '45%',
  },
  epubButton: {
    backgroundColor: '#3943B7',
    paddingVertical: height * 0.04,
    paddingHorizontal: width * 0.05,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    width: '45%',
  },
  modalButtonText: {
    color: '#FFFFFF',
    fontSize: width * 0.06,
    fontWeight: 'bold',
  },
  uploadContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: height * 0.02,
  },
  icon: {
    width: width * 0.1,
    height: width * 0.1,
    marginRight: width * 0.03,
  },
  uploadButton: {
    backgroundColor: '#FFFFFF',
    borderColor: '#000000',
    borderWidth: 1,
    paddingVertical: height * 0.015,
    paddingHorizontal: width * 0.02,
    borderRadius: 8,
    alignItems: 'center',
    width: '80%',
  },
  uploadButtonText: {
    color: '#000000',
    fontSize: width * 0.05,
    fontWeight: 'bold',
  },
  registerButton: {
    backgroundColor: '#3943B7',
    paddingVertical: height * 0.02,
    width: '100%',
    borderRadius: 8,
    alignItems: 'center',
    marginTop: height * 0.02,
  },
  registerButtonText: {
    color: '#FFFFFF',
    fontSize: width * 0.06,
    fontWeight: 'bold',
  },
  cancelButton: {
    borderColor: '#3943B7',
    borderWidth: 2,
    backgroundColor: '#FFFFFF',
    paddingVertical: height * 0.02,
    width: '100%',
    borderRadius: 8,
    alignItems: 'center',
    marginTop: height * 0.02,
  },
  cancelButtonText: {
    color: '#3943B7',
    fontSize: width * 0.06,
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: '#CCCCCC',
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
});
