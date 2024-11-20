import React from 'react';
import {
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ImageStyle,
} from 'react-native';

type Props = {
  source: any;
  onPress: () => void;
  style?: ImageStyle | ImageStyle[];
};

const {width} = Dimensions.get('window');

const EbookIcon: React.FC<Props> = ({source, onPress, style}) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <Image source={source} style={[styles.icon, style]} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  icon: {
    width: width * 0.1,
    height: width * 0.1,
    tintColor: 'black',
  },
});

export default EbookIcon;
