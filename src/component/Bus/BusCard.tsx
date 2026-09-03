import React from 'react';
import { View, StyleSheet, Image, FlatList, ScrollView } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { scale, verticalScale } from 'react-native-size-matters';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import AppText from '../common/AppText';
import AppButton from '../common/AppButton';
import { BusSchedule } from '../../interface/bus.interface';
import {
  Bus as BusIcon,
  Wifi,
  AC,
  Seat,
  Charger,
  Food,
  Drink,
  TV,
  LocationB,
} from '../../assets/svg';
import colors from '../../utils/colors';

interface BusCardProps {
  item: BusSchedule;
  onBookPress?: (item: BusSchedule) => void;
}

const getAmenityIcon = (name: string) => {
  if (!name) return null;
  const lower = name.toLowerCase();
  if (lower.includes('wifi') || lower.includes('wi-fi') || lower.includes('internet')) return Wifi;
  if (lower.includes('ac') || lower.includes('air') || lower.includes('cool')) return AC;
  if (lower.includes('charg') || lower.includes('power') || lower.includes('usb') || lower.includes('plug')) return Charger;
  if (lower.includes('tv') || lower.includes('television') || lower.includes('screen') || lower.includes('media')) return TV;
  if (lower.includes('food') || lower.includes('snack') || lower.includes('meal') || lower.includes('refreshment')) return Food;
  if (lower.includes('water') || lower.includes('drink') || lower.includes('bottle') || lower.includes('beverage')) return Drink;
  if (lower.includes('seat') || lower.includes('reclin') || lower.includes('sleep') || lower.includes('layout')) return Seat;
  return null;
};

const BusCard = ({ item }: BusCardProps) => {
  const { t } = useTranslation();
  const navigation = useNavigation<any>();

  const handleBookPress = () => {
    navigation.navigate('SeatSelection', { schedule: item });
  };

  const formattedPrice = (item.price || 0).toLocaleString();
  const amenitiesList = Array.isArray(item.amenities) ? item.amenities : [];
  const seatLayoutText = item.seatLayout ? `${item.seatLayout} Seats` : '2x2 Seats';

  return (
    <View style={styles.cardContainer}>
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
            <AppText size={16} weight="800" color={colors.SLATE_DARK} numberOfLines={1}>
              {item.busName || 'Test Express 314'}
            </AppText>
            <View style={styles.luxuryBadge}>
              <AppText size={11} weight="700" color={colors.BLUE_PRIMARY}>
                {item.busType || 'Luxury'}
              </AppText>
            </View>
          </View>
        </View>

        <View style={styles.priceContainer}>
          <AppText size={18} weight="900" color={colors.BLUE_PRIMARY} numberOfLines={1}>
            Rs. {formattedPrice}
          </AppText>
          <AppText size={11} color={colors.SLATE_MUTED} weight="500" style={{ marginTop: 1 }}>
            {t('per_seat') || 'Per seat'}
          </AppText>
        </View>
      </View>

      <View style={styles.innerRouteBox}>
        <View style={styles.routeRow}>
          <View style={styles.timeLocContainer}>
            <AppText size={17} weight="900" color={colors.SLATE_DARK}>
              {item.departureTime || '08:00 AM'}
            </AppText>
            <AppText size={13} color={colors.SLATE_MEDIUM} weight="600" numberOfLines={1} style={{ marginTop: 2 }}>
              {item.fromCity || 'Lahore'}
            </AppText>
            <View style={styles.terminalRow}>
              <LocationB width={scale(11)} height={scale(11)} color={colors.SLATE_MUTED} />
              <AppText size={10} color={colors.SLATE_MUTED} weight="500" numberOfLines={1} style={{ marginLeft: 3 }}>
                {item.fromCity || 'Lahore'} Terminal
              </AppText>
            </View>
          </View>

          <View style={styles.durationContainer}>
            <View style={styles.durationPill}>
              <AppText size={10} weight="700" color={colors.SLATE_MEDIUM}>
                {item.duration || '4h'}
              </AppText>
            </View>

            <View style={styles.routeLineWrap}>
              <Svg width="100%" height={24} viewBox="0 0 100 24">
                <Circle cx="4" cy="12" r="3" fill={colors.WHITE} stroke={colors.BLUE_PRIMARY} strokeWidth={2} />
                <Path d="M10 12 H42" stroke={colors.BLUE_BORDER} strokeWidth={1.5} strokeDasharray="3,3" />
                <Circle cx="50" cy="12" r="10" fill={colors.BLUE_LIGHT_BG} />
                <Path d="M58 12 H90" stroke={colors.BLUE_BORDER} strokeWidth={1.5} strokeDasharray="3,3" />
                <Circle cx="96" cy="12" r="3" fill={colors.WHITE} stroke={colors.BLUE_PRIMARY} strokeWidth={2} />
              </Svg>
              <View style={styles.busIconBadge}>
                <BusIcon width={scale(11)} height={scale(11)} color={colors.BLUE_PRIMARY} />
              </View>
            </View>

            <AppText size={11} weight="700" color={colors.GREEN_SUCCESS} style={{ marginTop: 2 }}>
              {t('direct_route') || 'Direct'}
            </AppText>
          </View>

          <View style={[styles.timeLocContainer, { alignItems: 'flex-end' }]}>
            <AppText size={17} weight="900" color={colors.SLATE_DARK}>
              {item.arrivalTime || '12:00 PM'}
            </AppText>
            <AppText size={13} color={colors.SLATE_MEDIUM} weight="600" numberOfLines={1} style={{ marginTop: 2 }}>
              {item.toCity || 'Karachi'}
            </AppText>
            <View style={styles.terminalRow}>
              <LocationB width={scale(11)} height={scale(11)} color={colors.SLATE_MUTED} />
              <AppText size={10} color={colors.SLATE_MUTED} weight="500" numberOfLines={1} style={{ marginLeft: 3 }}>
                {item.toCity || 'Karachi'} Terminal
              </AppText>
            </View>
          </View>
        </View>

        <View style={styles.footerRow}>
          <View style={styles.amenitiesContainer}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ flexDirection: 'row', alignItems: 'center' }}
            >
              <View style={styles.amenityChip}>
                <Seat width={scale(12)} height={scale(12)} color={colors.BLUE_DARK} />
                <AppText size={11} weight="600" color={colors.BLUE_DARK} style={{ marginLeft: 4 }}>
                  {seatLayoutText}
                </AppText>
              </View>

              <FlatList
                horizontal
                scrollEnabled={false}
                showsHorizontalScrollIndicator={false}
                data={amenitiesList}
                keyExtractor={(amenityName, index) => `${amenityName}-${index}`}
                renderItem={({ item: amenityName }) => {
                  const IconComp = getAmenityIcon(amenityName);
                  return (
                    <View style={styles.amenityChip}>
                      {IconComp ? (
                        <IconComp width={scale(12)} height={scale(12)} color={colors.BLUE_DARK} />
                      ) : null}
                      <AppText size={11} weight="600" color={colors.BLUE_DARK} style={{ marginLeft: IconComp ? 4 : 0 }}>
                        {amenityName}
                      </AppText>
                    </View>
                  );
                }}
              />
            </ScrollView>
          </View>

          <AppButton
            title={t('select_seat') || 'Select Seat'}
            onPress={handleBookPress}
            style={styles.selectButton}
            iconPosition="right"
          />
        </View>
      </View>
    </View>
  );
};

export default BusCard;

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: colors.WHITE,
    borderRadius: scale(18),
    borderLeftWidth: scale(5),
    borderLeftColor: colors.BLUE_PRIMARY,
    borderWidth: 1,
    borderColor: colors.BORDER_GREY,
    padding: scale(14),
    marginVertical: verticalScale(8),
    shadowColor: colors.BLUE_PRIMARY,
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
    borderColor: colors.BORDER_GREY,
    padding: scale(3),
    backgroundColor: colors.WHITE,
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
    backgroundColor: colors.BLUE_LIGHT_BG,
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
    backgroundColor: colors.SLATE_LIGHT,
    borderRadius: scale(14),
    borderWidth: 1,
    borderColor: colors.INPUT_BG,
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
    backgroundColor: colors.BORDER_GREY,
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
    borderTopColor: colors.BORDER_GREY,
  },
  amenitiesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: scale(6),
  },
  amenityChip: {
    backgroundColor: colors.BLUE_LIGHT_BG,
    borderRadius: scale(6),
    paddingHorizontal: scale(7),
    paddingVertical: verticalScale(3),
    marginRight: scale(5),
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectButton: {
    backgroundColor: colors.BLUE_PRIMARY,
    height: verticalScale(38),
    borderRadius: scale(10),
    paddingHorizontal: scale(10),
    paddingVertical: verticalScale(2),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.BLUE_PRIMARY,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
});