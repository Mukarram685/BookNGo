import React from 'react';
import {
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TextStyle,
  View,
} from 'react-native';
import { scale, verticalScale } from 'react-native-size-matters';
import colors from '../../utils/colors';
import AppText from './AppText';

type AppButtonProps = {
  title: string;
  onPress?: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger-outline' | 'text';
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  disabled?: boolean;
  loading?: boolean;
  activeOpacity?: number;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
};

const AppButton: React.FC<AppButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  style,
  textStyle,
  disabled = false,
  loading = false,
  activeOpacity = 0.8,
  icon,
  iconPosition = 'left',
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'secondary':
        return {
          button: styles.secondaryButton,
          text: styles.secondaryText,
        };
      case 'outline':
        return {
          button: styles.outlineButton,
          text: styles.outlineText,
        };
      case 'danger-outline':
        return {
          button: styles.dangerOutlineButton,
          text: styles.dangerOutlineText,
        };
      case 'text':
        return {
          button: styles.textButton,
          text: styles.textText,
        };
      case 'primary':
      default:
        return {
          button: styles.primaryButton,
          text: styles.primaryText,
        };
    }
  };

  const variantStyles = getVariantStyles();

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={activeOpacity}
      style={[
        styles.buttonBase,
        variantStyles.button,
        style,
        disabled && styles.disabledButton,
      ]}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'outline' || variant === 'danger-outline' || variant === 'text' ? colors.PRIMARY : colors.WHITE}
        />
      ) : (
        <View style={styles.contentContainer}>
          {icon && iconPosition === 'left' && <View style={styles.leftIconContainer}>{icon}</View>}
          <AppText
            style={StyleSheet.flatten([
              styles.textBase,
              variantStyles.text,
              textStyle,
              disabled && styles.disabledText,
            ])}
          >
            {title}
          </AppText>
          {icon && iconPosition === 'right' && <View style={styles.rightIconContainer}>{icon}</View>}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonBase: {
    height: verticalScale(48),
    borderRadius: scale(12),
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textBase: {
    fontSize: scale(15),
    fontWeight: 'bold',
  },
  leftIconContainer: {
    marginRight: scale(8),
  },
  rightIconContainer: {
    marginLeft: scale(8),
  },
  primaryButton: {
    backgroundColor: colors.PRIMARY,
    shadowColor: colors.PRIMARY,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 5,
    elevation: 3,
  },
  primaryText: {
    color: colors.WHITE,
  },
  secondaryButton: {
    backgroundColor: colors.SECONDARY,
    shadowColor: colors.SECONDARY,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 5,
    elevation: 3,
  },
  secondaryText: {
    color: colors.WHITE,
  },
  outlineButton: {
    backgroundColor: colors.SURFACE,
    borderWidth: 1.5,
    borderColor: colors.PRIMARY,
  },
  outlineText: {
    color: colors.PRIMARY,
  },
  dangerOutlineButton: {
    backgroundColor: colors.SURFACE,
    borderWidth: 1.5,
    borderColor: colors.RED,
  },
  dangerOutlineText: {
    color: colors.RED,
  },
  textButton: {
    backgroundColor: 'transparent',
    height: 'auto',
    paddingVertical: verticalScale(8),
  },
  textText: {
    color: colors.PRIMARY,
  },
  disabledButton: {
    backgroundColor: colors.BORDER_GREY,
    shadowOpacity: 0,
    elevation: 0,
    borderColor: colors.BORDER_GREY,
  },
  disabledText: {
    color: colors.TEXT_GREY,
  },
});

export default AppButton;
