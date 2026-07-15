import React, { ReactNode } from 'react';
import {
  View,
  ScrollView,
  SafeAreaView,
  StyleSheet,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import Colors from '../../utils/Colors.util';
import AppLoader from './AppLoader';
import NetworkStatus from './NetworkStatus';

type ScreenWrapperProps = {
  children: ReactNode;
  header?: ReactNode;
  footer?: ReactNode;
  isLoading?: boolean;
  backgroundColor?: string;
  isScrollable?: boolean;
  paddingHorizontal?: number;
  contentStyle?: StyleProp<ViewStyle>;
  headerAbsolute?: boolean;
  footerAbsolute?: boolean;
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
  headerAbsolute = false,
  footerAbsolute = false,
}) => (
  <SafeAreaView style={[styles.container, { backgroundColor }]}>
    <NetworkStatus />
    {header && (
      <View style={[styles.header, headerAbsolute && styles.absoluteHeader]}>
        {header}
      </View>
    )}

    {isScrollable ? (
      <ScrollView
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
        style={[styles.footer, footerAbsolute && styles.absoluteFooter]}
      >
        {footer}
      </View>
    )}

    {isLoading && (
      <View style={styles.loaderOverlay}>
        <AppLoader />
      </View>
    )}
  </SafeAreaView>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.BACKGROUND,
    position: 'relative',
  },
  header: {
    backgroundColor: Colors.PRIMARY,
  },
  absoluteHeader: {
    position: 'absolute',
    top: verticalScale(0),
    left: scale(0),
    right: scale(0),
    zIndex: moderateScale(10),
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
    backgroundColor: Colors.WHITE,
    padding: moderateScale(16),
    borderTopLeftRadius: scale(20),
    borderTopRightRadius: scale(20),
  },
  absoluteFooter: {
    position: 'absolute',
    bottom: verticalScale(0),
    left: scale(0),
    right: scale(0),
    zIndex: moderateScale(10),
  },
  loaderOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(23, 44, 107, 0.4)', // Dark navy tint
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: moderateScale(100),
  },
});

export default ScreenWrapper;
