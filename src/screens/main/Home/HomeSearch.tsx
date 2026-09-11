import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { scale, verticalScale } from 'react-native-size-matters';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Formik } from 'formik';
import { useTranslation } from 'react-i18next';
import AppText from '../../../component/common/AppText';
import AppButton from '../../../component/common/AppButton';
import colors, { Colors } from '../../../utils/colors';
import { From, To, Calendar } from '../../../assets/svg';
import { SearchSchema } from '../../../helpers/bus.helper';
import CitySelector from '../../../component/Bus/CitySelector';

interface HomeSearchProps {
    onSearch: (params: { fromCity: string; toCity: string; date: string }) => void;
}

const HomeSearch = ({ onSearch }: HomeSearchProps) => {
    const { t } = useTranslation();
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
                    <CitySelector
                        placeholder={t('home_from_city') || "From City"}
                        value={values.from}
                        onSelect={(city: string) => setFieldValue('from', city)}
                        LeftIcon={From}
                        error={touched.from && errors.from ? errors.from : ''}
                        touched={touched.from}
                    />

                    <CitySelector
                        placeholder={t('home_to_city') || "To City"}
                        value={values.to}
                        onSelect={(city: string) => setFieldValue('to', city)}
                        LeftIcon={To}
                        error={touched.to && errors.to ? errors.to : ''}
                        touched={touched.to}
                    />

                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => setShowDatePicker(true)}
                        style={[styles.inputContainer, styles.dateInputContainer]}
                    >
                        <View style={styles.leftIconContainer}>
                             <Calendar width={scale(20)} height={scale(20)} />
                        </View>
                        <AppText size={14} color={Colors.PRIMARY} weight="500" style={styles.dateText}>
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
                                textColor={Colors.PRIMARY}
                                accentColor={Colors.PRIMARY}
                                themeVariant="light"
                                positiveButton={{ textColor: Colors.PRIMARY }}
                                negativeButton={{ textColor: Colors.PRIMARY }}
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

                    <AppButton
                        title={t('home_search_button') || "Search Buses"}
                        onPress={() => handleSubmit()}
                        style={styles.searchButton}
                    />
                </View>
            )}
        </Formik>
    );
};

const styles = StyleSheet.create({
    searchContainer: {
        marginVertical: scale(1),
        padding: scale(24),
        borderRadius: scale(24),
        borderWidth: 1,
        borderColor: Colors.BORDER_GREY,
        backgroundColor: 'transparent',
        shadowColor: Colors.PRIMARY,
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.05,
        shadowRadius: 15,
        elevation: 5,
    },
    datePickerWrapper: {
        backgroundColor: Colors.WHITE,
        borderRadius: 15,
        padding: 10,
        marginTop: 10,
        borderWidth: 1,
        borderColor: Colors.BORDER_GREY,
        elevation: 20,
    },
    inputContainer: {
        marginBottom: verticalScale(18),
    },
    inputStyle: {
        borderColor: Colors.BORDER_GREY,
        backgroundColor: Colors.INPUT_BG,
        color: Colors.PRIMARY,
    },
    dateInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: scale(14),
        height: verticalScale(52),
        paddingHorizontal: scale(15),
        borderWidth: 1,
        borderColor: Colors.BORDER_GREY,
        backgroundColor: Colors.INPUT_BG,
    },
    dateText: {
        flex: 1,
        paddingLeft: scale(8),
    },
    leftIconContainer: {
        paddingRight: scale(10),
    },
    searchButton: {
        backgroundColor: Colors.PRIMARY,
        paddingVertical: verticalScale(16),
        borderRadius: scale(14),
        alignItems: 'center',
        marginTop: verticalScale(10),
        shadowColor: Colors.SECONDARY,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 8,
    },
});

export default HomeSearch;