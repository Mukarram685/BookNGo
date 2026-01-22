import { useMutation } from '@tanstack/react-query';
import axiosInstance from '../utils/axiosInstance';
import Toast from 'react-native-toast-message';

interface SearchParams {
    fromCity: string;
    toCity: string;
    date: string;
}

const searchBuses = async (params: SearchParams) => {
    const response = await axiosInstance.get('/schedules/search', {
        params: {
            fromCity: params.fromCity,
            toCity: params.toCity,
            date: params.date,
        },
    });
    return response;
};

export const useSearchBuses = () => {
    return useMutation({
        mutationFn: searchBuses,
        onSuccess: (data) => {
            console.log('Search Results:', data);
            if (data.count === 0) {
                Toast.show({
                    type: 'info',
                    text1: 'No buses found',
                    text2: 'Try searching for a different date or route.',
                });
            } else {
                Toast.show({
                    type: 'success',
                    text1: 'Buses found',
                    text2: `${data.count} buses found for this route.`,
                });
            }
        },
        onError: (error: any) => {
            console.error('Search Error:', error);
            Toast.show({
                type: 'error',
                text1: 'Search failed',
                text2: error?.data?.message || 'Something went wrong',
            });
        },
    });
};
