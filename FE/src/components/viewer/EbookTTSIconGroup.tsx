import React from 'react';
import EbookIcon from './EbookIcon';
// 아이콘
import settingicon from '../../assets/icons/setting.png';
import prevbuttonicon from '../../assets/icons/pervbutton.png';
import playbuttonicon from '../../assets/icons/playbutton.png';
import pausebuttonicon from '../../assets/icons/pausebutton.png';

type Props = {
  handlerArr: (() => void)[];
  isTTSPlaying: boolean;
};

const EbookTTSIconGroup: React.FC<Props> = ({handlerArr, isTTSPlaying}) => {
  return (
    <>
      <EbookIcon
        source={prevbuttonicon}
        onPress={handlerArr[0]}
        accessibilitylabel="이전 문장으로 이동"
      />
      <EbookIcon
        source={isTTSPlaying ? pausebuttonicon : playbuttonicon}
        onPress={handlerArr[1]}
        accessibilitylabel={isTTSPlaying ? 'TTS 중지' : 'TTS 시작'}
      />
      <EbookIcon
        source={prevbuttonicon}
        onPress={handlerArr[2]}
        accessibilitylabel="다음 문장으로 이동"
        style={{transform: [{scaleX: -1}]}}
      />
      <EbookIcon
        source={settingicon}
        onPress={() => (isTTSPlaying ? {} : handlerArr[3]())}
        accessibilitylabel="TTS 설정 토글"
        style={isTTSPlaying ? {tintColor: 'gray', opacity: 0.2} : undefined}
      />
    </>
  );
};

export default EbookTTSIconGroup;
