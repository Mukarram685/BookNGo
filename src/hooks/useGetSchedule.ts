import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../utils/axiosInstance';

const getScheduleById = async (id: string) => {
    const response: any = await axiosInstance.get(`/schedules/${id}`);
    return response.schedule;
};

export const useGetSchedule = (id: string) => {
    return useQuery({
        queryKey: ['schedule', id],
        queryFn: () => getScheduleById(id),
        enabled: !!id,
    });
};
