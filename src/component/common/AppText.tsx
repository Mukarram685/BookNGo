import React from 'react';
import {
  Text,
  TextProps,
  TextStyle,
} from 'react-native';
import { scale } from 'react-native-size-matters';
import colors from '../../utils/colors';

type AppTextProps = TextProps & {
  size?: number;
  color?: string;
  weight?: TextStyle['fontWeight'];
  align?: TextStyle['textAlign'];
  style?: TextStyle | TextStyle[];
};

const AppText: React.FC<AppTextProps> = ({
  size = 14,
  color = colors.BLACK,
  weight = 'normal',
  align = 'left',
  style,
  children,
  ...props
}) => {
  const scaledFontSize = scale(size);

  return (
    <Text
      {...props}
      style={[
        {
          fontSize: scaledFontSize,
          color,
          fontWeight: weight,
          textAlign: align,
          includeFontPadding: false,
          textAlignVertical: 'center',
        },
        style,
      ]}
    >
      {children}
    </Text>
  );
};

export default AppText;
