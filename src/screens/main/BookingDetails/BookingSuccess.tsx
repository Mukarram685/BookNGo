import React, { useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Platform, PermissionsAndroid } from 'react-native';
import { scale, verticalScale } from 'react-native-size-matters';
import { useNavigation, useRoute } from '@react-navigation/native';
import ViewShot from 'react-native-view-shot';
import RNFS from 'react-native-fs';
import Share from 'react-native-share';
import ScreenWrapper from '../../../component/common/ScreenWrapper';
import AppText from '../../../component/common/AppText';
import Header from '../../../component/Header';
import Colors, { alpha } from '../../../utils/Colors.util';
import { TicketDetails } from '../../../interface/booking.interface';

const BookingSuccess = () => {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const { ticket }: { ticket: TicketDetails } = route.params;
    const viewShotRef = useRef<any>(null);

    const requestPermission = async () => {
        if (Platform.OS === 'android') {
            try {
                await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
                );
            } catch (err) {
                console.warn(err);
            }
        }
    };

    const shareTicket = async () => {
        try {
            await requestPermission();
            const uri = await viewShotRef.current.capture();

            const options = {
                title: 'BookNGo Ticket',
                url: uri,
                type: 'image/png',
            };
            await Share.open(options);
        } catch (error) {
            console.log('Error sharing ticket:', error);
        }
    };

    return (
        <ScreenWrapper backgroundColor={Colors.DARK_BG} header={<Header title="Booking Confirmed" showBack={false} />}>
            <View style={styles.container}>
                <ViewShot ref={viewShotRef} options={{ format: 'png', quality: 0.9 }}>
                    <View style={styles.ticketCard}>
                        <View style={styles.successHeader}>
                            <AppText size={40} align="center">✅</AppText>
                            <AppText size={22} weight="800" color={Colors.WHITE} align="center">Success!</AppText>
                            <AppText size={12} color={Colors.TEXT_GREY} align="center">Your trip is booked.</AppText>
                        </View>

                        <View style={styles.divider} />

                        <View style={styles.pnrSection}>
                            <AppText size={10} weight="700" color={Colors.TEXT_GREY} align="center">PNR NUMBER</AppText>
                            <AppText size={32} weight="900" color={Colors.BRIGHT_BLUE} align="center" style={styles.pnrText}>
                                {ticket.pnr}
                            </AppText>
                        </View>

                        <View style={styles.detailsList}>
                            <DetailRow label="Route" value={`${ticket.fromCity} → ${ticket.toCity}`} />
                            <DetailRow label="Date" value={ticket.travelDate} />
                            <DetailRow label="Time" value={ticket.departureTime} />
                            <DetailRow label="Bus" value={ticket.busNumber} />
                            <DetailRow label="Seats" value={ticket.passengers.map(p => p.seatNumber).join(', ')} />
                        </View>
                    </View>
                </ViewShot>

                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.shareBtn} onPress={shareTicket}>
                        <AppText size={16} weight="700" color={Colors.WHITE}>Share Ticket</AppText>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.homeBtn}
                        onPress={() => navigation.navigate('Home')}
                    >
                        <AppText size={16} weight="700" color={Colors.BRIGHT_BLUE}>Back to Home</AppText>
                    </TouchableOpacity>
                </View>
            </View>
        </ScreenWrapper>
    );
};

const DetailRow = ({ label, value }: { label: string; value: string }) => (
    <View style={styles.detailRow}>
        <AppText color={Colors.TEXT_GREY} size={12}>{label}</AppText>
        <AppText color={Colors.WHITE} size={14} weight="600">{value}</AppText>
    </View>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: scale(20),
        paddingTop: verticalScale(20),
    },
    ticketCard: {
        backgroundColor: '#162136',
        borderRadius: scale(20),
        padding: scale(20),
        borderWidth: 1,
        borderColor: alpha(Colors.WHITE, 0.1),
    },
    successHeader: {
        alignItems: 'center',
        marginBottom: verticalScale(20),
    },
    divider: {
        height: 1,
        backgroundColor: alpha(Colors.WHITE, 0.1),
        marginVertical: verticalScale(20),
        borderStyle: 'dashed',
        borderWidth: 1,
        borderRadius: 1,
    },
    pnrSection: {
        marginBottom: verticalScale(25),
    },
    pnrText: {
        letterSpacing: scale(2),
    },
    detailsList: {
        gap: verticalScale(12),
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    buttonContainer: {
        marginTop: verticalScale(40),
        gap: verticalScale(15),
    },
    shareBtn: {
        backgroundColor: Colors.BRIGHT_BLUE,
        paddingVertical: verticalScale(14),
        borderRadius: scale(12),
        alignItems: 'center',
    },
    homeBtn: {
        paddingVertical: verticalScale(14),
        alignItems: 'center',
    },
});

export default BookingSuccess;
