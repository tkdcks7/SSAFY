// src/components/PageWrapper.tsx
import React, { ReactNode } from 'react';
import { StyleSheet, ScrollView, ScrollViewProps, ViewStyle, KeyboardAvoidingView, Platform } from 'react-native';

interface CustomScrollViewProps extends ScrollViewProps {
    children: ReactNode;
    style?: ViewStyle;
  }

const PageWrapper: React.FC<CustomScrollViewProps> = ({ children, style, ...props }) => {
  return (
    <KeyboardAvoidingView 
    style={{flex: 1}} 
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'
    }
>
    <ScrollView contentContainerStyle={[styles.scrollContainer, style]} {...props}>
        {children}
    </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
    scrollContainer: {
      flexGrow: 1,
      alignItems: 'center',
      marginVertical: 30,
      marginHorizontal: 50,
    },
  });

export default PageWrapper;