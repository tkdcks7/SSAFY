import React, { useState } from 'react';
import { Text, View, StyleSheet, Dimensions } from 'react-native';
import Btn from '../Btn';
import NumberPicker from './NumberPicker';
import useSettingStore, { fontSizeTable } from '../../store/settingStore';

const { width, height } = Dimensions.get('window');

type Props = {
    closeModal: () => void;
    changeFontSize: (size: string) => void;
}

const FontSizeSettingModal: React.FC<Props> = ({ closeModal, changeFontSize }) => {
    const { fontSizeSetting, setFontSizeSetting } = useSettingStore();
    const [selectedValue, setSelectedValue] = useState<number>(fontSizeSetting + 1);
    const arrData = [1, 2, 3, 4, 5];

    const handleFontSizeChange = (): void => {
        changeFontSize(fontSizeTable[selectedValue - 1]);
        setFontSizeSetting(selectedValue - 1);
        closeModal();
    }
  return (
    <View style={styles.container}>
        <View style={styles.titleBox}>
            <Text style={styles.title}>글자 크기 설정</Text>
        </View>
        <NumberPicker selectedValue={selectedValue} onValueChange={setSelectedValue} arrData={arrData} />
        <View style={styles.titleBox}>
            <Btn title='완료' btnSize={0} style={{marginBottom: height*0.02}} onPress={handleFontSizeChange} />
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
        backgroundColor:'white',
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

export default FontSizeSettingModal;