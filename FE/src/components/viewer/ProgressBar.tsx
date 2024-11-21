// src/components/ProgressBar.tsx
import React, {useEffect} from 'react';
import {View, StyleSheet, Dimensions} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';

type ProgressProps = {
  progress: number;
};

const {height} = Dimensions.get('window');

const ProgressBar: React.FC<ProgressProps> = ({progress}) => {
  const animatedProgress = useSharedValue(0);

  useEffect(() => {
    animatedProgress.value = withTiming(progress, {duration: 500});
  }, [progress]);

  const animatedStyle = useAnimatedStyle(() => ({
    width: `${animatedProgress.value * 100}%`,
  }));

  return (
    <View style={styles.progressBarContainer}>
      <Animated.View style={[styles.progressBar, animatedStyle]} />
    </View>
  );
};

export default ProgressBar;

const styles = StyleSheet.create({
  progressBarContainer: {
    width: '80%',
    height: height * 0.025,
    backgroundColor: '#e0e0e0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#3943B7',
    borderRadius: 3,
  },
});
