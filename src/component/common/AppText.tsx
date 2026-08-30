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
  style?: TextStyle;
};

const AppText: React.FC<AppTextProps> = ({
  size = scale(14),
  color = colors.BLACK,
  weight = 'normal',
  align = 'left',
  style,
  children,
  ...props
}) => {
  return (
    <Text
      {...props}
      style={[
        {
          fontSize: scale(size),
          color,
          fontWeight: weight,
          textAlign: align,
        },
        style,
      ]}
    >
      {children}
    </Text>
  );
};

export default AppText;

