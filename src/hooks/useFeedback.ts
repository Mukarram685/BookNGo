import { useMutation } from '@tanstack/react-query';
import axiosInstance from '../utils/axiosInstance';
import Toast from 'react-native-toast-message';

export interface FeedbackPayload {
    email: string;
    description: string;
    name?: string;
    rating?: number;
}

export const useSubmitFeedback = () => {
    return useMutation({
        mutationFn: async (data: FeedbackPayload) => {
            const response = await axiosInstance.post('feedback', data);
            return response as any;
        },
        onSuccess: (data: any) => {
            Toast.show({
                type: 'success',
                text1: 'Feedback Submitted',
                text2: data?.message || 'Thank you for helping us improve BookNGo!',
                position: 'bottom',
            });
        },
        onError: (error: any) => {
            Toast.show({
                type: 'error',
                text1: 'Submission Failed',
                text2: error?.data?.message || error?.response?.data?.message || error?.message || 'Failed to submit feedback. Please try again.',
                position: 'bottom',
            });
        },
    });
};
