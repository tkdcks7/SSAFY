import React from 'react';
import { Text, View, StyleSheet, Dimensions } from 'react-native';
import Btn from '../Btn';

const { width, height } = Dimensions.get('window');

type Props = {
    closeModal: () => void;
}

const NoteSaveModal: React.FC<Props> = ({ closeModal }) => {
  return (
    <View style={styles.container}>
            <Text style={styles.sentence}>현재 문장 문장 문장 문장 문장</Text>
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
        justifyContent: 'center',
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
    sentence: {
        fontSize: width * 0.05,
        fontWeight: 'bold',
    }
})

export default NoteSaveModal;