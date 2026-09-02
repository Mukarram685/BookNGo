import React from 'react';
import {
    TicketStat,
    CalendarStat,
    CheckStat,
    CrossStat,
} from '../assets/svg';

export interface BookingStatItem {
    id: string;
    titleKey: string;
    fallbackTitle: string;
    countKey: 'allCount' | 'upcomingCount' | 'completedCount' | 'cancelledCount';
    bgColor: string;
    IconComponent: React.FC<any>;
}

export const BOOKING_STATS_DATA: BookingStatItem[] = [
    {
        id: 'total',
        titleKey: 'total_bookings',
        fallbackTitle: 'Total Bookings',
        countKey: 'allCount',
        bgColor: '#EFF6FF',
        IconComponent: TicketStat,
    },
    {
        id: 'upcoming',
        titleKey: 'stat_upcoming',
        fallbackTitle: 'Upcoming',
        countKey: 'upcomingCount',
        bgColor: '#F0FDF4',
        IconComponent: CalendarStat,
    },
    {
        id: 'completed',
        titleKey: 'stat_completed',
        fallbackTitle: 'Completed',
        countKey: 'completedCount',
        bgColor: '#F5F3FF',
        IconComponent: CheckStat,
    },
    {
        id: 'cancelled',
        titleKey: 'stat_cancelled',
        fallbackTitle: 'Cancelled',
        countKey: 'cancelledCount',
        bgColor: '#FEF2F2',
        IconComponent: CrossStat,
    },
];
