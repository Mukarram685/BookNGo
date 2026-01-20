import { useMutation } from '@tanstack/react-query';
import axiosInstance from '../utils/axiosInstance';
import Toast from 'react-native-toast-message';

export const useRegister = () => {
    return useMutation({
        mutationFn: async (data: any) => {
            const response = await axiosInstance.post('register', data);
            return response.data;
        },

        onSuccess: (data) => {
            Toast.show({
                type: 'success',
                text1: 'Registration Successful',
                text2: data?.message || 'You can now login',
            });
        },

        onError: (error: any) => {
            Toast.show({
                type: 'error',
                text1: 'Registration Failed',
                text2:
                    error?.response?.data?.message ||
                    error?.message ||
                    'Something went wrong',
            });
        },
    });
};