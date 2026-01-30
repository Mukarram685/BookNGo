import React from 'react';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { scale, verticalScale } from 'react-native-size-matters';
import AppText from '../common/AppText';
import Colors from '../../utils/Colors.util';
import { BusSchedule } from '../../interface/bus.interface';
import { Bus as BusIcon } from '../../assets/svg';

interface BusCardProps {
  item: BusSchedule;
  onBookPress: (item: BusSchedule) => void;
}

const BusCard = ({ item, onBookPress }: BusCardProps) => {
  return (
    <View style={styles.cardContainer}>
      <View style={styles.headerRow}>
        <View
          style={[
            styles.statusBadge,
            {
              backgroundColor:
                item.status === 'AVAILABLE' ? Colors.BRIGHT_BLUE : Colors.RED,
            },
          ]}
        >
          <AppText size={10} weight="700" color={Colors.WHITE}>
            {item.status}
          </AppText>
        </View>
        <View style={{ backgroundColor: Colors.DARK_GREEN, padding: 4, borderRadius: 4 }}>
          <AppText size={14} color={Colors.WHITE}>
            {new Date(item.date).toDateString()}
          </AppText>
        </View>
      </View>
      <View style={styles.divider} />

      <View style={styles.routeRow}>
        <AppText size={20} weight="700" color={Colors.WHITE}>
          {item.fromCity}
        </AppText>
        <View style={styles.busIconContainer}>
          <BusIcon width={scale(20)} height={scale(20)} fill={Colors.WHITE} />
        </View>
        <AppText size={20} weight="700" color={Colors.WHITE}>
          {item.toCity}
        </AppText>
      </View>

      <View style={{ alignItems: 'center', marginBottom: verticalScale(5) }}>
        <AppText size={16} weight="600" color={Colors.BRIGHT_BLUE}>
          {item.busName}
        </AppText>
      </View>

      <View style={styles.bodyRow}>
        <Image
          source={
            item.image
              ? { uri: item.image }
              : require('../../assets/png/buslogo-removebg-preview.png')
          }
          style={styles.busImage}
          resizeMode="contain"
        />

        <View style={styles.detailsColumn}>
          <DetailItem label="Departure" value={item.departureTime} />
          <DetailItem label="Arrival" value={item.arrivalTime} />
          <DetailItem label="Duration" value={item.duration} />
          <DetailItem
            label="Seats Available"
            value={`${item.seatsAvailable}`}
          />
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.footerRow}>
        <View style={styles.footerInfo}>
          <AppText size={12} color={Colors.WHITE} style={styles.amenityText}>
            {item.busType}
          </AppText>
          {item.amenities && item.amenities.length > 0 && (
            <AppText size={12} color={Colors.WHITE} style={styles.amenityText}>
              • {item.amenities.join(', ')}
            </AppText>
          )}
          <AppText
            size={18}
            weight="700"
            color={Colors.WHITE}
            style={styles.priceText}
          >
            PKR {item.price.toFixed(2)}
          </AppText>
        </View>

        <TouchableOpacity
          style={styles.bookButton}
          activeOpacity={0.8}
          onPress={() => onBookPress(item)}
        >
          <AppText size={14} weight="700" color={Colors.WHITE}>
            Book Now
          </AppText>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const DetailItem = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.detailItem}>
    <AppText size={12} color={Colors.TEXT_GREY} style={{ width: scale(90) }}>
      {label}:
    </AppText>
    <AppText size={12} weight="600" color={Colors.WHITE}>
      {value}
    </AppText>
  </View>
);

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: Colors.INPUT_BG,
    borderRadius: scale(15),
    padding: scale(15),
    marginVertical: verticalScale(10),
    shadowColor: Colors.BLACK,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#2A3C52',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: verticalScale(10),
  },
  statusBadge: {
    paddingHorizontal: scale(8),
    paddingVertical: verticalScale(4),
    borderRadius: scale(5),
  },
  routeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: verticalScale(5),
  },
  busIconContainer: {
    marginHorizontal: scale(10),
  },
  bodyRow: {
    flexDirection: 'row',
    marginBottom: verticalScale(10),
  },
  busImage: {
    width: scale(100),
    height: verticalScale(80),
    marginRight: scale(10),
  },
  detailsColumn: {
    flex: 1,
    justifyContent: 'space-around',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: Colors.TEXT_GREY,
    opacity: 0.2,
    marginBottom: verticalScale(5),
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerInfo: {
    flex: 1,
  },
  amenityText: {
    marginBottom: verticalScale(4),
  },
  priceText: {
    marginTop: verticalScale(4),
  },
  bookButton: {
    backgroundColor: '#FF6B00',
    paddingHorizontal: scale(20),
    paddingVertical: verticalScale(10),
    borderRadius: scale(8),
  },
});

export default BusCard;
