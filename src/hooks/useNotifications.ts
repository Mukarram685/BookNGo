import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../utils/axiosInstance';

export interface UserNotification {
    id: string;
    _id?: string;
    title: string;
    message: string;
    type: 'booking' | 'reminder' | 'payment' | 'promo' | 'system';
    read: boolean;
    timestamp?: string;
    createdAt?: string;
    bookingId?: string;
    data?: any;
}

const fetchMyNotifications = async (): Promise<UserNotification[]> => {
    const response: any = await axiosInstance.get('notifications');
    if (response?.notifications && Array.isArray(response.notifications)) {
        return response.notifications;
    }
    if (Array.isArray(response)) {
        return response;
    }
    return [];
};

export const useNotifications = () => {
    return useQuery({
        queryKey: ['notifications'],
        queryFn: fetchMyNotifications,
        staleTime: 60 * 1000, // 1 minute stale time
        refetchOnMount: true,
        refetchOnWindowFocus: true,
    });
};

export const useMarkNotificationRead = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: string) => {
            return await axiosInstance.patch(`notifications/${id}/read`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
        },
    });
};

export const useMarkAllNotificationsRead = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async () => {
            return await axiosInstance.patch('notifications/read-all');
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
        },
    });
};

export const useClearAllNotifications = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async () => {
            return await axiosInstance.delete('notifications/clear');
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
        },
    });
};
