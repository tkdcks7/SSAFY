import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persist, createJSONStorage } from 'zustand/middleware';

interface SettingState {
  brightSetting: number;
  fontSizeSetting: number;
  lineHeightSetting: number;
  isDarkMode: boolean;
  ttsSpeedSetting: number;
  ttsVoiceIndex: number;
  isAccessibilityMode: boolean;
  setBrightSetting: (value: number) => void;
  setFontSizeSetting: (value: number) => void;
  setLineHeightSetting: (value: number) => void;
  setIsDarkMode: (value: boolean) => void;
  setTtsSpeedSetting: (value: number) => void;
  setTtsVoiceIndex: (value: number) => void;
  setIsAccessibilityMode: (value: boolean) => void;
}

export const fontSizeTable = ['12pt', '16pt', '20pt', '24pt', '36pt'];

const useSettingStore = create<SettingState>()(
  persist(
    (set) => ({
      brightSetting: 5,
      fontSizeSetting: 0,
      lineHeightSetting: 2,
      isDarkMode: false,
      ttsSpeedSetting: 0.5,
      ttsVoiceIndex: 0,
      isAccessibilityMode: false,

      setBrightSetting: (value) => set({ brightSetting: value }),
      setFontSizeSetting: (value) => set({ fontSizeSetting: value }),
      setLineHeightSetting: (value) => set({ lineHeightSetting: value }),
      setIsDarkMode: (value) => set({ isDarkMode: value }),
      setTtsSpeedSetting: (value) => set({ ttsSpeedSetting: value }),
      setTtsVoiceIndex: (value) => set({ ttsVoiceIndex: value }),
      setIsAccessibilityMode: (value) => set({ isAccessibilityMode: value }),
    }),
    {
      name: 'setting-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export default useSettingStore;