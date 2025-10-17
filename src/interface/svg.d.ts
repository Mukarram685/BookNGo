declare module '*.svg' {
  import { SvgProps } from 'react-native-svg';
  import React from 'react';
  const SvgComponent: React.FC<SvgProps>;
  export default SvgComponent;
}
