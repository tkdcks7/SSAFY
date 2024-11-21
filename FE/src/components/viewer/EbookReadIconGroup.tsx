import React from 'react';
import EbookIcon from './EbookIcon';
// 아이콘
import noteicon from '../../assets/icons/notes.png';
import indexmenuicon from '../../assets/icons/indexmenu.png';
import settingicon from '../../assets/icons/setting.png';
import headphoneicon from '../../assets/icons/headphone.png';

type Props = {
  handlerArr: (() => void)[];
};

const EbookReadIconGroup: React.FC<Props> = ({handlerArr}) => {
  return (
    <>
      <EbookIcon
        source={indexmenuicon}
        onPress={handlerArr[0]}
        accessibilitylabel="목차 토글"
      />
      <EbookIcon
        source={headphoneicon}
        onPress={handlerArr[1]}
        accessibilitylabel="TTS 모드 시작"
      />
      <EbookIcon
        source={noteicon}
        onPress={handlerArr[2]}
        accessibilitylabel="독서노트 목록 토글"
        style={{transform: [{scaleX: -1}]}}
      />
      <EbookIcon
        source={settingicon}
        onPress={handlerArr[3]}
        accessibilitylabel="뷰어 설정창 토글"
      />
    </>
  );
};

export default EbookReadIconGroup;
