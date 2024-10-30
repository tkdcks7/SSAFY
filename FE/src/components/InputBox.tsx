import React from 'react';
import { TextInput, StyleSheet, TextInputProps } from 'react-native';

interface CustomTextInputProps extends TextInputProps {
  size?: number;
  value: string;
  placeholder: string;
  secureTextEntry?: boolean;
  onChangeText: (text: string) => void;
}



const InputBox: React.FC<CustomTextInputProps> = ({
  size = 0,
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  ...props
}) => {
  const [isFocused, setIsFocused] = React.useState(false);

  return (
    <>
      <TextInput
        style={[styles.inputBase, isFocused && styles.focusedInput, size === 1 && { height:'25%', minHeight: 120 }]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        secureTextEntry={secureTextEntry}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        accessible={true}
        accessibilityRole='text'
        accessibilityLabel={placeholder + ' 입력칸'}
        accessibilityValue={{text: value}}
        {...props}
      />
    </>
  );
};

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
