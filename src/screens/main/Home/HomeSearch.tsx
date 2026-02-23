import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { scale, verticalScale } from 'react-native-size-matters';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Formik } from 'formik';
import AppText from '../../../component/common/AppText';
import AppInput from '../../../component/TextInput/TextInput';
import Colors from '../../../utils/Colors.util';
import { From, To, Calendar } from '../../../assets/svg';
import { SearchSchema } from '../../../helpers/bus.helper';

interface HomeSearchProps {
    onSearch: (params: { fromCity: string; toCity: string; date: string }) => void;
}

const HomeSearch = ({ onSearch }: HomeSearchProps) => {
    const [showDatePicker, setShowDatePicker] = useState(false);

    return (
        <Formik
            initialValues={{
                from: '',
                to: '',
                date: new Date(),
            }}
            validationSchema={SearchSchema}
            onSubmit={(values) => {
                const formattedDate = values.date
                    .toISOString()
                    .split('T')[0];

                onSearch({
                    fromCity: values.from,
                    toCity: values.to,
                    date: formattedDate,
                });
            }}
        >
            {({ values, setFieldValue, handleSubmit, errors, touched, setFieldTouched }) => (
                <View style={styles.searchContainer}>
                    <AppInput
                        placeholder="From"
                        value={values.from}
                        onChangeText={(text) =>
                            setFieldValue('from', text)
                        }
                        onBlur={() => setFieldTouched('from')}
                        error={touched.from && errors.from ? errors.from : ''}
                        LeftIcon={From}
                        inputStyle={styles.inputStyle}
                        containerStyle={styles.inputContainer}
                        placeholderTextColor={Colors.TEXT_GREY}
                    />

                    <AppInput
                        placeholder="To"
                        value={values.to}
                        onChangeText={(text) =>
                            setFieldValue('to', text)
                        }
                        onBlur={() => setFieldTouched('to')}
                        error={touched.to && errors.to ? errors.to : ''}
                        LeftIcon={To}
                        inputStyle={styles.inputStyle}
                        containerStyle={styles.inputContainer}
                        placeholderTextColor={Colors.TEXT_GREY}
                    />

                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => setShowDatePicker(true)}
                        style={[styles.inputContainer, styles.dateInputContainer]}
                    >
                        <View style={styles.leftIconContainer}>
                            <Calendar width={scale(20)} height={scale(20)} />
                        </View>
                        <AppText size={14} color={Colors.WHITE} style={styles.dateText}>
                            {values.date.toDateString()}
                        </AppText>
                    </TouchableOpacity>
                    {(touched.date && errors.date) && (
                        <AppText size={12} color={Colors.RED} style={{ marginTop: -10, marginBottom: 10 }}>
                            {errors.date as string}
                        </AppText>
                    )}

                    {showDatePicker && (
                        <View style={styles.datePickerWrapper}>
                        <DateTimePicker
                            value={values.date}
                            mode="date"
                            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                            minimumDate={new Date()}
                            textColor={Colors.BLACK}
                            accentColor={Colors.BRIGHT_BLUE}
                            themeVariant="light"
                            onChange={(event, selectedDate) => {
                                setShowDatePicker(
                                    Platform.OS === 'ios'
                                );
                                if (selectedDate) {
                                    setFieldValue(
                                        'date',
                                        selectedDate
                                    );
                                }
                            }}
                        />
                         </View>
                    )}

                    <TouchableOpacity
                        style={styles.searchButton}
                        activeOpacity={0.8}
                        onPress={() => handleSubmit()}
                    >
                        <AppText size={16} weight="700" color={Colors.WHITE}>
                            Search Buses
                        </AppText>
                    </TouchableOpacity>
                </View>
            )}
        </Formik>
    );
};

const styles = StyleSheet.create({
    searchContainer: {
        marginVertical: scale(20),
        padding: scale(20),
        borderRadius: scale(20),
        borderWidth: 1,
        borderColor: Colors.BRIGHT_BLUE
    },
    datePickerWrapper: {
        backgroundColor: Colors.RED,
        borderRadius: 15,
        padding: 10,
        marginTop: 10,
        elevation: 20,
    },
    inputContainer: {
        marginBottom: verticalScale(15),
    },
    inputStyle: {
        borderRadius: scale(12),
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.15)',
    },
    dateInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: scale(12),
        height: verticalScale(46),
        paddingHorizontal: scale(12),
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.15)',
    },
    dateText: {
        flex: 1,
        paddingLeft: scale(5),
    },
    leftIconContainer: {
        paddingRight: scale(8),
    },
    searchButton: {
        backgroundColor: 'rgba(11, 100, 255, 0.7)',
        paddingVertical: verticalScale(14),
        borderRadius: scale(12),
        alignItems: 'center',
        marginTop: verticalScale(5),
    },
});

export default HomeSearch;