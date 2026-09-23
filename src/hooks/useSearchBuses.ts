import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../utils/axiosInstance';

interface SearchParams {
    fromCity?: string;
    toCity?: string;
    date?: string;
    startDate?: string;
    endDate?: string;
}

const searchBuses = async (cleanedParams: Record<string, string>) => {
    console.log('Fetching /schedules/search with params:', cleanedParams);
    const response = await axiosInstance.get('/schedules/search', {
        params: cleanedParams,
    });
    return response;
};

export const useSearchBuses = (
    params?: SearchParams,
    options?: { enabled?: boolean }
) => {
    const cleanedParams: Record<string, string> = {};

    if (params) {
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null && String(value).trim() !== '') {
                cleanedParams[key] = String(value).trim();
            }
        });
    }

    return useQuery({
        queryKey: ['schedules', 'search', cleanedParams],
        queryFn: () => searchBuses(cleanedParams),
        enabled: options?.enabled !== undefined ? options.enabled : true,
        staleTime: 5 * 60 * 1000, // Cache results for 5 minutes (5 * 60 * 1000 ms)
        gcTime: 10 * 60 * 1000,    // Keep cache in memory for 10 minutes
        refetchOnWindowFocus: false,
        refetchOnMount: false,
    });
};
