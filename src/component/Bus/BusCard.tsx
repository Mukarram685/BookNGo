import React from 'react';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { scale, verticalScale } from 'react-native-size-matters';
import { useNavigation } from '@react-navigation/native';
import AppText from '../common/AppText';
import Colors, { alpha } from '../../utils/Colors.util';
import { BusSchedule } from '../../interface/bus.interface';
import { Bus as BusIcon, Wifi, Charger, Food, Drink, Seat, AC } from '../../assets/svg';

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
            <AppText size={16} weight="800" color={Colors.PRIMARY} numberOfLines={1}>
              {item.busName}
            </AppText>
            <View style={styles.classBadge}>
              <AppText size={10} weight="600" color={Colors.SECONDARY}>
                {item.busType}
              </AppText>
            </View>
          </View>
        </View>

        <View style={styles.priceContainer}>
          <AppText size={18} weight="800" color={Colors.PRIMARY}>
            Rs. {item.price.toLocaleString()}
          </AppText>
          <AppText size={11} color={Colors.DARK_GRAY} weight="500">
            Per seat
          </AppText>
        </View>
      </View>

      <View style={styles.routeRow}>
        <View style={styles.timeLocContainer}>
          <AppText size={18} weight="800" color={Colors.PRIMARY}>
            {item.departureTime}
          </AppText>
          <AppText size={12} color={Colors.DARK_GRAY} weight="500" numberOfLines={1}>
            {item.fromCity}
          </AppText>
        </View>

        <View style={styles.durationContainer}>
          <AppText size={11} weight="700" color={Colors.TEXT_GREY} style={{ marginBottom: 4 }}>
            {item.duration}
          </AppText>
          <View style={styles.lineGraphic}>
            <View style={styles.dot} />
            <View style={styles.line} />
            <View style={styles.dot} />
          </View>
          <AppText size={11} weight="700" color={Colors.SECONDARY} style={{ marginTop: 4 }}>
            Direct
          </AppText>
        </View>

        <View style={[styles.timeLocContainer, { alignItems: 'flex-end' }]}>
          <AppText size={18} weight="800" color={Colors.PRIMARY}>
            {item.arrivalTime}
          </AppText>
          <AppText size={12} color={Colors.DARK_GRAY} weight="500" numberOfLines={1}>
            {item.toCity}
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
                <View key={i} style={{ marginRight: scale(10) }}>
                  <Icon width={scale(18)} height={scale(18)} color={Colors.PRIMARY} />
                </View>
              );
            })}
          </View>

          {item.seatsAvailable < 10 && (
            <AppText size={10} weight="600" color="#FF6B00" style={{ marginTop: verticalScale(5) }}>
              Only {item.seatsAvailable} seats left at this price!
            </AppText>
          )}
        </View>

        <TouchableOpacity
          style={styles.selectButton}
          activeOpacity={0.8}
          onPress={handleBookPress}
        >
          <AppText size={14} weight="700" color={Colors.WHITE}>
            Select
          </AppText>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: Colors.SURFACE,
    borderRadius: scale(20),
    padding: scale(18),
    marginVertical: verticalScale(10),
    marginHorizontal: scale(16),
    shadowColor: Colors.PRIMARY,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
    borderWidth: 1,
    borderColor: Colors.BORDER_GREY,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: verticalScale(18),
  },
  companyInfoContainer: {
    flexDirection: 'row',
    flex: 1,
    marginRight: scale(10),
  },
  logo: {
    width: scale(44),
    height: scale(44),
    borderRadius: scale(10),
    backgroundColor: Colors.BACKGROUND,
    marginRight: scale(12),
  },
  nameAndClass: {
    justifyContent: 'center',
  },
  classBadge: {
    backgroundColor: alpha(Colors.SECONDARY, 0.1),
    paddingHorizontal: scale(8),
    paddingVertical: verticalScale(2),
    borderRadius: scale(6),
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
    marginBottom: verticalScale(18),
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
    borderColor: Colors.SECONDARY,
    backgroundColor: Colors.WHITE,
  },
  line: {
    flex: 1,
    height: 1.5,
    backgroundColor: Colors.BORDER_GREY,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.BORDER_GREY,
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
    backgroundColor: Colors.SECONDARY,
    paddingVertical: verticalScale(12),
    paddingHorizontal: scale(32),
    borderRadius: scale(12),
    shadowColor: Colors.SECONDARY,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4,
  },
});

export default BusCard;
