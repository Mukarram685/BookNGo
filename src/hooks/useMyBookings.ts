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
        refetchOnWindowFocus: true,
    });
};
