import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { scale, verticalScale } from 'react-native-size-matters';
import DateTimePicker from '@react-native-community/datetimepicker';
import AppText from '../../../component/common/AppText';
import AppInput from '../../../component/TextInput/TextInput';
import Colors from '../../../utils/Colors.util';
import { Radio } from '../../../assets/svg';

interface HomeSearchProps {
    onSearch: (params: { fromCity: string; toCity: string; date: string }) => void;
}

const HomeSearch = ({ onSearch }: HomeSearchProps) => {
    const [from, setFrom] = useState('');
    const [to, setTo] = useState('');
    const [date, setDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);

    const handleSearch = () => {
        const formattedDate = date.toISOString().split('T')[0]; // "YYYY-MM-DD"
        onSearch({ fromCity: from, toCity: to, date: formattedDate });
    };

    const onDateChange = (event: any, selectedDate?: Date) => {
        setShowDatePicker(Platform.OS === 'ios');
        if (selectedDate) {
            setDate(selectedDate);
        }
    };

    return (
        <View style={styles.searchContainer}>
            <AppInput
                placeholder="From"
                value={from}
                onChangeText={setFrom}
                LeftIcon={Radio}
                inputStyle={styles.inputStyle}
                containerStyle={styles.inputContainer}
                placeholderTextColor={Colors.TEXT_GREY}
            />
            <AppInput
                placeholder="To"
                value={to}
                onChangeText={setTo}
                LeftIcon={Radio}
                inputStyle={styles.inputStyle}
                containerStyle={styles.inputContainer}
                placeholderTextColor={Colors.TEXT_GREY}
            />

            {/* Date Picker Input */}
            <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setShowDatePicker(true)}
                style={[styles.inputContainer, styles.dateInputContainer]}
            >
                <View style={styles.leftIconContainer}>
                    <Radio width={scale(20)} height={scale(20)} />
                </View>
                <AppText size={14} color={Colors.WHITE} style={styles.dateText}>
                    {date.toDateString()}
                </AppText>
            </TouchableOpacity>

            {showDatePicker && (
                <DateTimePicker
                    value={date}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={onDateChange}
                    minimumDate={new Date()}
                />
            )}

            <TouchableOpacity
                style={styles.searchButton}
                activeOpacity={0.8}
                onPress={handleSearch}
            >
                <AppText size={16} weight="700" color={Colors.WHITE}>
                    Search Buses
                </AppText>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    searchContainer: {
        backgroundColor: Colors.INPUT_BG,
        marginVertical: scale(20),
        padding: scale(20),
        borderRadius: scale(20),
        shadowColor: Colors.BLACK,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 10,
    },
    inputContainer: {
        marginBottom: verticalScale(15),
    },
    inputStyle: {
        backgroundColor: Colors.DARK_BG,
        borderRadius: scale(10),
        borderWidth: 0,
    },
    dateInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.DARK_BG,
        borderRadius: scale(10),
        height: verticalScale(46),
        paddingHorizontal: scale(12),
    },
    dateText: {
        flex: 1,
        paddingLeft: scale(0), // removed extra padding
    },

    leftIconContainer: {
        paddingRight: scale(8),
    },
    searchButton: {
        backgroundColor: Colors.BRIGHT_BLUE,
        paddingVertical: verticalScale(14),
        borderRadius: scale(10),
        alignItems: 'center',
        marginTop: verticalScale(5),
    },
});

export default HomeSearch;