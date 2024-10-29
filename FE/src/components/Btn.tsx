import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';

interface CustomButtonProps {
  isWhite?: boolean;
  btnSize?: number;
  title: string;
  onPress: () => void;
  style?: ViewStyle; // 추가 스타일
  textStyle?: TextStyle; // 텍스트 추가 스타일

}

const Btn: React.FC<CustomButtonProps> = ({ isWhite = false, btnSize = 1, title, onPress, style, textStyle, ...props }) => {
  let sizeStyle: any = styles.baseTextStyle;
  switch (btnSize) {
    case 0:
        sizeStyle = styles.minButton;
        break;
    case 2:
        sizeStyle = styles.bigButton;
        break;
  }
  return (
    <TouchableOpacity
      style={[
        styles.baseBtnStyle,
        isWhite ? styles.whiteButton : {backgroundColor: '#3943B7' },
        sizeStyle,
        style
        ]}
      onPress={onPress}
      activeOpacity={0.8}
      accessible={true}
      accessibilityRole='button'
      accessibilityLabel={title}
      {...props}
    >
      <Text 
      style={[ 
        styles.baseBtnStyle, 
        isWhite ? { color: 'white' } : { color: '#3943B7' },
        textStyle
        ]}
        accessible={false}
        >
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  baseBtnStyle: {
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  baseTextStyle: {
    fontSize: 36,
    fontWeight: 'bold',
  },

  blueButton: {
    backgroundColor: '#3943B7',
  },
  whiteButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 3,
    borderColor: '#3943B7',
  },

  minButton: {
    width: '40%',
    height: '10%',
    minHeight: 50,
  },

  midButton: {
    width: '100%',
    height: '15%',
    minHeight: 80,
  },

  bigButton: {
    width: '100%',
    height: '25%',
    minHeight: 120,
  },
});

export default Btn;