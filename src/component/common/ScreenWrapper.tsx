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
  gradient?: 'upper' | 'lower' | 'both';
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
  gradient = 'upper',
}) => {
  const finalHeaderAbsolute = isHeaderAbsolute || headerAbsolute;
  const finalFooterAbsolute = isFooterAbsolute || footerAbsolute;
  const gradientLightColor = (Colors as Record<string, string>).GRADIENT_LIGHT || Colors.ACCENT;

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

        {(gradient === 'upper' || gradient === 'both') && (
          <View style={styles.upperGradientContainer}>
            <Svg width="100%" height="100%">
              <Defs>
                <LinearGradient id="upperGrad" x1="0.5" y1="0.5" x2="0.5" y2="1">
                  <Stop offset="0" stopColor="#A3CCFF" stopOpacity="0.7" />
                  <Stop offset="0.4" stopColor="#CBE0FF" stopOpacity="0.4" />
                  <Stop offset="0.7" stopColor="#F2F7FF" stopOpacity="0.1" />
                  <Stop offset="1" stopColor={Colors.WHITE} stopOpacity="0" />
                </LinearGradient>
              </Defs>
              <Rect width="100%" height="100%" fill="url(#upperGrad)" />
            </Svg>
          </View>
        )}

        {(gradient === 'lower' || gradient === 'both') && (
          <View style={styles.fullGradientContainer}>
            <Svg width="100%" height="100%">
              <Defs>
                <LinearGradient id="lowerGrad" x1="0.5" y1="0" x2="0.5" y2="1">
                  <Stop offset="0" stopColor={Colors.WHITE} stopOpacity="0" />
                  <Stop offset="0.3" stopColor="#F2F7FF" stopOpacity="0.1" />
                  <Stop offset="0.6" stopColor="#CBE0FF" stopOpacity="0.4" />
                  <Stop offset="1" stopColor="#A3CCFF" stopOpacity="0.7" />
                </LinearGradient>
              </Defs>
              <Rect width="100%" height="100%" fill="url(#lowerGrad)" />
            </Svg>
          </View>
        )}

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
  absoluteFooter: {
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    zIndex: 10,
  },
  absoluteHeader: {
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  backgroundImage: {
    height: '100%',
    width: '100%',
  },
  backgroundImageContainer: {
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 0,
  },
  container: {
    flex: 1,
    position: 'relative',
  },
  flex1: {
    flex: 1,
  },
  footer: {
    backgroundColor: Colors.WHITE,
    borderTopLeftRadius: scale(20),
    borderTopRightRadius: scale(20),
    padding: moderateScale(16),
  },
  fullGradientContainer: {
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 0,
  },
  gradientContainer: {
    height: verticalScale(350),
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 0,
  },
  header: {
    zIndex: 10,
  },
  headerTransparent: {
    backgroundColor: Colors.TRANSPARENT,
    padding: 0,
  },
  headerWhite: {
    padding: moderateScale(1),
  },
  loadingContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  nonScrollContent: {
    alignItems: 'stretch',
    flex: 1,
    justifyContent: 'flex-start',
  },
  safeArea: {
    backgroundColor: Colors.TRANSPARENT,
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: verticalScale(16),
  },
  upperGradientContainer: {
    height: '60%',
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 0,
  },
});

export default ScreenWrapper;
