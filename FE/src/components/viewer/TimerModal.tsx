// src/components/viewer/TimerModal.tsx
import React, {useState} from 'react';
import {Text, View, StyleSheet, Dimensions} from 'react-native';
import Btn from '../Btn';
import NumberPicker from './NumberPicker';

const {width, height} = Dimensions.get('window');

type Props = {
  closeModal: () => void;
  handleTimerOn: (timeLeft: number) => void;
  toggleTTSSetting: () => void;
};

const TimerModal: React.FC<Props> = ({
  closeModal,
  handleTimerOn,
  toggleTTSSetting,
}) => {
  const [selectedValue, setSelectedValue] = useState<string>('20분');
  const arrData: string[] = [
    '20분',
    '40분',
    '1시간',
    '1시간 20분',
    '1시간 40분',
    '2시간',
    '2시간 20분',
    '2시간 40분',
    '3시간',
  ];

  const handlePressTimeSetting = () => {
    let totalTime = 0;

    if (selectedValue.includes('시간')) {
      const [hours, minutes] = selectedValue.split(' ');

      const hoursNum = hours ? parseInt(hours.replace('시간', '')) : 0;
      const minutesNum = minutes ? parseInt(minutes.replace('분', '')) : 0;

      totalTime = hoursNum * 3600 + minutesNum * 60;
    } else if (selectedValue.includes('분')) {
      totalTime = parseInt(selectedValue.replace('분', '')) * 60;
    } else {
      totalTime = 0;
    }

    handleTimerOn(totalTime);
    closeModal();
    toggleTTSSetting();
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleBox}>
        <Text style={styles.title}>타이머 설정</Text>
      </View>
      <NumberPicker
        selectedValue={selectedValue}
        onValueChange={setSelectedValue}
        arrData={arrData}
      />
      <View style={styles.titleBox}>
        <Btn
          title="완료"
          btnSize={1}
          style={{marginBottom: height * 0.02}}
          onPress={handlePressTimeSetting}
        />
        <Btn
          isWhite={true}
          title="취소"
          btnSize={1}
          style={{marginBottom: height * 0.02}}
          onPress={closeModal}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    // flex: 1,
    zIndex: 13,
    backgroundColor: 'white',
  },
  titleBox: {
    width: '100%',
    height: '15%',
    minHeight: 100,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 3,
  },
  title: {
    fontSize: width * 0.1,
    fontWeight: 'bold',
  },
});

export default TimerModal;
