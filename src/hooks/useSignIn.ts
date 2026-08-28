import { useMutation } from '@tanstack/react-query';
import { useDispatch } from "react-redux";
import axiosInstance from "../utils/axiosInstance";
import Toast from "react-native-toast-message";
import { setCredentials } from "../store/slice/auth.slice";
import { OneSignal } from 'react-native-onesignal';

export const useLogin = () => {
    const dispatch = useDispatch();
    return useMutation({
        mutationFn: async (data: any) => {
            const response = await axiosInstance.post('login', data);
            return response as any;
        },
        onSuccess: (data) => {
            console.log('data is ', data);
            const userId = data?.user?._id || data?.user?.id;
            if (userId) {
                console.log('[OneSignal] Signing in user:', userId);
                OneSignal.login(String(userId));
            }
            Toast.show({
                type: 'success',
                text1: 'Login Successful',
                text2: 'Welcome back!',
            });
            dispatch(setCredentials({
                user: data?.user,
                token: data?.accessToken,
                refreshToken: data?.refreshToken
            }));
        },
        onError: (error: any) => {
            Toast.show({
                type: 'error',
                text1: 'Login Failed',
                text2: error?.response?.data?.message || 'Invalid credentials',
            });
        },
    });
};
