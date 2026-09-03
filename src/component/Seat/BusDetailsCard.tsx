import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { scale, verticalScale } from 'react-native-size-matters';
import AppText from '../common/AppText';
import colors, { Colors } from '../../utils/colors';
import { Wifi, Charger, AC, Food, Drink, Seat, Bus } from '../../assets/svg';

interface BusDetailsCardProps {
    amenities?: string[];
}

const getAmenityIcon = (name: string) => {
    if (!name) return null;
    const lower = name.toLowerCase();
    if (lower.includes('wifi') || lower.includes('wi-fi') || lower.includes('internet')) return Wifi;
    if (lower.includes('ac') || lower.includes('air') || lower.includes('cool')) return AC;
    if (lower.includes('charg') || lower.includes('power') || lower.includes('usb') || lower.includes('plug')) return Charger;
    if (lower.includes('food') || lower.includes('snack') || lower.includes('meal') || lower.includes('refreshment')) return Food;
    if (lower.includes('water') || lower.includes('drink') || lower.includes('bottle') || lower.includes('beverage')) return Drink;
    if (lower.includes('seat') || lower.includes('reclin') || lower.includes('sleep') || lower.includes('layout')) return Seat;
    return null;
};

export const BusDetailsCard: React.FC<BusDetailsCardProps> = ({ amenities = [] }) => {
    const listToRender = amenities.length > 0 ? amenities : ['Free WiFi', 'USB Charging', 'Air Conditioning', 'Comfortable Seats'];

    return (
        <View style={styles.detailsCard}>
            <View style={styles.detailsHeader}>
                <Bus width={scale(20)} height={scale(20)} fill={colors.PRIMARY} />
                <AppText size={16} weight="700" color={colors.PRIMARY} style={{ marginLeft: scale(8) }}>
                    Bus Details & Amenities
                </AppText>
            </View>
            
            <FlatList
                data={listToRender}
                scrollEnabled={false}
                numColumns={2}
                keyExtractor={(item, index) => `${item}-${index}`}
                contentContainerStyle={styles.amenitiesGrid}
                renderItem={({ item: amenityName }) => {
                    const IconComp = getAmenityIcon(amenityName);
                    return (
                        <View style={styles.amenityItem}>
                            <View style={styles.amenityIconBox}>
                                {IconComp ? (
                                    <IconComp width={scale(16)} height={scale(16)} fill={colors.DARK_GRAY} />
                                ) : (
                                    <Bus width={scale(16)} height={scale(16)} fill={colors.DARK_GRAY} />
                                )}
                            </View>
                            <AppText size={12} weight="600" color={colors.DARK_GRAY} numberOfLines={1} style={{ flex: 1 }}>
                                {amenityName}
                            </AppText>
                        </View>
                    );
                }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    detailsCard: {
        backgroundColor: colors.SURFACE,
        borderRadius: scale(20),
        padding: scale(18),
        borderWidth: 1,
        borderColor: colors.BORDER_GREY,
        shadowColor: colors.BLACK,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 6,
        elevation: 2,
    },
    detailsHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: verticalScale(15),
    },
    amenitiesGrid: {
        rowGap: verticalScale(12),
    },
    amenityItem: {
        width: '50%',
        flexDirection: 'row',
        alignItems: 'center',
        columnGap: scale(8),
        marginBottom: verticalScale(8),
    },
    amenityIconBox: {
        width: scale(32),
        height: scale(32),
        borderRadius: scale(8),
        backgroundColor: '#F1F5F9',
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default BusDetailsCard;
