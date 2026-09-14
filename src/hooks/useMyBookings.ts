import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useDispatch, useSelector } from 'react-redux';
import axiosInstance from '../utils/axiosInstance';
import { setMyBookings } from '../store/slice/booking.slice';

const fetchMyBookings = async (): Promise<any> => {
    const response = await axiosInstance.get('/bookings/my');
    return response;
};

export const useMyBookings = () => {
    const dispatch = useDispatch();
    const cachedBookings = useSelector((state: any) => state?.booking?.myBookings || []);

    const query = useQuery<any>({
        queryKey: ['myBookings'],
        queryFn: fetchMyBookings,
        initialData: cachedBookings && cachedBookings.length > 0 ? { bookings: cachedBookings } : undefined,
        staleTime: 15 * 60 * 1000, // 15 minutes fresh cache
        gcTime: 24 * 60 * 60 * 1000, // 24 hours garbage collection
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchOnReconnect: false,
    });

    useEffect(() => {
        const responseData = query.data as any;
        const bookingsList = responseData?.bookings || (Array.isArray(responseData) ? responseData : null);
        if (bookingsList && Array.isArray(bookingsList) && bookingsList.length >= 0) {
            dispatch(setMyBookings(bookingsList));
        }
    }, [query.data, dispatch]);

    return query;
};
