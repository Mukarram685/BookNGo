import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Platform, PermissionsAndroid, StatusBar, BackHandler } from 'react-native';
import { scale, verticalScale } from 'react-native-size-matters';
import { useNavigation, useRoute } from '@react-navigation/native';
import ViewShot from 'react-native-view-shot';
import Share from 'react-native-share';
import Svg, { Path, Circle } from 'react-native-svg';
import ScreenWrapper from '../../../component/common/ScreenWrapper';
import AppText from '../../../component/common/AppText';
import Header from '../../../component/Header';
import Colors from '../../../utils/Colors.util';
import { TicketDetails } from '../../../interface/booking.interface';

const SuccessTickIcon = () => (
    <Svg width={scale(56)} height={scale(56)} viewBox="0 0 64 64" fill="none">
        <Circle cx="32" cy="32" r="30" fill="#2CC93C" />
        <Path
            d="M20 32L28 40L44 22"
            stroke={Colors.WHITE}
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </Svg>
);

const BookingSuccess = () => {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const { ticket }: { ticket: TicketDetails } = route.params;
    const viewShotRef = useRef<any>(null);

    // Prevent going back to the review/details stack and redirect to Home
    useEffect(() => {
        // Intercept react-navigation back gestures / actions
        const unsubscribe = navigation.addListener('beforeRemove', (e: any) => {
            if (e.data.action.type === 'GO_BACK') {
                e.preventDefault();
                navigation.navigate('BottomTabs');
            }
        });

        // Intercept Android hardware back button
        const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            navigation.navigate('BottomTabs');
            return true; // Prevent default action
        });

        return () => {
            unsubscribe();
            backHandler.remove();
        };
    }, [navigation]);

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

    const totalAmount = ticket.totalFare;
    console.log('Total Amount:', totalAmount);

    return (
        <ScreenWrapper backgroundColor={Colors.BACKGROUND} header={<Header title="Payment Success" showBack={false} />}>
            <View style={styles.container}>
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                    <ViewShot ref={viewShotRef} options={{ format: 'png', quality: 0.9 }}>
                        <View style={styles.receiptCard}>
                            
                            <View style={styles.successHeader}>
                                <SuccessTickIcon />
                                <AppText size={18} weight="800" color="#2CC93C" style={{ marginTop: verticalScale(12) }}>
                                    Transaction Successful
                                </AppText>
                                <AppText size={28} weight="900" color={Colors.PRIMARY} style={{ marginTop: verticalScale(8) }}>
                                    PKR {totalAmount.toLocaleString()}
                                </AppText>
                                <AppText size={12} color={Colors.TEXT_GREY} weight="600" style={{ marginTop: 2 }}>
                                    Paid to BookNGo Bus Service
                                </AppText>
                            </View>

                            <View style={styles.dashedLine} />

                            {/* PNR & Transaction details */}
                            <View style={styles.detailsList}>
                                <DetailRow label="PNR / Ticket No" value={ticket.pnr} valueColor="#172C6B" valueWeight="800" />
                                <DetailRow label="Bus Route" value={`${ticket.fromCity} → ${ticket.toCity}`} />
                                <DetailRow label="Bus Number" value={ticket.busNumber} />
                                <DetailRow label="Travel Date" value={ticket.travelDate} />
                                <DetailRow label="Departure Time" value={ticket.departureTime} />
                                <DetailRow label="Booked Seats" value={ticket.passengers.map(p => p.seatNumber).join(', ')} />
                                <DetailRow label="Payment Status" value="COMPLETED" valueColor="#2CC93C" valueWeight="700" />
                            </View>
                            
                            {/* Receipt Decorative Notch */}
                            <View style={styles.notchLeft} />
                            <View style={styles.notchRight} />

                        </View>
                    </ViewShot>

                    {/* Bottom Buttons */}
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.shareBtn} onPress={shareTicket} activeOpacity={0.8}>
                            <AppText size={16} weight="700" color={Colors.WHITE}>Share Receipt</AppText>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.homeBtn}
                            onPress={() => navigation.navigate('BottomTabs')}
                            activeOpacity={0.7}
                        >
                            <AppText size={16} weight="700" color="#172C6B">Back to Home</AppText>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>
        </ScreenWrapper>
    );
};

const DetailRow = ({
    label,
    value,
    valueColor = Colors.PRIMARY,
    valueWeight = "700"
}: {
    label: string;
    value: string;
    valueColor?: string;
    valueWeight?: any;
}) => (
    <View style={styles.detailRow}>
        <AppText color={Colors.DARK_GRAY} size={13} weight="600">{label}</AppText>
        <AppText color={valueColor} size={14} weight={valueWeight}>{value}</AppText>
    </View>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        paddingTop: verticalScale(15),
        paddingBottom: verticalScale(50),
    },
    receiptCard: {
        backgroundColor: Colors.SURFACE,
        borderRadius: scale(24),
        padding: scale(24),
        borderWidth: 1,
        borderColor: Colors.BORDER_GREY,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 12,
        elevation: 3,
        position: 'relative',
        overflow: 'hidden',
    },
    successHeader: {
        alignItems: 'center',
        paddingVertical: verticalScale(10),
    },
    dashedLine: {
        borderWidth: 1,
        borderColor: Colors.BORDER_GREY,
        borderStyle: 'dashed',
        marginVertical: verticalScale(20),
    },
    detailsList: {
        gap: verticalScale(14),
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    notchLeft: {
        position: 'absolute',
        left: -10,
        top: '40%',
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: Colors.BACKGROUND,
        borderWidth: 1,
        borderColor: Colors.BORDER_GREY,
    },
    notchRight: {
        position: 'absolute',
        right: -10,
        top: '40%',
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: Colors.BACKGROUND,
        borderWidth: 1,
        borderColor: Colors.BORDER_GREY,
    },
    buttonContainer: {
        marginTop: verticalScale(30),
        gap: verticalScale(12),
    },
    shareBtn: {
        backgroundColor: '#172C6B', // Navy accent button
        paddingVertical: verticalScale(15),
        borderRadius: scale(14),
        alignItems: 'center',
        shadowColor: Colors.PRIMARY,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
        elevation: 4,
    },
    homeBtn: {
        paddingVertical: verticalScale(15),
        borderRadius: scale(14),
        alignItems: 'center',
        borderWidth: 1.5,
        borderColor: '#172C6B',
        backgroundColor: Colors.SURFACE,
    },
});

export default BookingSuccess;

