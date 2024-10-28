// App.tsx
import 'react-native-gesture-handler'; // Gesture Handler의 import가 가장 첫 줄에 있어야 합니다.
import React from 'react';
import AppNavigator from './src/navigation/AppNavigator';

const App = (): React.JSX.Element => {
  return <AppNavigator />;
};

export default App;
