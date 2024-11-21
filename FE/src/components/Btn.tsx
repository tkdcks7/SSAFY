// src/components/Btn.tsx
import React, {useRef, useImperativeHandle, forwardRef} from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';

interface CustomButtonProps {
  isWhite?: boolean;
  btnSize?: number;
  title: string;
  onPress: () => void;
  style?: ViewStyle; // 추가 스타일
  textStyle?: TextStyle; // 텍스트 추가 스타일
  disabled?: boolean;
}

const Btn = forwardRef(
  (
    {
      isWhite = false,
      btnSize = 1,
      title,
      onPress,
      style,
      textStyle,
      disabled = false,
      ...props
    }: CustomButtonProps,
    ref,
  ) => {
    const buttonRef = useRef<React.ElementRef<typeof TouchableOpacity>>(null);

    // 포커스를 외부에서 제어할 수 있게 합니다
    useImperativeHandle(ref, () => ({
      focus: () => {
        buttonRef.current?.focus();
      },
    }));

    let sizeStyle: any = styles.midButton;
    let sizeFont: number = 36;
    switch (btnSize) {
      case 0:
        sizeStyle = styles.minButton;
        sizeFont = 24;
        break;
      case 1:
        sizeStyle = styles.midButton;
        break;
      case 2:
        sizeStyle = styles.bigButton;
        sizeFont = 48;
        break;
    }

    return (
      <TouchableOpacity
        ref={buttonRef}
        style={[
          styles.baseBtnStyle,
          isWhite ? styles.whiteButton : {backgroundColor: '#3943B7'},
          sizeStyle,
          style,
        ]}
        onPress={onPress}
        activeOpacity={0.8}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel={title}
        disabled={disabled}
        {...props}>
        <Text
          style={[
            styles.baseTextStyle,
            isWhite ? {color: '#3943B7'} : {color: 'white'},
            {fontSize: sizeFont},
            textStyle,
          ]}
          accessible={false}>
          {title}
        </Text>
      </TouchableOpacity>
    );
  },
);

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
    height: '8%',
    minHeight: 50,
    maxHeight: 70,
  },

  midButton: {
    width: '90%',
    height: '10%',
    minHeight: 80,
  },

  bigButton: {
    width: '100%',
    height: '25%',
    minHeight: 150,
  },
});

export default Btn;
