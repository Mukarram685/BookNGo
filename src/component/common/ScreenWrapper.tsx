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
    {header && (
      <View style={[styles.header, headerAbsolute && styles.absoluteHeader]}>
        {header}
      </View>
    )}

    {isLoading && (
      <View style={styles.loadingContainer}>
        <AppLoader />
      </View>
    )}

    {!isLoading && (
      <>
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
      </>
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
    backgroundColor: Colors.WHITE,
    padding: moderateScale(16),
    borderBottomLeftRadius: scale(20),
    borderBottomRightRadius: scale(20),
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
});

export default ScreenWrapper;
