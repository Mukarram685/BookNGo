import React, { useState } from 'react';
import {
    View,
    TextInput,
    Text,
    StyleSheet,
    TextInputProps,
    TouchableOpacity,
} from 'react-native';
import { scale, verticalScale } from 'react-native-size-matters';
import { Eye, EyeOff } from '../../assets/svg';
import Colors, { alpha } from '../../utils/Colors.util';

type AppInputProps = TextInputProps & {
    label?: string;
    error?: string;
    containerStyle?: any;
    inputStyle?: any;
    isPassword?: boolean;
    LeftIcon?: React.FC<any>;
    labelStyle?: any;
};

const AppInput: React.FC<AppInputProps> = ({
    label,
    error,
    containerStyle,
    inputStyle,
    labelStyle,
    isPassword = false,
    secureTextEntry,
    LeftIcon,
    ...props
}) => {
    const [hidePassword, setHidePassword] = useState(
        isPassword || secureTextEntry
    );

    return (
        <View style={[styles.container, containerStyle]}>
            {label && <Text style={[styles.label, props.placeholderTextColor ? { color: Colors.TEXT_GREY } : {}, labelStyle]}>{label}</Text>}

            <View
                style={[
                    styles.inputWrapper,
                    error && styles.inputError,

                    inputStyle && inputStyle.backgroundColor ? { backgroundColor: inputStyle.backgroundColor, borderColor: inputStyle.borderColor } : {}
                ]}
            >
                {LeftIcon && (
                    <View style={styles.leftIconContainer}>
                        <LeftIcon width={scale(20)} height={scale(20)} />
                    </View>
                )}
                <TextInput
                    {...props}
                    secureTextEntry={hidePassword}
                    placeholderTextColor={props.placeholderTextColor || alpha(Colors.PLACEHOLDER, 0.5)}
                    style={[styles.input, inputStyle, { color: props.style ? (props.style as any).color : Colors.WHITE }]}
                />

                {isPassword && (
                    <TouchableOpacity
                        onPress={() => setHidePassword(!hidePassword)}
                        style={styles.iconContainer}
                        activeOpacity={0.7}
                    >
                        {!hidePassword ? <Eye /> : <EyeOff />}
                    </TouchableOpacity>
                )}
            </View>

            {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
    );
};

export default AppInput;

const styles = StyleSheet.create({
    container: {
        marginBottom: verticalScale(12),
        width: '100%',
    },
    label: {
        fontSize: scale(13),
        color: Colors.TEXT_GREY,
        marginBottom: verticalScale(4),
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        height: verticalScale(46),
        borderWidth: 1,
        borderColor: Colors.BORDER_GREY,
        borderRadius: scale(8),
        backgroundColor: Colors.WHITE,
        paddingHorizontal: scale(12),
    },
    input: {
        flex: 1,
        fontSize: scale(14),
        color: Colors.WHITE,
        paddingVertical: 0,
    },
    iconContainer: {
        paddingLeft: scale(8),
    },
    leftIconContainer: {
        paddingRight: scale(8),
    },
    inputError: {
        borderColor: Colors.RED,
    },
    errorText: {
        marginTop: verticalScale(4),
        color: Colors.RED,
        fontSize: scale(11),
    },
});
