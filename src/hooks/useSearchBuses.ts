import { useMutation } from '@tanstack/react-query';
import axiosInstance from '../utils/axiosInstance';
import Toast from 'react-native-toast-message';

interface SearchParams {
    fromCity?: string;
    toCity?: string;
    date?: string;
    startDate?: string;
    endDate?: string;
}

const searchBuses = async (params: SearchParams) => {
    const cleanedParams: Record<string, string> = {};

    if (params) {
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null && String(value).trim() !== '') {
                cleanedParams[key] = String(value).trim();
            }
        });
    }

    console.log('Fetching /schedules/search with params:', cleanedParams);

    const response = await axiosInstance.get('/schedules/search', {
        params: cleanedParams,
    });
    return response;
};

export const useSearchBuses = () => {
    return useMutation({
        mutationFn: searchBuses,
        onSuccess: (data: any) => {
            console.log('Search Results:', data);
            const count = data?.count ?? data?.schedules?.length ?? data?.data?.length ?? 0;
            if (count === 0) {
                Toast.show({
                    type: 'info',
                    text1: 'No buses found',
                    text2: 'Try searching for a different date or route.',
                });
            } else {
                Toast.show({
                    type: 'success',
                    text1: 'Buses found',
                    text2: `${count} buses found for this route.`,
                });
            }
        },
        onError: (error: any) => {
            console.error('Search Error:', error);
            Toast.show({
                type: 'error',
                text1: 'Search failed',
                text2: error?.data?.message || error?.message || 'Something went wrong on the server',
            });
        },
    });
};
