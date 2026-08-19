import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import axiosInstance from "../utils/axiosInstance";
import Toast from "react-native-toast-message";
import { updateUser } from '../store/slice/auth.slice';

export const useGetProfile = (id: string) => {
    const dispatch = useDispatch();
    return useQuery({
        queryKey: ['profile', id],
        queryFn: async () => {
            try {
                const response: any = await axiosInstance.get(`profile/getUser/${id}`);
                const userData = response?.user || response;
                if (userData) {
                    dispatch(updateUser(userData));
                }
                return userData;
            } catch (error) {
                // If offline or error occurs, fail gracefully without breaking state
                console.log('Failed to fetch profile online, relying on stored Redux data:', error);
                return null;
            }
        },
        enabled: !!id,
        staleTime: Infinity,
        gcTime: 1000 * 60 * 60 * 24, // Keep in cache
        retry: 1,
    });
};

export const useUpdateProfile = () => {
    const queryClient = useQueryClient();
    const dispatch = useDispatch();

    return useMutation({
        mutationFn: async ({ id, data }: { id: string, data: any }) => {
            const response: any = await axiosInstance.patch(`profile/updateUser/${id}`, data);
            return { response, sentData: data };
        },
        onSuccess: ({ response, sentData }: any) => {
            const updatedUserData = response?.user || response?.data?.user || sentData;
            dispatch(updateUser(updatedUserData));

            Toast.show({
                type: 'success',
                text1: 'Success',
                text2: 'Profile updated successfully',
            });
            queryClient.invalidateQueries({ queryKey: ['profile'] });
        },
        onError: (error: any) => {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: error?.data?.message || 'Failed to update profile',
            });
        },
    });
};

export const useChangePassword = () => {
    return useMutation({
        mutationFn: async ({ id, data }: { id: string, data: any }) => {
            const response = await axiosInstance.patch(`profile/changePassword/${id}`, data);
            return response;
        },
        onSuccess: () => {
            Toast.show({
                type: 'success',
                text1: 'Success',
                text2: 'Password changed successfully',
            });
        },
        onError: (error: any) => {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: error?.data?.message || 'Failed to change password',
            });
        },
    });
};
