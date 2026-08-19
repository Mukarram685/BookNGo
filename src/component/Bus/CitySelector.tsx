import React, { useState, useEffect } from 'react';
import {
    View,
    StyleSheet,
    TouchableOpacity,
    Modal,
    FlatList,
    SafeAreaView,
} from 'react-native';
import { scale, verticalScale } from 'react-native-size-matters';
import { useTranslation } from 'react-i18next';
import AppText from '../common/AppText';
import AppInput from '../TextInput/TextInput';
import Colors from '../../utils/Colors.util';
import { PAKISTAN_CITIES } from '../../constants/Cities.constant';

const SearchIcon = ({ color, size }: { color: string; size: number }) => (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
        <View style={{ width: size * 0.8, height: size * 0.8, borderRadius: size * 0.4, borderWidth: 2, borderColor: color }} />
        <View style={{ position: 'absolute', bottom: 0, right: 0, width: 2, height: size * 0.4, backgroundColor: color, transform: [{ rotate: '-45deg' }] }} />
    </View>
);

const CloseIcon = ({ color, size }: { color: string; size: number }) => (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
        <View style={{ position: 'absolute', width: size, height: 2, backgroundColor: color, transform: [{ rotate: '45deg' }] }} />
        <View style={{ position: 'absolute', width: size, height: 2, backgroundColor: color, transform: [{ rotate: '-45deg' }] }} />
    </View>
);

interface CitySelectorProps {
    value: string;
    onSelect: (city: string) => void;
    placeholder: string;
    LeftIcon?: React.FC<any>;
    error?: string;
    touched?: boolean;
}

const CitySelector: React.FC<CitySelectorProps> = ({
    value,
    onSelect,
    placeholder,
    LeftIcon,
    error,
    touched,
}) => {
    const { t } = useTranslation();
    const [modalVisible, setModalVisible] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredCities, setFilteredCities] = useState(PAKISTAN_CITIES);

    useEffect(() => {
        const filtered = PAKISTAN_CITIES.filter(city =>
            city.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredCities(filtered);
    }, [searchQuery]);

    const handleSelect = (city: string) => {
        onSelect(city);
        setModalVisible(false);
        setSearchQuery('');
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setModalVisible(true)}
                style={[
                    styles.selectorTrigger,
                    error && touched && styles.errorBorder,
                ]}
            >
                {LeftIcon && (
                    <View style={styles.leftIconContainer}>
                        <LeftIcon width={scale(20)} height={scale(20)} color={value ? Colors.PRIMARY : Colors.TEXT_GREY} />
                    </View>
                )}
                <AppText
                    size={14}
                    color={value ? Colors.PRIMARY : Colors.TEXT_GREY}
                    weight={value ? "600" : "500"}
                    style={styles.valueText}
                >
                    {value || placeholder}
                </AppText>
            </TouchableOpacity>

            {error && touched && (
                <AppText size={11} color={Colors.RED} weight="500" style={styles.errorText}>
                    {error}
                </AppText>
            )}

            <Modal
                animationType="slide"
                transparent={false}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <SafeAreaView style={styles.modalContainer}>
                    <View style={styles.modalHeader}>
                        <TouchableOpacity
                            onPress={() => setModalVisible(false)}
                            style={styles.closeButton}
                        >
                            <CloseIcon color={Colors.PRIMARY} size={scale(20)} />
                        </TouchableOpacity>
                        <AppText size={18} weight="700" color={Colors.PRIMARY}>
                            {t('select_city_title') || "Select City"}
                        </AppText>
                        <View style={{ width: scale(24) }} />
                    </View>

                    <View style={styles.searchWrapper}>
                        <AppInput
                            placeholder={t('search_city_placeholder') || "Search your city..."}
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            LeftIcon={() => <SearchIcon color={Colors.TEXT_GREY} size={scale(18)} />}
                            autoFocus={false}
                        />
                    </View>

                    <FlatList
                        data={filteredCities}
                        keyExtractor={(item) => item}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={styles.cityItem}
                                onPress={() => handleSelect(item)}
                            >
                                <AppText
                                    size={15}
                                    color={item === value ? Colors.SECONDARY : Colors.PRIMARY}
                                    weight={item === value ? "700" : "500"}
                                >
                                    {item}
                                </AppText>
                                {item === value && (
                                    <View style={styles.activeDot} />
                                )}
                            </TouchableOpacity>
                        )}
                        ListEmptyComponent={
                            <View style={styles.emptyContainer}>
                                <AppText size={14} color={Colors.TEXT_GREY}>
                                    {t('no_cities_found', { query: searchQuery }) || `No cities found matching "${searchQuery}"`}
                                </AppText>
                            </View>
                        }
                        contentContainerStyle={styles.listContent}
                    />
                </SafeAreaView>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: verticalScale(14),
    },
    selectorTrigger: {
        flexDirection: 'row',
        alignItems: 'center',
        height: verticalScale(46),
        borderWidth: 1,
        borderColor: Colors.SEAT_SELECTED_BORDER,
        borderRadius: scale(8),
        paddingHorizontal: scale(12),
    },
    errorBorder: {
        borderColor: Colors.RED,
    },
    leftIconContainer: {
        paddingRight: scale(10),
    },
    valueText: {
        flex: 1,
    },
    errorText: {
        marginTop: verticalScale(4),
        paddingLeft: scale(4),
    },
    modalContainer: {
        flex: 1,
        backgroundColor: Colors.BACKGROUND,
    },
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: scale(20),
        paddingVertical: verticalScale(15),
        backgroundColor: Colors.SURFACE,
        borderBottomWidth: 1,
        borderBottomColor: Colors.BORDER_GREY,
    },
    closeButton: {
        padding: scale(5),
    },
    searchWrapper: {
        padding: scale(20),
    },
    listContent: {
        paddingHorizontal: scale(20),
        paddingBottom: verticalScale(20),
    },
    cityItem: {
        paddingVertical: verticalScale(15),
        borderBottomWidth: 1,
        borderBottomColor: Colors.BORDER_GREY,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    activeDot: {
        width: scale(8),
        height: scale(8),
        borderRadius: scale(4),
        backgroundColor: Colors.SECONDARY,
    },
    emptyContainer: {
        alignItems: 'center',
        marginTop: verticalScale(50),
    },
});

export default CitySelector;
