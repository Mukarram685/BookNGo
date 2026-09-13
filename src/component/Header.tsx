import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { scale, verticalScale } from 'react-native-size-matters';
import { Back, Hamburger, ShareIcon } from '../assets/svg';
import colors from '../utils/colors';
import SideMenuModal from './common/SideMenuModal';

interface AppHeaderProps {
  showAvatar?: boolean;
  showName?: boolean;
  showLocation?: boolean;
  showSupportButton?: boolean;
  showMenuButton?: boolean;
  showNotificationButton?: boolean;
  showSettingsButton?: boolean;
  showShareButton?: boolean;
  onShare?: () => void;
  title?: string;
  subtitle?: string;
  nameOnly?: boolean;
  backgroundColor?: string;
  paddingBottom?: number;
  borderBottomLeftRadius?: number;
  borderBottomRightRadius?: number;
  avatarUrl?: string;
  displayName?: string;
  displayLocation?: string;
  showBack?: boolean;
  onBack?: () => void;
}

const COLOR_TITLE = '#1A1A1A';

export default function Header({
  showAvatar = true,
  showName = true,
  showSupportButton = false,
  showMenuButton,
  showNotificationButton = false,
  showSettingsButton = false,
  showShareButton = false,
  onShare,
  title,
  subtitle,
  nameOnly = false,
  backgroundColor = '',
  paddingBottom = 4,
  borderBottomLeftRadius = 36,
  borderBottomRightRadius = 36,
  avatarUrl,
  displayName,
  showBack = false,
  onBack,
}: AppHeaderProps) {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const authUser = useSelector((state: any) => state.auth.user);
  const [menuVisible, setMenuVisible] = useState(false);

  const resolvedDisplayName =
    displayName || authUser?.name || t('defaultUserName') || 'User';

  const getInitials = (nameStr: string) => {
    if (!nameStr) return 'UN';
    const parts = nameStr.trim().split(' ').filter(Boolean);
    if (parts.length === 0) return 'UN';
    if (parts.length === 1) {
      return parts[0].substring(0, 2).toUpperCase();
    }
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const routeName = route?.name;
  const isAllowedMenuScreen =
    routeName === 'Home' || routeName === 'Bookings' || routeName === 'All';
  const shouldShowMenu =
    showMenuButton !== undefined ? showMenuButton : isAllowedMenuScreen;

  return (
    <View
      style={{
        backgroundColor,
        borderBottomLeftRadius,
        borderBottomRightRadius,
        paddingTop: Platform.OS === 'ios' ? insets.top : insets.top + 10,
        paddingBottom,
      }}
    >
      <View style={styles.container}>
        <View style={styles.rowContainer}>
          {showBack ? (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={onBack || (() => navigation.goBack())}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            >
              <Back color={colors.PRIMARY} />
            </TouchableOpacity>
          ) : (
            showAvatar && (
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => navigation.navigate('Profile')}
              >
                {avatarUrl ? (
                  <Image
                    source={{ uri: avatarUrl }}
                    style={styles.avatar}
                    resizeMode="cover"
                  />
                ) : (
                  <View style={styles.avatarCircle}>
                    <Text style={styles.avatarText}>
                      {getInitials(resolvedDisplayName)}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            )
          )}

          <View
            style={
              !showBack && showAvatar
                ? styles.titleContainerWithAvatar
                : styles.titleContainer
            }
          >
            {showName && (
              <>
                <Text style={styles.title} numberOfLines={1}>
                  {title
                    ? title
                    : nameOnly
                      ? resolvedDisplayName
                      : t('hi_greeting', { name: resolvedDisplayName })}
                </Text>
                {subtitle ? (
                  <Text style={styles.subtitle} numberOfLines={1}>
                    {subtitle}
                  </Text>
                ) : null}
              </>
            )}
          </View>
        </View>

        <View style={styles.actionsRow}>
          {showShareButton && onShare && (
            <TouchableOpacity
              style={styles.shareButton}
              activeOpacity={0.7}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              onPress={onShare}
            >
              <ShareIcon width={scale(18)} height={scale(18)} color={colors.PRIMARY} />
            </TouchableOpacity>
          )}

          {shouldShowMenu && (
            <TouchableOpacity
              style={styles.menuButton}
              activeOpacity={0.7}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              onPress={() => setMenuVisible(true)}
            >
              <View pointerEvents="none">
                <Hamburger width={scale(20)} height={scale(20)} />
              </View>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <SideMenuModal
        visible={menuVisible}
        onClose={() => setMenuVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  actionsRow: {
    alignItems: 'center',
    columnGap: scale(8),
    flexDirection: 'row',
  },
  shareButton: {
    alignItems: 'center',
    backgroundColor: colors.WHITE,
    borderColor: colors.BORDER_GREY,
    borderRadius: scale(20),
    borderWidth: 1,
    height: scale(40),
    justifyContent: 'center',
    shadowColor: colors.BLACK,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
    width: scale(40),
  },
  avatar: {
    borderColor: colors.WHITE,
    borderRadius: scale(24),
    borderWidth: 1,
    height: scale(48),
    width: scale(48),
  },
  avatarCircle: {
    alignItems: 'center',
    backgroundColor: colors.PRIMARY,
    borderColor: colors.WHITE,
    borderRadius: scale(24),
    borderWidth: 2,
    height: scale(48),
    justifyContent: 'center',
    shadowColor: colors.BLACK,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    width: scale(48),
  },
  avatarText: {
    color: colors.WHITE,
    fontSize: scale(18),
    fontWeight: '800',
  },
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: scale(10),
  },
  menuButton: {
    alignItems: 'center',
    backgroundColor: colors.WHITE,
    borderColor: colors.BORDER_GREY,
    borderRadius: scale(22),
    borderWidth: 1,
    height: scale(44),
    justifyContent: 'center',
    shadowColor: colors.BLACK,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
    width: scale(44),
  },
  rowContainer: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    marginRight: scale(8),
  },
  title: {
    color: COLOR_TITLE,
    fontSize: scale(19),
    fontWeight: '800',
    marginLeft: scale(4),
  },
  subtitle: {
    color: '#6B7280',
    fontSize: scale(12),
    fontWeight: '500',
    marginTop: verticalScale(2),
    marginLeft: scale(4),
  },
  titleContainer: {
    flex: 1,
    marginLeft: scale(4),
  },
  titleContainerWithAvatar: {
    flex: 1,
    marginLeft: scale(12),
  },
});
