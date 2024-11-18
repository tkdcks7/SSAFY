// App.tsx
import 'react-native-gesture-handler';
import React from 'react';
import AppNavigator from './src/navigation/AppNavigator';
import { LibraryProvider } from './src/contexts/LibraryContext';

const App = (): React.JSX.Element => {
  return (
    <LibraryProvider>
      <AppNavigator />
    </LibraryProvider>
  );
};

export default App;
