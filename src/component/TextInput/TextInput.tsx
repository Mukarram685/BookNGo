import React, { useState, useRef } from 'react';
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
import colors, { Colors } from '../../utils/colors';

type AppInputProps = TextInputProps & {
    label?: string;
    required?: boolean;
    error?: string;
    containerStyle?: any;
    inputStyle?: any;
    shellStyle?: any;
    labelStyle?: any;
    isPassword?: boolean;
    LeftIcon?: React.FC<any>;
};

const AppInput: React.FC<AppInputProps> = ({
    label,
    required = false,
    error,
    containerStyle,
    inputStyle,
    shellStyle,
    labelStyle,
    isPassword = false,
    secureTextEntry,
    LeftIcon,
    onFocus,
    onBlur,
    value,
    placeholder,
    placeholderTextColor = Colors.TEXT_GREY,
    ...props
}) => {
    const [isFocused, setIsFocused] = useState(false);
    const [hidePassword, setHidePassword] = useState(
        isPassword || secureTextEntry
    );

    const inputRef = useRef<TextInput>(null);

    const handleFocus = (e: any) => {
        setIsFocused(true);
        if (onFocus) onFocus(e);
    };

    const handleBlur = (e: any) => {
        setIsFocused(false);
        if (onBlur) onBlur(e);
    };

    const handleContainerPress = () => {
        inputRef.current?.focus();
    };

    const displayLabel = label || placeholder;

    let borderColor = Colors.BORDER_GREY;
    let labelColor = Colors.TEXT_GREY;

    if (error) {
        borderColor = Colors.RED;
        labelColor = Colors.RED;
    } else if (isFocused) {
        borderColor = Colors.PRIMARY;
        labelColor = Colors.PRIMARY;
    }

    return (
        <View style={[styles.container, containerStyle]}>
            <TouchableOpacity
                activeOpacity={1}
                onPress={handleContainerPress}
                style={[
                    styles.inputWrapper,
                    { borderColor },
                    isFocused && styles.inputWrapperFocused,
                    error && styles.inputWrapperError,
                    shellStyle,
                ]}
            >
                {displayLabel && (
                    <View style={styles.labelContainer}>
                        <Text style={[styles.labelText, { color: labelColor }, labelStyle]}>
                            {displayLabel} {required && <Text style={styles.asterisk}>*</Text>}
                        </Text>
                    </View>
                )}

                {LeftIcon && (
                    <View style={styles.leftIconContainer} pointerEvents="none">
                        <LeftIcon
                            width={scale(18)}
                            height={scale(18)}
                            color={isFocused ? Colors.PRIMARY : Colors.TEXT_GREY}
                        />
                    </View>
                )}

                <TextInput
                    ref={inputRef}
                    {...props}
                    value={value}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    secureTextEntry={hidePassword}
                    placeholder={isFocused || !displayLabel ? placeholder : ''}
                    placeholderTextColor={placeholderTextColor}
                    style={[styles.input, inputStyle]}
                />

                {(isPassword || secureTextEntry !== undefined) && (
                    <TouchableOpacity
                        onPress={() => setHidePassword(!hidePassword)}
                        style={styles.iconContainer}
                        activeOpacity={0.7}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                        {!hidePassword ? (
                            <Eye width={scale(18)} height={scale(18)} color={isFocused ? Colors.PRIMARY : Colors.TEXT_GREY} />
                        ) : (
                            <EyeOff width={scale(18)} height={scale(18)} color={Colors.TEXT_GREY} />
                        )}
                    </TouchableOpacity>
                )}
            </TouchableOpacity>

            {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: verticalScale(16),
        width: '100%',
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        height: verticalScale(48),
        borderWidth: 1,
        borderColor: Colors.BORDER_GREY,
        borderRadius: scale(10),
        backgroundColor: Colors.SURFACE,
        paddingHorizontal: scale(14),
        position: 'relative',
    },
    inputWrapperFocused: {
        borderWidth: 1.8,
        borderColor: Colors.PRIMARY,
    },
    inputWrapperError: {
        borderWidth: 1.8,
        borderColor: Colors.RED,
    },
    labelContainer: {
        position: 'absolute',
        top: -verticalScale(9),
        left: scale(12),
        backgroundColor: Colors.SURFACE,
        paddingHorizontal: scale(4),
        zIndex: 10,
    },
    labelText: {
        fontSize: scale(11),
        fontWeight: '600',
        color: Colors.TEXT_GREY,
    },
    asterisk: {
        color: Colors.RED,
    },
    input: {
        flex: 1,
        height: '100%',
        fontSize: scale(14),
        color: Colors.BLACK,
        paddingVertical: 0,
    },
    leftIconContainer: {
        paddingRight: scale(10),
    },
    iconContainer: {
        paddingLeft: scale(8),
    },
    errorText: {
        marginTop: verticalScale(4),
        color: Colors.RED,
        fontSize: scale(11),
        fontWeight: '500',
        marginLeft: scale(4),
    },
});

export default AppInput;
