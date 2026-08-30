import React from 'react';
import {
    View,
    StyleSheet,
    StyleProp,
    ViewStyle,
    TextStyle,
} from 'react-native';
import Svg, { Path, Ellipse, G, Circle } from 'react-native-svg';
import { scale, verticalScale } from 'react-native-size-matters';
import AppText from './AppText';
import AppButton from './AppButton';
import Colors from '../../utils/Colors.util';

interface EmptyCardProps {
    title?: string;
    message?: string;
    actionButtonTitle?: string;
    onActionPress?: () => void;
    containerStyle?: StyleProp<ViewStyle>;
    titleStyle?: StyleProp<TextStyle>;
    messageStyle?: StyleProp<TextStyle>;
    illustrationSize?: number;
}

export const EmptyBoxIllustration = ({ size = scale(130) }: { size?: number }) => (
    <Svg width={size} height={size * 0.95} viewBox="0 0 160 145" fill="none">
        {/* Dashed flight trail curving upward from the box */}
        <Path
            d="M 82 85 C 80 62, 58 50, 68 36 C 78 20, 106 34, 94 16 C 92 12, 96 10, 100 10"
            stroke="#CBD5E1"
            strokeWidth="2.2"
            strokeDasharray="4 3.5"
            strokeLinecap="round"
            fill="none"
        />

        {/* Small flying bee / insect at the top of trail */}
        <G transform="translate(100, 10)">
            {/* Left Wing */}
            <Ellipse
                cx="-6"
                cy="-2"
                rx="5.5"
                ry="3.2"
                transform="rotate(-25 -6 -2)"
                fill="#C6D3E8"
                opacity="0.9"
            />
            {/* Right Wing */}
            <Ellipse
                cx="6"
                cy="-2"
                rx="5.5"
                ry="3.2"
                transform="rotate(25 6 -2)"
                fill="#C6D3E8"
                opacity="0.9"
            />
            {/* Body */}
            <Ellipse
                cx="0"
                cy="0"
                rx="3.5"
                ry="5"
                transform="rotate(10 0 0)"
                fill="#64748B"
            />
            {/* Head */}
            <Circle cx="0.5" cy="-4.5" r="2" fill="#475569" />
        </G>

        {/* The Open Box */}
        {/* Inside Back Cavity */}
        <Path
            d="M 45 76 L 56 62 L 104 62 L 115 76 Z"
            fill="#94A3B8"
        />

        {/* Back Flap Opened Up */}
        <Path
            d="M 56 62 L 62 46 L 98 46 L 104 62 Z"
            fill="#CBD5E1"
        />

        {/* Left Side Flap Opened Out */}
        <Path
            d="M 45 76 L 28 62 L 48 56 L 56 62 Z"
            fill="#BCC9DC"
        />

        {/* Right Side Flap Opened Out */}
        <Path
            d="M 115 76 L 132 62 L 112 56 L 104 62 Z"
            fill="#BCC9DC"
        />

        {/* Left Perspective Shadow on Box */}
        <Path
            d="M 36 76 L 54 76 L 48 116 L 40 116 Z"
            fill="#8FA0BC"
        />

        {/* Front Body of Box */}
        <Path
            d="M 36 76 L 124 76 L 118 116 L 42 116 Z"
            fill="#B2BFD4"
        />

        {/* Front Lip / Fold Flap */}
        <Path
            d="M 34 76 L 42 88 L 118 88 L 126 76 Z"
            fill="#CAD5E8"
        />
    </Svg>
);

const EmptyCard: React.FC<EmptyCardProps> = ({
    title = 'No results found',
    message,
    actionButtonTitle,
    onActionPress,
    containerStyle,
    titleStyle,
    messageStyle,
    illustrationSize = scale(135),
}) => {
    return (
        <View style={[styles.container, containerStyle]}>
            <View style={styles.illustrationWrapper}>
                <EmptyBoxIllustration size={illustrationSize} />
            </View>

            {title ? (
                <AppText
                    size={20}
                    weight="800"
                    color={Colors.PRIMARY}
                    align="center"
                    style={StyleSheet.flatten([styles.title, titleStyle])}
                >
                    {title}
                </AppText>
            ) : null}

            {message ? (
                <AppText
                    size={14}
                    weight="500"
                    color={Colors.DARK_GRAY}
                    align="center"
                    style={StyleSheet.flatten([styles.message, messageStyle])}
                >
                    {message}
                </AppText>
            ) : null}

            {actionButtonTitle && onActionPress ? (
                <View style={styles.buttonWrapper}>
                    <AppButton
                        title={actionButtonTitle}
                        onPress={onActionPress}
                        style={styles.actionButton}
                    />
                </View>
            ) : null}
        </View>
    );
};

export default EmptyCard;

const styles = StyleSheet.create({
    container: {
        width: '100%',
        paddingHorizontal: scale(20),
        paddingVertical: verticalScale(35),
        alignItems: 'center',
        justifyContent: 'center',
    },
    illustrationWrapper: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: verticalScale(16),
    },
    title: {
        marginBottom: verticalScale(8),
        letterSpacing: 0.2,
    },
    message: {
        lineHeight: scale(21),
        paddingHorizontal: scale(16),
        color: '#64748B',
    },
    buttonWrapper: {
        width: '80%',
        marginTop: verticalScale(22),
    },
    actionButton: {
        backgroundColor: Colors.PRIMARY,
        paddingVertical: verticalScale(12),
        borderRadius: scale(12),
    },
});
