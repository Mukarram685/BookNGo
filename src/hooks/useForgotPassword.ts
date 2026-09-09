import { useMutation } from '@tanstack/react-query';
import axiosInstance from '../utils/axiosInstance';
import Toast from 'react-native-toast-message';

export const useForgotPassword = () => {
    return useMutation({
        mutationFn: async (data: { email: string }) => {
            const response = await axiosInstance.post('/forgot-password', data);
            return response as any;
        },
        onSuccess: (data: any) => {
            Toast.show({
                type: 'success',
                text1: 'Verification Code Sent',
                text2: data?.message || 'Please check your email for the 6-digit code.',
            });
        },
        onError: (error: any) => {
            Toast.show({
                type: 'error',
                text1: 'Request Failed',
                text2: error?.data?.message || error?.response?.data?.message || error?.message || 'Could not send verification code',
            });
        },
    });
};

export const useVerifyOTP = () => {
    return useMutation({
        mutationFn: async (data: { email: string; otp: string }) => {
            const response = await axiosInstance.post('verify-otp', data);
            return response as any;
        },
        onSuccess: (data: any) => {
            Toast.show({
                type: 'success',
                text1: 'Code Verified',
                text2: data?.message || 'Please set your new password.',
            });
        },
        onError: (error: any) => {
            Toast.show({
                type: 'error',
                text1: 'Verification Failed',
                text2: error?.data?.message || error?.response?.data?.message || error?.message || 'Invalid or expired code',
            });
        },
    });
};

export const useResetPassword = () => {
    return useMutation({
        mutationFn: async (data: { email: string; otp?: string; newPassword: string }) => {
            const response = await axiosInstance.post('reset-password', data);
            return response as any;
        },
        onSuccess: (data: any) => {
            Toast.show({
                type: 'success',
                text1: 'Password Reset Successful',
                text2: data?.message || 'You can now sign in with your new password.',
            });
        },
        onError: (error: any) => {
            Toast.show({
                type: 'error',
                text1: 'Reset Failed',
                text2: error?.data?.message || error?.response?.data?.message || error?.message || 'Could not reset password',
            });
        },
    });
};
