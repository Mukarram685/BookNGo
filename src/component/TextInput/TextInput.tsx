import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    TextInput,
    Text,
    StyleSheet,
    TextInputProps,
    TouchableOpacity,
    Animated,
} from 'react-native';
import { scale, verticalScale } from 'react-native-size-matters';
import { Eye, EyeOff } from '../../assets/svg';
import Colors from '../../utils/Colors.util';

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
    onFocus,
    onBlur,
    value,
    ...props
}) => {
    const [isFocused, setIsFocused] = useState(false);
    const [hidePassword, setHidePassword] = useState(
        isPassword || secureTextEntry
    );

    const animatedIsFocused = useRef(new Animated.Value(value ? 1 : 0)).current;

    useEffect(() => {
        Animated.timing(animatedIsFocused, {
            toValue: (isFocused || value) ? 1 : 0,
            duration: 200,
            useNativeDriver: false,
        }).start();
    }, [isFocused, value]);

    const handleFocus = (e: any) => {
        setIsFocused(true);
        if (onFocus) onFocus(e);
    };

    const handleBlur = (e: any) => {
        setIsFocused(false);
        if (onBlur) onBlur(e);
    };

    const labelTranslateY = animatedIsFocused.interpolate({
        inputRange: [0, 1],
        outputRange: [verticalScale(12), verticalScale(-10)],
    });

    const labelFontSize = animatedIsFocused.interpolate({
        inputRange: [0, 1],
        outputRange: [scale(14), scale(11)],
    });

    const labelColor = animatedIsFocused.interpolate({
        inputRange: [0, 1],
        outputRange: [Colors.TEXT_GREY, Colors.SECONDARY],
    });

    const labelTranslateX = animatedIsFocused.interpolate({
        inputRange: [0, 1],
        outputRange: [LeftIcon ? scale(40) : scale(12), scale(10)],
    });

    const displayLabel = label || props.placeholder;

    return (
        <View style={[styles.container, containerStyle]}>
            <View
                style={[
                    styles.inputWrapper,
                    isFocused && styles.inputFocused,
                    error && styles.inputError,
                    inputStyle && inputStyle.backgroundColor ? { backgroundColor: inputStyle.backgroundColor, borderColor: inputStyle.borderColor } : {}
                ]}
            >
                {displayLabel && (
                    <Animated.Text
                        style={[
                            styles.label,
                            {
                                top: labelTranslateY,
                                left: labelTranslateX,
                                fontSize: labelFontSize,
                                color: labelColor,
                                backgroundColor: inputStyle?.backgroundColor || Colors.SURFACE,
                            },
                            labelStyle,
                        ]}
                    >
                        {displayLabel}
                    </Animated.Text>
                )}

                {LeftIcon && (
                    <View style={styles.leftIconContainer}>
                        <LeftIcon width={scale(20)} height={scale(20)} color={isFocused ? Colors.SECONDARY : Colors.TEXT_GREY} />
                    </View>
                )}

                <TextInput
                    {...props}
                    value={value}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    secureTextEntry={hidePassword}
                    placeholder=""
                    style={[
                        styles.input,
                        inputStyle,
                    ]}
                />

                {isPassword && (
                    <TouchableOpacity
                        onPress={() => setHidePassword(!hidePassword)}
                        style={styles.iconContainer}
                        activeOpacity={0.7}
                    >
                        {!hidePassword ? <Eye color={Colors.SECONDARY} /> : <EyeOff color={Colors.TEXT_GREY} />}
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
        position: 'absolute',
        fontWeight: '500',
        backgroundColor: Colors.SURFACE,
        paddingHorizontal: scale(4),
        zIndex: 1,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        height: verticalScale(46),
        borderWidth: 1,
        borderColor: Colors.BORDER_GREY,
        borderRadius: scale(8),
        backgroundColor: Colors.SURFACE,
        paddingHorizontal: scale(12),
        position: 'relative',
    },
    inputFocused: {
        borderColor: Colors.SECONDARY,
        borderWidth: 1.5,
    },
    input: {
        flex: 1,
        fontSize: scale(15),
        color: Colors.BLACK,
    },
    iconContainer: {
        paddingLeft: scale(8),
    },
    leftIconContainer: {
        paddingRight: scale(10),
    },
    inputError: {
        borderColor: Colors.RED,
    },
    errorText: {
        marginTop: verticalScale(4),
        color: Colors.RED,
        fontSize: scale(11),
        fontWeight: '500',
    },
});
