import React, { forwardRef } from 'react';
import { TextInput, StyleSheet, TextInputProps, ViewStyle } from 'react-native';

interface CustomTextInputProps extends TextInputProps {
  size?: number;
  value: string;
  placeholder: string;
  secureTextEntry?: boolean;
  style?: ViewStyle;
  onChangeText: (text: string) => void;
}

const InputBox = forwardRef<TextInput, CustomTextInputProps>(({
  size = 0,
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  style,
  ...props
}, ref) => {
  const [isFocused, setIsFocused] = React.useState(false);

  return (
    <TextInput
      ref={ref}  // forwardRef로 받은 ref를 TextInput에 전달
      style={[
        styles.inputBase,
        isFocused && styles.focusedInput,
        size === 1 && { height: '25%', minHeight: 120 },
        style,
      ]}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      secureTextEntry={secureTextEntry}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      accessible={true}
      accessibilityRole="text"
      accessibilityLabel={`${placeholder} 입력칸`}
      accessibilityValue={{ text: value }}
      {...props}
    />
  );
});

const styles = StyleSheet.create({
  inputBase: {
    width: '100%',
    height: '15%',
    minHeight: 60,
    maxHeight: 80,
    backgroundColor: '#E0E0E0',
    borderColor: '#888888',
    borderWidth: 3,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginVertical: 10,
    fontSize: 36,
  },
  focusedInput: {
    borderColor: '#007AFF',
  },
});

export default InputBox;