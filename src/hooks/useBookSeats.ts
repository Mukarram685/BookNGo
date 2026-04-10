import { useMutation } from '@tanstack/react-query';
import axiosInstance from '../utils/axiosInstance';
import { BookingRequest, BookingResponse } from '../interface/booking.interface';
import Toast from 'react-native-toast-message';

export const useBookSeats = () => {
    return useMutation({
        mutationFn: async (data: BookingRequest) => {
            console.log('Booking data:', data);
            const response = await axiosInstance.post<BookingResponse>('/bookings/book', data);
            console.log('Booking response:', response);
            return response as any;
        },
        onSuccess: (data) => {
            Toast.show({
                type: 'success',
                text1: 'Success',
                text2: data.message || 'Booking confirmed successfully!',
            });
        },
        onError: (error: any) => {
            Toast.show({
                type: 'error',
                text1: 'Booking Failed',
                text2: error?.response?.data?.message || 'Something went wrong',
            });
        },
    });
};
