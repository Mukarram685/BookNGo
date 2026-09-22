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
                        containerStyle={styles.inputContainer}
                    />

                    <CitySelector
                        placeholder={t('home_to_city') || "To City"}
                        value={values.to}
                        onSelect={(city: string) => setFieldValue('to', city)}
                        LeftIcon={To}
                        error={touched.to && errors.to ? errors.to : ''}
                        touched={touched.to}
                        containerStyle={styles.inputContainer}
                    />

                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => setShowDatePicker(true)}
                        style={[styles.inputContainer, styles.dateInputContainer]}
                    >
                        <View style={styles.leftIconContainer}>
                             <Calendar width={scale(18)} height={scale(18)} color={Colors.PRIMARY} />
                        </View>
                        <AppText size={13} color={Colors.PRIMARY} weight="700" style={styles.dateText}>
                            {values.date.toDateString()}
                        </AppText>
                    </TouchableOpacity>
                    {(touched.date && errors.date) && (
                        <AppText size={11} color={Colors.RED} style={styles.errorText}>
                            {errors.date as string}
                        </AppText>
                    )}

                    {showDatePicker && (
                        Platform.OS === 'ios' ? (
                            <View style={styles.datePickerWrapper}>
                                <DateTimePicker
                                    value={values.date}
                                    mode="date"
                                    display="spinner"
                                    minimumDate={new Date()}
                                    textColor={Colors.PRIMARY}
                                    accentColor={Colors.PRIMARY}
                                    themeVariant="light"
                                    positiveButton={{ textColor: Colors.PRIMARY }}
                                    negativeButton={{ textColor: Colors.PRIMARY }}
                                    onChange={(event, selectedDate) => {
                                        if (selectedDate) {
                                            setFieldValue('date', selectedDate);
                                        }
                                    }}
                                />
                            </View>
                        ) : (
                            <DateTimePicker
                                value={values.date}
                                mode="date"
                                display="default"
                                minimumDate={new Date()}
                                textColor={Colors.PRIMARY}
                                accentColor={Colors.PRIMARY}
                                themeVariant="light"
                                positiveButton={{ textColor: Colors.PRIMARY }}
                                negativeButton={{ textColor: Colors.PRIMARY }}
                                onChange={(event, selectedDate) => {
                                    setShowDatePicker(false);
                                    if (selectedDate) {
                                        setFieldValue('date', selectedDate);
                                    }
                                }}
                            />
                        )
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
        marginTop: verticalScale(6),
        marginBottom: verticalScale(16),
        padding: scale(18),
        borderRadius: scale(20),
        borderWidth: 1,
        borderColor: 'rgba(219, 234, 254, 0.9)',
        backgroundColor: Colors.TRANSPARENT,
        shadowColor: Colors.PRIMARY,
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 4,
    },
    datePickerWrapper: {
        backgroundColor: Colors.WHITE,
        borderRadius: scale(14),
        padding: scale(10),
        marginTop: verticalScale(6),
        marginBottom: verticalScale(12),
        borderWidth: 1,
        borderColor: Colors.BORDER_GREY,
        elevation: 10,
    },
    inputContainer: {
        marginBottom: verticalScale(12),
    },
    dateInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: scale(12),
        height: verticalScale(48),
        paddingHorizontal: scale(14),
        borderWidth: 1,
        borderColor: Colors.BORDER_GREY,
        backgroundColor: Colors.INPUT_BG,
    },
    dateText: {
        flex: 1,
        paddingLeft: scale(4),
    },
    leftIconContainer: {
        paddingRight: scale(8),
    },
    searchButton: {
        backgroundColor: Colors.PRIMARY,
        paddingVertical: verticalScale(16),
        borderRadius: scale(14),
        alignItems: 'center',
        marginTop: verticalScale(10),
        shadowColor: Colors.SECONDARY,
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 8,
    },
});

export default HomeSearch;