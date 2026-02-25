import { useMutation } from '@tanstack/react-query';
import axiosInstance from '../utils/axiosInstance';

interface PaymentIntentResponse {
    success: boolean;
    clientSecret: string;
    amount: number;
}

const createPaymentIntent = async (bookingId: string) => {
    const response = await axiosInstance.post<PaymentIntentResponse>('/payment/create-intent', {
        bookingId
    });
    return response;
};

export const useCreatePaymentIntent = () => {
    return useMutation({
        mutationFn: createPaymentIntent,
    });
};
