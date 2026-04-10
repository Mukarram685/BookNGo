import { useMutation } from '@tanstack/react-query';
import axiosInstance from '../utils/axiosInstance';

interface PaymentIntentResponse {
    success: boolean;
    clientSecret: string;
    amount: number;
    paymentIntentId: string;
}

const createPaymentIntent = async ({ scheduleId, seatsCount }: { scheduleId: string; seatsCount: number }) => {
    const response = await axiosInstance.post<PaymentIntentResponse>('/payment/create-intent', {
        scheduleId,
        seatsCount
    });
    return response;
};

export const useCreatePaymentIntent = () => {
    return useMutation({
        mutationFn: createPaymentIntent,
    });
};
