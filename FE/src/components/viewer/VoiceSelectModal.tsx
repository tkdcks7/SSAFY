import React, {useState} from 'react';
import {Text, View, StyleSheet, Dimensions} from 'react-native';
import Btn from '../Btn';
import NumberPicker from './NumberPicker';
import useSettingStore from '../../store/settingStore';
import Tts from 'react-native-tts';

const {width, height} = Dimensions.get('window');

type Props = {
  closeModal: () => void;
};

const VoiceSelectModal: React.FC<Props> = ({closeModal}) => {
  const arrData: string[] = ['여성1', '여성2', '남성1', '남성2'];
  const voiceMagicTable: any = {
    여성1: 'ko-kr-x-ism-local',
    여성2: 'ko-kr-x-kob-local',
    남성1: 'ko-kr-x-kod-local',
    남성2: 'ko-kr-x-koc-local',
  };
  const {ttsVoiceIndex, setTtsVoiceIndex} = useSettingStore();
  const [selectedValue, setSelectedValue] = useState<string>(
    arrData[ttsVoiceIndex],
  );

  const handleChangeVoice = () => {
    Tts.setDefaultVoice(voiceMagicTable[selectedValue]);
    setTtsVoiceIndex(arrData.indexOf(selectedValue));
    closeModal();
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleBox}>
        <Text style={styles.title}>TTS 보이스 설정</Text>
      </View>
      <NumberPicker
        selectedValue={selectedValue}
        onValueChange={setSelectedValue}
        arrData={arrData}
      />
      <View style={styles.titleBox}>
        <Btn
          title="완료"
          btnSize={0}
          style={{marginBottom: height * 0.02, width: '80%'}}
          onPress={handleChangeVoice}
        />
        <Btn
          isWhite={true}
          title="취소"
          btnSize={0}
          style={{marginBottom: height * 0.02, width: '80%'}}
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

export default VoiceSelectModal;
