module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    'react-native-reanimated/plugin', // 이 부분이 반드시 마지막에 위치해야 합니다
  ],
};
