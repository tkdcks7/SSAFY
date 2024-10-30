// src/utils/announceScrollEnd.ts
import { AccessibilityInfo, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';

let isScrollAtBottom = false;

export const handleScrollEndAnnouncement = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
  const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;

  // 스크롤이 가장 아래에 도달했는지 확인
  if (layoutMeasurement.height + contentOffset.y >= contentSize.height - 20) {
    if (!isScrollAtBottom) {
      isScrollAtBottom = true;
      AccessibilityInfo.announceForAccessibility('스크롤이 가장 아래에 도달했습니다.');
    }
  } else {
    if (isScrollAtBottom) {
      isScrollAtBottom = false;
    }
  }
};
