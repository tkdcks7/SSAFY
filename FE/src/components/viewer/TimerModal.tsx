import React, { useState } from 'react';
import { Text, View, StyleSheet, Dimensions } from 'react-native';
import Btn from '../Btn';
import NumberPicker from './NumberPicker';

const { width, height } = Dimensions.get('window');

type Props = {
    closeModal: () => void;
}

const TimerModal: React.FC<Props> = ({ closeModal }) => {
    const [selectedValue, setSelectedValue] = useState<number>(1);

    const arrData = [20, 40, 60, 80, 100, 120, 140, 160, 180];
  return (
    <View style={styles.container}>
        <View style={styles.titleBox}>
            <Text style={styles.title}>타이머 설정</Text>
        </View>
        <NumberPicker selectedValue={selectedValue} onValueChange={setSelectedValue} arrData={arrData} />
        <View style={styles.titleBox}>
            <Btn title='완료' btnSize={0} style={{marginBottom: height*0.02}} onPress={closeModal} />
            <Btn isWhite={true} title='취소' btnSize={0} style={{marginBottom: height*0.02}} onPress={closeModal} />
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

export default TimerModal;