import React from 'react';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { scale, verticalScale } from 'react-native-size-matters';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import AppText from '../common/AppText';
import { BusSchedule } from '../../interface/bus.interface';
import { Bus as BusIcon, Wifi, AC, Seat, LocationB, Arrow } from '../../assets/svg';

interface BusCardProps {
  item: BusSchedule;
  onBookPress?: (item: BusSchedule) => void;
}

const BusCard = ({ item }: BusCardProps) => {
  const { t } = useTranslation();
  const navigation = useNavigation<any>();

  const handleBookPress = () => {
    navigation.navigate('SeatSelection', { schedule: item });
  };

  const formattedPrice = (item.price || 0).toLocaleString();
  
  const amenitiesList = item.amenities || [];
  const hasAC = amenitiesList.some(a => a.toLowerCase().includes('ac'));
  const hasWifi = amenitiesList.some(a => a.toLowerCase().includes('wifi'));
  const seatLayoutText = item.seatLayout ? `${item.seatLayout} Seats` : '2x2 Seats';
  
  const extraCount = Math.max(0, amenitiesList.length - (hasAC ? 1 : 0) - (hasWifi ? 1 : 0));

  return (
    <View style={styles.cardContainer}>
      {/* Top Header Section */}
      <View style={styles.headerRow}>
        <View style={styles.companyInfoContainer}>
          <View style={styles.logoBox}>
            <Image
              source={
                item.image
                  ? { uri: item.image }
                  : require('../../assets/png/buslogo-removebg-preview.png')
              }
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
          <View style={styles.nameAndClass}>
            <AppText size={16} weight="800" color="#0F172A" numberOfLines={1}>
              {item.busName || 'Test Express 314'}
            </AppText>
            <View style={styles.luxuryBadge}>
              <AppText size={10} color="#0052CC" style={{ marginRight: 3 }}>
                👑
              </AppText>
              <AppText size={11} weight="700" color="#0052CC">
                {item.busType || 'Luxury'}
              </AppText>
            </View>
          </View>
        </View>

        <View style={styles.priceContainer}>
          <AppText size={18} weight="900" color="#0052CC" numberOfLines={1}>
            Rs. {formattedPrice}
          </AppText>
          <AppText size={11} color="#64748B" weight="500" style={{ marginTop: 1 }}>
            {t('per_seat') || 'Per seat'}
          </AppText>
        </View>
      </View>

      {/* Inner Route Card Box */}
      <View style={styles.innerRouteBox}>
        <View style={styles.routeRow}>
          {/* Departure */}
          <View style={styles.timeLocContainer}>
            <AppText size={17} weight="900" color="#0F172A">
              {item.departureTime || '08:00 AM'}
            </AppText>
            <AppText size={13} color="#475467" weight="600" numberOfLines={1} style={{ marginTop: 2 }}>
              {item.fromCity || 'Lahore'}
            </AppText>
            <View style={styles.terminalRow}>
              <LocationB width={scale(11)} height={scale(11)} color="#64748B" />
              <AppText size={10} color="#64748B" weight="500" numberOfLines={1} style={{ marginLeft: 3 }}>
                {item.fromCity || 'Lahore'} Terminal
              </AppText>
            </View>
          </View>

          {/* Duration & Route Graphic */}
          <View style={styles.durationContainer}>
            <View style={styles.durationPill}>
              <AppText size={10} weight="700" color="#475467">
                {item.duration || '4h'}
              </AppText>
            </View>

            <View style={styles.routeLineWrap}>
              <Svg width="100%" height={24} viewBox="0 0 100 24">
                <Circle cx="4" cy="12" r="3" fill="#FFFFFF" stroke="#0052CC" strokeWidth={2} />
                <Path d="M10 12 H42" stroke="#B9D5FF" strokeWidth={1.5} strokeDasharray="3,3" />
                <Circle cx="50" cy="12" r="10" fill="#EBF3FF" />
                <Path d="M58 12 H90" stroke="#B9D5FF" strokeWidth={1.5} strokeDasharray="3,3" />
                <Circle cx="96" cy="12" r="3" fill="#FFFFFF" stroke="#0052CC" strokeWidth={2} />
              </Svg>
              <View style={styles.busIconBadge}>
                <BusIcon width={scale(11)} height={scale(11)} color="#0052CC" />
              </View>
            </View>

            <AppText size={11} weight="700" color="#16A34A" style={{ marginTop: 2 }}>
              {t('direct_route') || 'Direct'}
            </AppText>
          </View>

          {/* Arrival */}
          <View style={[styles.timeLocContainer, { alignItems: 'flex-end' }]}>
            <AppText size={17} weight="900" color="#0F172A">
              {item.arrivalTime || '12:00 PM'}
            </AppText>
            <AppText size={13} color="#475467" weight="600" numberOfLines={1} style={{ marginTop: 2 }}>
              {item.toCity || 'Karachi'}
            </AppText>
            <View style={styles.terminalRow}>
              <LocationB width={scale(11)} height={scale(11)} color="#64748B" />
              <AppText size={10} color="#64748B" weight="500" numberOfLines={1} style={{ marginLeft: 3 }}>
                {item.toCity || 'Karachi'} Terminal
              </AppText>
            </View>
          </View>
        </View>

        {/* Footer inside Route Box */}
        <View style={styles.footerRow}>
          <View style={styles.amenitiesContainer}>
            {/* Seat Layout */}
            <View style={styles.amenityChip}>
              <Seat width={scale(12)} height={scale(12)} color="#1E40AF" />
              <AppText size={11} weight="600" color="#1E40AF" style={{ marginLeft: 4 }}>
                {seatLayoutText}
              </AppText>
            </View>

            {/* AC */}
            <View style={styles.amenityChip}>
              <AC width={scale(12)} height={scale(12)} color="#1E40AF" />
              <AppText size={11} weight="600" color="#1E40AF" style={{ marginLeft: 4 }}>
                AC
              </AppText>
            </View>

            {/* Wi-Fi */}
            <View style={styles.amenityChip}>
              <Wifi width={scale(12)} height={scale(12)} color="#1E40AF" />
              <AppText size={11} weight="600" color="#1E40AF" style={{ marginLeft: 4 }}>
                Wi-Fi
              </AppText>
            </View>

            {extraCount > 0 && (
              <View style={styles.extraChip}>
                <AppText size={11} weight="600" color="#64748B">
                  +{extraCount} More
                </AppText>
              </View>
            )}
          </View>

          <TouchableOpacity
            style={styles.selectButton}
            activeOpacity={0.85}
            onPress={handleBookPress}
          >
            <AppText size={13} weight="800" color="#FFFFFF">
              {t('select_seat') || 'Select Seat'}
            </AppText>
            <Arrow
              width={scale(12)}
              height={scale(12)}
              fill="#FFFFFF"
              style={{ transform: [{ rotate: '180deg' }], marginLeft: scale(6) }}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: scale(18),
    borderLeftWidth: scale(5),
    borderLeftColor: '#0052CC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: scale(14),
    marginVertical: verticalScale(8),
    shadowColor: '#0052CC',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: verticalScale(12),
  },
  companyInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: scale(8),
  },
  logoBox: {
    width: scale(48),
    height: scale(48),
    borderRadius: scale(12),
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: scale(3),
    backgroundColor: '#FFFFFF',
    marginRight: scale(10),
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: '100%',
    height: '100%',
  },
  nameAndClass: {
    justifyContent: 'center',
    flex: 1,
  },
  luxuryBadge: {
    backgroundColor: '#EBF3FF',
    paddingHorizontal: scale(7),
    paddingVertical: verticalScale(2),
    borderRadius: scale(6),
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginTop: verticalScale(3),
  },
  priceContainer: {
    alignItems: 'flex-end',
    flexShrink: 0,
    marginLeft: scale(8),
  },
  innerRouteBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: scale(14),
    borderWidth: 1,
    borderColor: '#F1F5F9',
    padding: scale(12),
  },
  routeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  timeLocContainer: {
    flex: 1.2,
  },
  terminalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: verticalScale(4),
  },
  durationContainer: {
    flex: 1.6,
    alignItems: 'center',
    paddingHorizontal: scale(2),
  },
  durationPill: {
    backgroundColor: '#E2E8F0',
    paddingHorizontal: scale(8),
    paddingVertical: verticalScale(2),
    borderRadius: scale(8),
    marginBottom: verticalScale(2),
  },
  routeLineWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    position: 'relative',
    justifyContent: 'center',
  },
  busIconBadge: {
    position: 'absolute',
    left: '50%',
    marginLeft: -scale(6),
    top: 6,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: verticalScale(12),
    paddingTop: verticalScale(10),
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  amenitiesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    flex: 1,
    marginRight: scale(6),
  },
  amenityChip: {
    backgroundColor: '#EFF6FF',
    borderRadius: scale(6),
    paddingHorizontal: scale(7),
    paddingVertical: verticalScale(3),
    marginRight: scale(5),
    marginBottom: verticalScale(2),
    flexDirection: 'row',
    alignItems: 'center',
  },
  extraChip: {
    backgroundColor: '#F1F5F9',
    borderRadius: scale(6),
    paddingHorizontal: scale(6),
    paddingVertical: verticalScale(3),
    marginBottom: verticalScale(2),
  },
  selectButton: {
    backgroundColor: '#0052CC',
    borderRadius: scale(10),
    paddingHorizontal: scale(14),
    paddingVertical: verticalScale(9),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0052CC',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
});

export default BusCard;