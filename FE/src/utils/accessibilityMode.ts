import AsyncStorage from '@react-native-async-storage/async-storage';

const ACCESSIBILITY_KEY = 'accessibilityMode';

/**
 * 현재 접근성 모드 상태를 가져옵니다.
 * 로컬 저장소에 값이 없으면 기본값으로 접근성 모드 ON을 설정합니다.
 * @returns {Promise<boolean>} 접근성 모드 상태 (true: On, false: Off)
 */
export const getAccessibilityMode = async (): Promise<boolean> => {
  try {
    const value = await AsyncStorage.getItem(ACCESSIBILITY_KEY);
    if (value !== null) {
      return JSON.parse(value); // 저장된 상태 반환
    }
    // 로컬 상태가 없으면 기본값으로 접근성 모드 ON 설정
    await AsyncStorage.setItem(ACCESSIBILITY_KEY, JSON.stringify(true));
    return true;
  } catch (error) {
    console.error('Failed to get accessibility mode:', error);
    return true; // 오류 시 기본값 반환
  }
};

/**
 * 접근성 모드 상태를 토글합니다.
 * @returns {Promise<boolean>} 토글된 접근성 모드 상태
 */
export const toggleAccessibilityMode = async (): Promise<boolean> => {
  try {
    const currentMode = await getAccessibilityMode();
    const newMode = !currentMode; // 현재 상태를 반전
    await AsyncStorage.setItem(ACCESSIBILITY_KEY, JSON.stringify(newMode));
    return newMode; // 새로운 상태 반환
  } catch (error) {
    console.error('Failed to toggle accessibility mode:', error);
    return false; // 오류 시 기본값 반환
  }
};
