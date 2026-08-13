import React from 'react';
import {
  View,
  ScrollView,
  StatusBar,
  Image,
  StyleSheet,
  StyleProp,
  ViewStyle,
  ImageSourcePropType,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import Svg, { Defs, LinearGradient, Stop, Rect } from 'react-native-svg';
import Colors from '../../utils/Colors.util';
import AppLoader from './AppLoader';
import NetworkStatus from './NetworkStatus';

type ScreenWrapperProps = {
  children: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
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
};

const ScreenWrapper: React.FC<ScreenWrapperProps> = ({
  children,
  header,
  footer,
  isLoading = false,
  backgroundColor = Colors.BACKGROUND,
  isScrollable = true,
  paddingHorizontal = scale(16),
  contentStyle,
  isHeaderAbsolute = false,
  headerAbsolute = false,
  isFooterAbsolute = false,
  footerAbsolute = false,
  shouldShowGradientBackground = false,
  showBackgroundImage = false,
  backgroundImageSource,
  backgroundImageOpacity = 1,
  backgroundImageHeight = '48%',
  statusBarTranslucent = false,
}) => {
  const finalHeaderAbsolute = isHeaderAbsolute || headerAbsolute;
  const finalFooterAbsolute = isFooterAbsolute || footerAbsolute;
  const gradientLightColor = (Colors as any).GRADIENT_LIGHT || Colors.ACCENT || '#7ED3EF';

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <SafeAreaView
        style={styles.safeArea}
        edges={statusBarTranslucent ? ['left', 'right'] : ['top', 'left', 'right']}
      >
        <StatusBar
          barStyle="dark-content"
          backgroundColor={statusBarTranslucent ? 'transparent' : backgroundColor}
          translucent={statusBarTranslucent}
        />
        <NetworkStatus />

        {shouldShowGradientBackground && (
          <View style={styles.gradientContainer}>
            <Svg width="100%" height="100%">
              <Defs>
                <LinearGradient id="screenGrad" x1="1" y1="0" x2="0" y2="1">
                  <Stop offset="0" stopColor={gradientLightColor} stopOpacity="0.9" />
                  <Stop offset="0.6" stopColor={backgroundColor} stopOpacity="0" />
                  <Stop offset="1" stopColor={backgroundColor} stopOpacity="0" />
                </LinearGradient>
              </Defs>
              <Rect width="100%" height="100%" fill="url(#screenGrad)" />
            </Svg>
          </View>
        )}

        {showBackgroundImage && backgroundImageSource && (
          <View
            style={[
              styles.backgroundImageContainer,
              { height: backgroundImageHeight, opacity: backgroundImageOpacity },
            ]}
          >
            <Image
              source={backgroundImageSource}
              style={styles.backgroundImage}
              resizeMode="cover"
            />
          </View>
        )}

        {header && (
          <View
            style={[
              styles.header,
              shouldShowGradientBackground ? styles.headerTransparent : styles.headerWhite,
              finalHeaderAbsolute && styles.absoluteHeader,
            ]}
          >
            {header}
          </View>
        )}

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <AppLoader />
          </View>
        ) : (
          <>
            {isScrollable ? (
              <ScrollView
                style={styles.flex1}
                contentContainerStyle={[
                  styles.scrollContent,
                  { paddingHorizontal },
                  contentStyle,
                ]}
                showsVerticalScrollIndicator={false}
              >
                {children}
              </ScrollView>
            ) : (
              <View
                style={[
                  styles.nonScrollContent,
                  { paddingHorizontal },
                  contentStyle,
                ]}
              >
                {children}
              </View>
            )}

            {footer && (
              <View
                style={[
                  styles.footer,
                  finalFooterAbsolute && styles.absoluteFooter,
                ]}
              >
                {footer}
              </View>
            )}
          </>
        )}
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  safeArea: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  flex1: {
    flex: 1,
  },
  gradientContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: verticalScale(350),
    zIndex: 0,
  },
  backgroundImageContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    zIndex: 0,
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
  },
  header: {
    zIndex: 10,
  },
  headerTransparent: {
    backgroundColor: 'transparent',
    padding: 0,
  },
  headerWhite: {
    backgroundColor: '#FFFFFF',
    padding: moderateScale(16),
  },
  absoluteHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: verticalScale(16),
  },
  nonScrollContent: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'stretch',
  },
  footer: {
    backgroundColor: '#FFFFFF',
    padding: moderateScale(16),
    borderTopLeftRadius: scale(20),
    borderTopRightRadius: scale(20),
  },
  absoluteFooter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
});

export default ScreenWrapper;
