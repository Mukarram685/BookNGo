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
    Pressable,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { scale, verticalScale } from 'react-native-size-matters';
import Toast from 'react-native-toast-message';
import Svg, { Defs, LinearGradient, Stop, Rect } from 'react-native-svg';
import AppText from './AppText';
import colors from '../../utils/colors';
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
            t('emergency_assistance_title') || 'Emergency Assistance',
            t('emergency_assistance_msg') || 'Do you need immediate emergency assistance or support helpline?',
            [
                { text: t('cancel') || 'Cancel', style: 'cancel' },
                {
                    text: t('call_helpline') || 'Call Helpline (1122)',
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
            transparent={true}
            animationType="fade"
            statusBarTranslucent={true}
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <Pressable
                    style={styles.overlayTouchable}
                    onPress={onClose}
                />

                <View style={styles.modalCard}>
                    {/* ScreenWrapper-style Upper Gradient Background */}
                    <View style={styles.gradientContainer} pointerEvents="none">
                        <Svg width="100%" height="100%">
                            <Defs>
                                <LinearGradient id="modalGrad" x1="0.5" y1="0" x2="0.5" y2="1">
                                    <Stop offset="0" stopColor="#A3CCFF" stopOpacity="0.65" />
                                    <Stop offset="0.6" stopColor="#CBE0FF" stopOpacity="0.35" />
                                    <Stop offset="0.75" stopColor="#F2F7FF" stopOpacity="0.1" />
                                    <Stop offset="1" stopColor={colors.WHITE} stopOpacity="0" />
                                </LinearGradient>
                            </Defs>
                            <Rect width="100%" height="100%" fill="url(#modalGrad)" />
                        </Svg>
                    </View>

                    <View style={styles.header}>
                        <TouchableOpacity
                            activeOpacity={0.7}
                            onPress={onClose}
                            style={styles.closeButtonWrapper}
                            hitSlop={{
                                top: 10,
                                bottom: 10,
                                left: 10,
                                right: 10,
                            }}
                        >
                            <CloseCircle
                                width={scale(28)}
                                height={scale(28)}
                            />
                        </TouchableOpacity>
                    </View>

                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.scrollContent}
                    >
                        {/* Language Row */}
                        <View style={styles.menuRow}>
                            <View style={styles.iconCircle}>
                                <Globe
                                    width={scale(18)}
                                    height={scale(18)}
                                />
                            </View>

                            <AppText
                                size={15}
                                weight="700"
                                color={colors.SLATE_DARK}
                                style={styles.menuTitle}
                            >
                                {t('menu_language') || 'Language'}
                            </AppText>

                            <View style={styles.langPillContainer}>
                                <TouchableOpacity
                                    style={[
                                        styles.langPill,
                                        currentLang === 'en' &&
                                            styles.langPillActive,
                                    ]}
                                    activeOpacity={0.8}
                                    onPress={() =>
                                        handleLanguageChange('en')
                                    }
                                >
                                    <AppText
                                        size={12}
                                        weight="800"
                                        color={
                                            currentLang === 'en'
                                                ? colors.WHITE
                                                : colors.DARK_GRAY
                                        }
                                    >
                                        ENG
                                    </AppText>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[
                                        styles.langPill,
                                        currentLang === 'ur' &&
                                            styles.langPillActive,
                                    ]}
                                    activeOpacity={0.8}
                                    onPress={() =>
                                        handleLanguageChange('ur')
                                    }
                                >
                                    <AppText
                                        size={12}
                                        weight="800"
                                        color={
                                            currentLang === 'ur'
                                                ? colors.WHITE
                                                : colors.DARK_GRAY
                                        }
                                    >
                                        اردو
                                    </AppText>
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Menu Items */}
                        {SIDE_MENU_ITEMS.map((item) => (
                            <TouchableOpacity
                                key={item.id}
                                style={styles.menuRow}
                                activeOpacity={0.7}
                                onPress={() => handleItemPress(item)}
                            >
                                <View
                                    style={[
                                        styles.iconCircle,
                                        item.isEmergency &&
                                            styles.emergencyIconCircle,
                                    ]}
                                >
                                    <item.Icon
                                        width={scale(18)}
                                        height={scale(18)}
                                    />
                                </View>

                                <AppText
                                    size={15}
                                    weight="700"
                                    color={
                                        item.isEmergency
                                            ? colors.RED_PRIMARY
                                            : colors.SLATE_DARK
                                    }
                                    style={styles.menuTitle}
                                >
                                    {t(item.titleKey) ||
                                        item.defaultTitle}
                                </AppText>
                            </TouchableOpacity>
                        ))}

                        {/* Version */}
                        <View style={styles.footer}>
                            <AppText
                                size={12}
                                weight="600"
                                color={colors.TEXT_GREY}
                            >
                                {t('menu_app_version', {
                                    version: APP_VERSION,
                                }) ||
                                    `App Version ${APP_VERSION}`}
                            </AppText>
                        </View>
                    </ScrollView>
                </View>
            </View>
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
    overlayTouchable: {
        ...StyleSheet.absoluteFillObject,
    },
    modalCard: {
        width: '100%',
        maxHeight: '92%',
        backgroundColor: colors.WHITE,
        borderRadius: scale(28),
        paddingHorizontal: scale(18),
        paddingTop: verticalScale(14),
        paddingBottom: verticalScale(16),
        shadowColor: colors.BLACK,
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.25,
        shadowRadius: 24,
        elevation: 12,
        overflow: 'hidden',
        position: 'relative',
    },
    gradientContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '60%',
        zIndex: 0,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        marginBottom: verticalScale(6),
        zIndex: 1,
    },
    closeButtonWrapper: {
        padding: scale(4),
    },
    scrollContent: {
        paddingBottom: verticalScale(10),
        zIndex: 1,
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
        backgroundColor: colors.BLUE_LIGHT_BG,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: scale(14),
    },
    emergencyIconCircle: {
        backgroundColor: colors.RED_LIGHT_BG,
    },
    menuTitle: {
        flex: 1,
        letterSpacing: 0.2,
    },
    langPillContainer: {
        flexDirection: 'row',
        backgroundColor: colors.BORDER_GREY,
        borderRadius: scale(20),
        padding: scale(3),
    },
    langPill: {
        paddingHorizontal: scale(12),
        paddingVertical: verticalScale(5),
        borderRadius: scale(16),
    },
    langPillActive: {
        backgroundColor: colors.PRIMARY,
        shadowColor: colors.PRIMARY,
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
