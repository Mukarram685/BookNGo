import { useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../utils/axiosInstance';

interface CancelResponse {
    success: boolean;
    message: string;
}

const cancelBooking = async ({ bookingId, reason }: { bookingId: string; reason?: string }) => {
    const response = await axiosInstance.delete<CancelResponse>(`/bookings/cancel/${bookingId}`, { data: { reason } });
    return response;
};

export const useCancelBooking = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: cancelBooking,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['myBookings'] });
        },
    });
};
