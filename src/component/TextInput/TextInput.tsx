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
};

const AppInput: React.FC<AppInputProps> = ({
    label,
    error,
    containerStyle,
    inputStyle,
    isPassword = false,
    secureTextEntry,
    ...props
}) => {
    const [hidePassword, setHidePassword] = useState(
        isPassword || secureTextEntry
    );

    return (
        <View style={[styles.container, containerStyle]}>
            {label && <Text style={styles.label}>{label}</Text>}

            <View
                style={[
                    styles.inputWrapper,
                    error && styles.inputError,
                ]}
            >
                <TextInput
                    {...props}
                    secureTextEntry={hidePassword}
                    placeholderTextColor={alpha(Colors.PLACEHOLDER, 0.5)}
                    style={[styles.input, inputStyle]}
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
        color: Colors.BLACK,
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
        color: Colors.BLACK,
        paddingVertical: 0,
    },
    iconContainer: {
        paddingLeft: scale(8),
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
