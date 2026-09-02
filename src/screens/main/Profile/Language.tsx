import React from 'react';
import { View, StyleSheet, StatusBar, TouchableOpacity, ScrollView, FlatList } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { scale, verticalScale } from 'react-native-size-matters';
import { useNavigation } from '@react-navigation/native';
import ScreenWrapper from '../../../component/common/ScreenWrapper';
import AppText from '../../../component/common/AppText';
import colors, { Colors } from '../../../utils/colors';
import Header from '../../../component/Header';
import { setLanguage } from '../../../store/slice/language.slice';
import Svg, { Path } from 'react-native-svg';

const CheckIcon = () => (
    <Svg width={scale(16)} height={scale(16)} viewBox="0 0 24 24" fill="none">
        <Path
            d="M20 6L9 17L4 12"
            stroke="#172C6B"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </Svg>
);

const Language = () => {
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const { t } = useTranslation();
    const currentLang = useSelector((state: any) => state.language.currentLanguage);

    const languages = [
        { code: 'en', name: t('english') || 'English' },
        { code: 'ur', name: t('urdu') || 'Urdu (اردو)' },
        { code: 'fr', name: t('french') || 'French (Français)' },
    ];

    const handleSelectLanguage = (code: string) => {
        dispatch(setLanguage(code));
        navigation.goBack();
    };

    return (
        <ScreenWrapper 
            backgroundColor={Colors.BACKGROUND} 
            header={<Header title={t('language_title') || "Language"} showBack={true} />}
        >
            <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />
            <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
                
                <AppText size={13} color={Colors.TEXT_GREY} weight="800" style={styles.sectionHeader}>
                    {t('select_language') || "SELECT APP LANGUAGE"}
                </AppText>

                {/* Languages Card Container */}
                <View style={styles.languagesCard}>
                    <FlatList
                        data={languages}
                        scrollEnabled={false}
                        keyExtractor={(item) => item.code}
                        renderItem={({ item: lang, index }) => {
                            const isSelected = currentLang === lang.code;
                            const isLast = index === languages.length - 1;

                            return (
                                <TouchableOpacity
                                    key={lang.code}
                                    style={[styles.langRow, isLast && { borderBottomWidth: 0 }]}
                                    onPress={() => handleSelectLanguage(lang.code)}
                                    activeOpacity={0.7}
                                >
                                    <AppText 
                                        size={15} 
                                        weight={isSelected ? "800" : "600"} 
                                        color={isSelected ? Colors.PRIMARY : Colors.SLATE_DARK}
                                    >
                                        {lang.name}
                                    </AppText>
                                    {isSelected && (
                                        <View style={styles.checkBadge}>
                                            <CheckIcon />
                                        </View>
                                    )}
                                </TouchableOpacity>
                            );
                        }}
                    />
                </View>

            </ScrollView>
        </ScreenWrapper>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: scale(20),
        paddingTop: verticalScale(15),
        paddingBottom: verticalScale(30),
    },
    sectionHeader: {
        marginLeft: scale(6),
        marginBottom: verticalScale(8),
        letterSpacing: 1,
    },
    languagesCard: {
        backgroundColor: Colors.SURFACE,
        borderRadius: scale(18),
        borderWidth: 1,
        borderColor: Colors.BORDER_GREY,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.03,
        shadowRadius: 12,
        elevation: 3,
        overflow: 'hidden',
    },
    langRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: verticalScale(16),
        paddingHorizontal: scale(16),
        borderBottomWidth: 1,
        borderBottomColor: Colors.BORDER_GREY,
    },
});

export default Language;
