import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../utils/axiosInstance';

const fetchMyBookings = async () => {
    const response = await axiosInstance.get('/bookings/my');
    return response;
};

export const useMyBookings = () => {
    return useQuery({
        queryKey: ['myBookings'],
        queryFn: fetchMyBookings,
        staleTime: 30 * 60 * 1000, // Cache data for 30 minutes
        gcTime: 60 * 60 * 1000,    // Keep garbage collection time at 60 minutes
        refetchOnWindowFocus: false,
        refetchOnMount: false,
    });
};
