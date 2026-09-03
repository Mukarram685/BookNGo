import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { scale, verticalScale } from 'react-native-size-matters';
import AppText from '../common/AppText';
import colors from '../../utils/colors';
import { Arrow } from '../../assets/svg';

export interface MenuItemData {
    id: string;
    title: string;
    icon: React.ReactNode;
    rightText?: string;
    onPress: () => void;
    isLast?: boolean;
}

interface ProfileMenuItemProps {
    data: MenuItemData;
}

const ProfileMenuItem: React.FC<ProfileMenuItemProps> = ({ data }) => {
    const { title, icon, rightText, onPress, isLast } = data;

    return (
        <TouchableOpacity
            style={[styles.menuRow, isLast && { borderBottomWidth: 0 }]}
            activeOpacity={0.7}
            onPress={onPress}
        >
            <View style={styles.iconCircle}>
                {icon}
            </View>
            <AppText size={14} weight="700" color={colors.SLATE_DARK} style={styles.menuTitle}>
                {title}
            </AppText>
            {rightText ? (
                <AppText size={12} weight="600" color={colors.PRIMARY} style={styles.rightDetailText}>
                    {rightText}
                </AppText>
            ) : null}
            {/* <Arrow
                width={scale(14)}
                height={scale(14)}
                style={{ transform: [{ rotate: '180deg' }] }}
                fill={colors.TEXT_GREY}
            /> */}
        </TouchableOpacity>
    );
};

export default ProfileMenuItem;

const styles = StyleSheet.create({
    menuRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: verticalScale(5),
        borderBottomWidth: 1,
        borderBottomColor: colors.SLATE_DIVIDER,
    },
    iconCircle: {
        width: scale(36),
        height: scale(36),
        borderRadius: scale(18),
        backgroundColor: colors.SLATE_LIGHT,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: scale(12),
    },
    menuTitle: {
        flex: 1,
    },
    rightDetailText: {
        marginRight: scale(8),
    },
});
