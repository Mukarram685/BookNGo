import { useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../utils/axiosInstance';
import { RescheduleRequest, RescheduleResponse } from '../interface/booking.interface';
import Toast from 'react-native-toast-message';

const rescheduleBooking = async ({ bookingId, newScheduleId, newSeats }: RescheduleRequest) => {
    const response = await axiosInstance.post<RescheduleResponse>(`/bookings/reschedule/${bookingId}`, {
        newScheduleId,
        newSeats,
    });
    return response as any;
};

export const useRescheduleBooking = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: rescheduleBooking,
        onSuccess: (data: any) => {
            queryClient.invalidateQueries({ queryKey: ['myBookings'] });
            queryClient.invalidateQueries({ queryKey: ['schedules'] });
            Toast.show({
                type: 'success',
                text1: 'Trip Rescheduled! 🔄',
                text2: data?.message || 'Your trip has been rescheduled successfully.',
            });
        },
        onError: (error: any) => {
            Toast.show({
                type: 'error',
                text1: 'Reschedule Failed',
                text2: error?.response?.data?.message || error?.message || 'Could not reschedule trip',
            });
        },
    });
};
