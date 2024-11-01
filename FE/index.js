import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import { ReaderProvider } from '@epubjs-react-native/core';

export default function Main() {
    return (
      <ReaderProvider>
        <App />
      </ReaderProvider>
    );
  }

AppRegistry.registerComponent(appName, () => Main);
