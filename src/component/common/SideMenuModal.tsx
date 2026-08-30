import React from 'react';
import {
    View,
    Modal,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Share,
    Alert,
    Linking,
    TouchableWithoutFeedback,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { scale, verticalScale } from 'react-native-size-matters';
import Toast from 'react-native-toast-message';
import AppText from './AppText';
import Colors from '../../utils/Colors.util';
import { setLanguage } from '../../store/slice/language.slice';
import { Globe, CloseCircle } from '../../assets/svg';
import { SIDE_MENU_ITEMS, APP_VERSION, MenuItemData } from '../../data/sideMenu.data';

interface SideMenuModalProps {
    visible: boolean;
    onClose: () => void;
}

const SideMenuModal: React.FC<SideMenuModalProps> = ({ visible, onClose }) => {
    const navigation = useNavigation<any>();
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const currentLang = useSelector((state: any) => state.language.currentLanguage);

    const handleLanguageChange = (lang: string) => {
        dispatch(setLanguage(lang));
    };

    const handleShare = async () => {
        onClose();
        try {
            await Share.share({
                title: 'BookNGo Bus Booking App',
                message: 'Book bus tickets across Pakistan easily and safely with BookNGo! Download the app today.',
            });
        } catch (error) {
            console.error('Share error:', error);
        }
    };

    const handleEmergencyAlert = () => {
        onClose();
        Alert.alert(
            t('menu_emergency_alert') || 'Emergency Assistance',
            'Do you need immediate emergency assistance or support helpline?',
            [
                { text: t('cancel') || 'Cancel', style: 'cancel' },
                {
                    text: 'Call Helpline (1122)',
                    style: 'destructive',
                    onPress: () => Linking.openURL('tel:1122'),
                },
            ]
        );
    };

    const showToast = (title: string, message: string) => {
        onClose();
        Toast.show({
            type: 'info',
            text1: title,
            text2: message,
            position: 'bottom',
            visibilityTime: 2500,
        });
    };

    const handleItemPress = (item: MenuItemData) => {
        switch (item.actionType) {
            case 'navigate':
                onClose();
                if (item.targetScreen) {
                    navigation.navigate(item.targetScreen);
                }
                break;
            case 'share':
                handleShare();
                break;
            case 'emergency':
                handleEmergencyAlert();
                break;
            case 'toast':
                showToast(
                    item.toastTitleKey ? t(item.toastTitleKey) || item.defaultTitle : item.defaultTitle,
                    item.toastMessageKey ? t(item.toastMessageKey) || '' : ''
                );
                break;
            default:
                onClose();
                break;
        }
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={styles.modalOverlay}>
                    <TouchableWithoutFeedback>
                        <View style={styles.modalCard}>
                            {/* Close Button Header */}
                            <View style={styles.header}>
                                <TouchableOpacity
                                    activeOpacity={0.7}
                                    onPress={onClose}
                                    style={styles.closeButtonWrapper}
                                >
                                    <CloseCircle width={scale(28)} height={scale(28)} />
                                </TouchableOpacity>
                            </View>

                            <ScrollView
                                showsVerticalScrollIndicator={false}
                                contentContainerStyle={styles.scrollContent}
                            >
                                {/* 1. Language Row with Pill Toggle */}
                                <View style={styles.menuRow}>
                                    <View style={styles.iconCircle}>
                                        <Globe width={scale(18)} height={scale(18)} />
                                    </View>
                                    <AppText size={15} weight="700" color="#1E293B" style={styles.menuTitle}>
                                        {t('menu_language') || 'Language'}
                                    </AppText>

                                    {/* Language Switcher Pill */}
                                    <View style={styles.langPillContainer}>
                                        <TouchableOpacity
                                            style={[
                                                styles.langPill,
                                                currentLang === 'en' && styles.langPillActive,
                                            ]}
                                            activeOpacity={0.8}
                                            onPress={() => handleLanguageChange('en')}
                                        >
                                            <AppText
                                                size={12}
                                                weight="800"
                                                color={currentLang === 'en' ? Colors.WHITE : '#475569'}
                                            >
                                                ENG
                                            </AppText>
                                        </TouchableOpacity>

                                        <TouchableOpacity
                                            style={[
                                                styles.langPill,
                                                currentLang === 'ur' && styles.langPillActive,
                                            ]}
                                            activeOpacity={0.8}
                                            onPress={() => handleLanguageChange('ur')}
                                        >
                                            <AppText
                                                size={12}
                                                weight="800"
                                                color={currentLang === 'ur' ? Colors.WHITE : '#475569'}
                                            >
                                                اردو
                                            </AppText>
                                        </TouchableOpacity>
                                    </View>
                                </View>

                                {/* Remaining Menu Items from Data */}
                                {SIDE_MENU_ITEMS.map((item) => (
                                    <TouchableOpacity
                                        key={item.id}
                                        style={styles.menuRow}
                                        activeOpacity={0.7}
                                        onPress={() => handleItemPress(item)}
                                    >
                                        <View style={[styles.iconCircle, item.isEmergency && styles.emergencyIconCircle]}>
                                            <item.Icon width={scale(18)} height={scale(18)} />
                                        </View>
                                        <AppText
                                            size={15}
                                            weight="700"
                                            color={item.isEmergency ? '#E11D48' : '#1E293B'}
                                            style={styles.menuTitle}
                                        >
                                            {t(item.titleKey) || item.defaultTitle}
                                        </AppText>
                                    </TouchableOpacity>
                                ))}

                                {/* App Version Footer */}
                                <View style={styles.footer}>
                                    <AppText size={12} weight="600" color="#94A3B8">
                                        {t('menu_app_version', { version: APP_VERSION }) || `App Version ${APP_VERSION}`}
                                    </AppText>
                                </View>
                            </ScrollView>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

export default SideMenuModal;

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: scale(16),
        paddingVertical: verticalScale(30),
    },
    modalCard: {
        width: '100%',
        maxHeight: '92%',
        backgroundColor: Colors.WHITE,
        borderRadius: scale(28),
        paddingHorizontal: scale(18),
        paddingTop: verticalScale(14),
        paddingBottom: verticalScale(16),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.25,
        shadowRadius: 24,
        elevation: 12,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        marginBottom: verticalScale(6),
    },
    closeButtonWrapper: {
        padding: scale(4),
    },
    scrollContent: {
        paddingBottom: verticalScale(10),
    },
    menuRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: verticalScale(12),
        paddingHorizontal: scale(6),
    },
    iconCircle: {
        width: scale(38),
        height: scale(38),
        borderRadius: scale(19),
        backgroundColor: '#EEF2FF',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: scale(14),
    },
    emergencyIconCircle: {
        backgroundColor: '#FFE4E6',
    },
    menuTitle: {
        flex: 1,
        letterSpacing: 0.2,
    },
    langPillContainer: {
        flexDirection: 'row',
        backgroundColor: '#E2E8F0',
        borderRadius: scale(20),
        padding: scale(3),
    },
    langPill: {
        paddingHorizontal: scale(12),
        paddingVertical: verticalScale(5),
        borderRadius: scale(16),
    },
    langPillActive: {
        backgroundColor: '#172C6B',
        shadowColor: '#172C6B',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 2,
    },
    footer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: verticalScale(18),
        marginBottom: verticalScale(8),
    },
});
