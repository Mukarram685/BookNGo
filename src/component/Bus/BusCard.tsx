import React from 'react';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { scale, verticalScale } from 'react-native-size-matters';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import AppText from '../common/AppText';
import Colors from '../../utils/Colors.util';
import { BusSchedule } from '../../interface/bus.interface';
import { Wifi, Charger, Food, Drink, Seat, AC } from '../../assets/svg';

interface BusCardProps {
  item: BusSchedule;
  onBookPress: (item: BusSchedule) => void;
}

const amenityIcons: Record<string, React.FC<any>> = {
  'Wifi': Wifi,
  'Charging Point': Charger,
  'Food': Food,
  'Water': Drink,
  'Comfortable Seats': Seat,
  'AC': AC,
  'Snacks': Food,
  'Water Bottle': Drink,
};

const BusCard = ({ item }: BusCardProps) => {
  const navigation = useNavigation<any>();
  const { t } = useTranslation();

  const handleBookPress = () => {
    navigation.navigate('SeatSelection', { schedule: item });
  };

  return (
    <View style={styles.cardContainer}>
      <View style={styles.headerRow}>
        <View style={styles.companyInfoContainer}>
          <Image
            source={
              item.image
                ? { uri: item.image }
                : require('../../assets/png/buslogo-removebg-preview.png')
            }
            style={styles.logo}
            resizeMode="cover"
          />
          <View style={styles.nameAndClass}>
            <AppText size={16} weight="700" color={Colors.WHITE} numberOfLines={1}>
              {item.busName}
            </AppText>
            <View style={styles.classBadge}>
              <AppText size={10} weight="500" color={Colors.GREEN_TEXT}>
                {item.busType}
              </AppText>
            </View>
          </View>
        </View>

        <View style={styles.priceContainer}>
          <AppText size={18} weight="700" color={Colors.BRIGHT_BLUE}>
            {'Rs. ' + item.price.toLocaleString()}
          </AppText>
          <AppText size={10} color={Colors.TEXT_GREY}>
            {t('busCard_perSeat')}
          </AppText>
        </View>
      </View>

      <View style={styles.routeRow}>
        <View style={styles.timeLocContainer}>
          <AppText size={18} weight="700" color={Colors.WHITE}>
            {item.departureTime}
          </AppText>
          <AppText size={12} color={Colors.TEXT_GREY} numberOfLines={1}>
            {t('busCard_terminal', { city: item.fromCity })}
          </AppText>
        </View>

        <View style={styles.durationContainer}>
          <AppText size={10} weight="600" color={Colors.TEXT_GREY} style={{ marginBottom: 4 }}>
            {item.duration}
          </AppText>
          <View style={styles.lineGraphic}>
            <View style={styles.dot} />
            <View style={styles.line} />
            <View style={styles.dot} />
          </View>
          <AppText size={10} weight="600" color={Colors.BRIGHT_BLUE} style={{ marginTop: 4 }}>
            {t('busCard_direct')}
          </AppText>
        </View>

        <View style={[styles.timeLocContainer, { alignItems: 'flex-end' }]}>
          <AppText size={18} weight="700" color={Colors.WHITE}>
            {item.arrivalTime}
          </AppText>
          <AppText size={12} color={Colors.TEXT_GREY} numberOfLines={1}>
            {t('busCard_terminal', { city: item.toCity })}
          </AppText>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.footerRow}>
        <View style={styles.leftFooter}>
          <View style={styles.amenitiesContainer}>
            {item.amenities && item.amenities.map((amenity, i) => {
              const Icon = amenityIcons[amenity];
              if (!Icon) return null;
              return (
                <View key={i} style={{ marginRight: scale(8), opacity: 0.8 }}>
                  <Icon width={scale(16)} height={scale(16)} />
                </View>
              );
            })}
          </View>

          {item.seatsAvailable < 10 && (
            <AppText size={10} weight="600" color="#FF6B00" style={{ marginTop: verticalScale(5) }}>
              {t('busCard_seatsLeft', { count: item.seatsAvailable })}
            </AppText>
          )}
        </View>

        <TouchableOpacity
          style={styles.selectButton}
          activeOpacity={0.8}
          onPress={handleBookPress}
        >
          <AppText size={14} weight="700" color={Colors.WHITE}>
            {t('busCard_select')}
          </AppText>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: Colors.INPUT_BG,
    borderRadius: scale(16),
    padding: scale(16),
    marginVertical: verticalScale(8),
    shadowColor: Colors.BLACK,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: verticalScale(20),
  },
  companyInfoContainer: {
    flexDirection: 'row',
    flex: 1,
    marginRight: scale(10),
  },
  logo: {
    width: scale(40),
    height: scale(40),
    borderRadius: scale(8),
    backgroundColor: Colors.WHITE,
    marginRight: scale(12),
  },
  nameAndClass: {
    justifyContent: 'center',
  },
  classBadge: {
    backgroundColor: '#E0F2F1',
    paddingHorizontal: scale(6),
    paddingVertical: verticalScale(2),
    borderRadius: scale(4),
    alignSelf: 'flex-start',
    marginTop: verticalScale(4),
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  routeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: verticalScale(20),
  },
  timeLocContainer: {
    flex: 1,
  },
  durationContainer: {
    flex: 2,
    alignItems: 'center',
    paddingHorizontal: scale(10),
  },
  lineGraphic: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  dot: {
    width: scale(8),
    height: scale(8),
    borderRadius: scale(4),
    borderWidth: 1.5,
    borderColor: Colors.BRIGHT_BLUE,
    backgroundColor: Colors.INPUT_BG,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.TEXT_GREY,
    opacity: 0.5,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.TEXT_GREY,
    opacity: 0.1,
    marginBottom: verticalScale(15),
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  leftFooter: {
    flex: 1,
    justifyContent: 'center',
  },
  amenitiesContainer: {
    flexDirection: 'row',
    marginBottom: verticalScale(4),
  },
  selectButton: {
    backgroundColor: Colors.BRIGHT_BLUE,
    paddingVertical: verticalScale(10),
    paddingHorizontal: scale(30),
    borderRadius: scale(10),
  },
});

export default BusCard;
