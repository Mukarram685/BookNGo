import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { scale, verticalScale } from 'react-native-size-matters';
import { HeadPhoneB, LocationB } from '../assets/svg';
import Colors from '../utils/Colors.util';

interface AppHeaderProps {
  showAvatar?: boolean;
  showName?: boolean;
  showLocation?: boolean;
  showSupportButton?: boolean;
  showNotificationButton?: boolean;
  title?: string;
  nameOnly?: boolean;
  backgroundColor?: string;
  paddingBottom?: number;
  borderBottomLeftRadius?: number;
  borderBottomRightRadius?: number;
  avatarUrl?: string;
  displayName?: string;
  displayLocation?: string;
}

const COLOR_LOCATION = '#6B7280';
const COLOR_TITLE = '#1A1A1A';

export default function Header({
  showAvatar = true,
  showName = true,
  showLocation = true,
  showSupportButton = true,
  title,
  nameOnly = false,
  backgroundColor = '',
  paddingBottom = 4,
  borderBottomLeftRadius = 36,
  borderBottomRightRadius = 36,
  avatarUrl,
  displayName,
  displayLocation,
}: AppHeaderProps) {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const resolvedDisplayName = displayName ?? t('defaultUserName');
  const resolvedDisplayLocation = displayLocation ?? t('defaultUserLocation');

  const finalAvatar = avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80';

  return (
    <View
      style={{
        backgroundColor,
        borderBottomLeftRadius,
        borderBottomRightRadius,
        paddingTop: insets.top + 16,
        paddingBottom,
      }}
    >
      <View style={styles.container}>
        <View style={styles.rowContainer}>
          {showAvatar && (
            <Image
              source={{ uri: finalAvatar }}
              style={styles.avatar}
              resizeMode="cover"
            />
          )}
          
          <View style={showAvatar ? styles.titleContainerWithAvatar : styles.titleContainer}>
            {showName && (
              <Text style={styles.title}>
                {title ? title : (nameOnly ? resolvedDisplayName : t('greetingWithName', { name: resolvedDisplayName }))}
              </Text>
            )}
            
            {showLocation && (
              <View style={styles.locationRow}>
                <LocationB width={14} height={14} color={Colors.PRIMARY} />
                <Text style={styles.locationText}>
                  {resolvedDisplayLocation}
                </Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.actionsRow}>
          {showSupportButton && (
            <TouchableOpacity
              style={styles.supportButton}
              activeOpacity={0.7}
              onPress={() => navigation.navigate('HelpSupportScreen')}
            >
              <HeadPhoneB width={22} height={22} color={Colors.PRIMARY} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  actionsRow: {
    alignItems: 'center',
    columnGap: scale(8),
    flexDirection: 'row',
  },
  avatar: {
    borderColor: Colors.WHITE,
    borderRadius: scale(28),
    borderWidth: 1,
    height: scale(56),
    width: scale(56),
  },
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: scale(16),
  },
  locationRow: {
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: verticalScale(4),
  },
  locationText: {
    color: COLOR_LOCATION,
    fontSize: scale(12),
    marginLeft: scale(4),
  },
  rowContainer: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    marginRight: scale(8),
  },
  supportButton: {
    alignItems: 'center',
    backgroundColor: Colors.WHITE,
    borderColor: Colors.BORDER_GREY,
    borderRadius: scale(22),
    borderWidth: 1,
    height: scale(44),
    justifyContent: 'center',
    shadowColor: Colors.BLACK,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    width: scale(44),
  },
  title: {
    color: COLOR_TITLE,
    fontSize: scale(20),
    fontWeight: '800',
  },
  titleContainer: {
    marginLeft: 0,
  },
  titleContainerWithAvatar: {
    marginLeft: scale(12),
  },
});
