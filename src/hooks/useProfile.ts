import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from "../utils/axiosInstance";
import Toast from "react-native-toast-message";

export const useGetProfile = (id: string) => {
    return useQuery({
        queryKey: ['profile', id],
        queryFn: async () => {
            const response = await axiosInstance.get(`profile/getUser/${id}`);
            return response?.user;
        },
        enabled: !!id,
    });
};

export const useUpdateProfile = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, data }: { id: string, data: any }) => {
            const response = await axiosInstance.patch(`profile/updateUser/${id}`, data);
            return response;
        },
        onSuccess: (data: any) => {
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
