declare module '*.svg' {
  import { SvgProps } from 'react-native-svg';
  import React from 'react';
  const sSvgComponent: React.FC<SvgProps>;
  export default SvgComponent;
}
