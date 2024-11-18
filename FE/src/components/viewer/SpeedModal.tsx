import React, { useState } from 'react';
import { Text, View, StyleSheet, Dimensions } from 'react-native';
import Btn from '../Btn';
import NumberPicker from './NumberPicker';
import useSettingStore from '../../store/settingStore';
import Tts from 'react-native-tts';

const { width, height } = Dimensions.get('window');

type Props = {
    closeModal: () => void;
}

const SpeedModal: React.FC<Props> = ({ closeModal }) => {
    const { ttsSpeedSetting, setTtsSpeedSetting } = useSettingStore();
    const [selectedValue, setSelectedValue] = useState<number>(ttsSpeedSetting);
    const arrData = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];

    const handleChangeTtsSpeed = () => {
        Tts.setDefaultRate(selectedValue / 2);
        setTtsSpeedSetting(selectedValue);
        closeModal();
    };

  return (
    <View style={styles.container}>
        <View style={styles.titleBox}>
            <Text style={styles.title}>TTS 속도 설정</Text>
        </View>
        <NumberPicker selectedValue={selectedValue} onValueChange={setSelectedValue} arrData={arrData} />
        <View style={styles.titleBox}>
            <Btn title='완료' btnSize={0} style={{marginBottom: height * 0.02}} onPress={handleChangeTtsSpeed} />
            <Btn isWhite={true} title='취소' btnSize={0} style={{marginBottom: height * 0.02}} onPress={closeModal} />
        </View>
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        alignItems: 'center',
        // flex: 1,
        zIndex: 13,
        backgroundColor:'white'
    },
    titleBox: {
        width:'100%',
        height: '15%',
        minHeight: 100,
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomWidth: 3,
    },
    title: {
        fontSize: width * 0.1,
        fontWeight: 'bold',
    }
})

export default SpeedModal;