import { ReactNode } from 'react';
import { StyleProp, ViewStyle, ImageSourcePropType } from 'react-native';

export interface ScreenWrapperProps {
    children: ReactNode;
    header?: ReactNode;
    footer?: ReactNode;
    isLoading?: boolean;
    backgroundColor?: string;
    isScrollable?: boolean;
    paddingHorizontal?: number;
    contentStyle?: StyleProp<ViewStyle>;
    isHeaderAbsolute?: boolean;
    headerAbsolute?: boolean;
    isFooterAbsolute?: boolean;
    footerAbsolute?: boolean;
    shouldShowGradientBackground?: boolean;
    showBackgroundImage?: boolean;
    backgroundImageSource?: ImageSourcePropType;
    backgroundImageOpacity?: number;
    backgroundImageHeight?: string | number;
    statusBarTranslucent?: boolean;
}

