import { useMutation } from '@tanstack/react-query';
import axiosInstance from '../utils/axiosInstance';
import Toast from 'react-native-toast-message';

export interface RegisterCompanyPayload {
    name: string;
    email: string;
    address: string;
    phone: string;
    userId: string;
}

export const useRegisterCompany = () => {
    return useMutation({
        mutationFn: async (data: RegisterCompanyPayload) => {
            const response = await axiosInstance.post('/companies/company-requests', data);
            return response as any;
        },
        onSuccess: (data: any) => {
            Toast.show({
                type: 'success',
                text1: 'Request Submitted',
                text2: data?.message || 'Company request submitted successfully. Waiting for Super Admin approval.',
                position: 'bottom',
            });
        },
        onError: (error: any) => {
            Toast.show({
                type: 'error',
                text1: 'Registration Failed',
                text2:
                    error?.data?.message ||
                    error?.response?.data?.message ||
                    error?.message ||
                    'Failed to submit company registration request. Please try again.',
                position: 'bottom',
            });
        },
    });
};
