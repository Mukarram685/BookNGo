export interface NotificationItem {
    id: string;
    type: 'booking' | 'reminder' | 'payment' | 'promo' | 'system';
    title: string;
    message: string;
    timestamp: string;
    read: boolean;
    bookingId?: string;
}

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
    {
        id: 'notif-1',
        type: 'booking',
        title: 'Booking Confirmed!',
        message: 'Your bus reservation for Lahore to Islamabad is confirmed. Bus: Daewoo Express, Seat 12A.',
        timestamp: '15 mins ago',
        read: false,
        bookingId: 'BNG-92841',
    },
    {
        id: 'notif-2',
        type: 'reminder',
        title: 'Departure Reminder',
        message: 'Your bus leaves in 3 hours from Thokar Niaz Baig Terminal. Please arrive 15 minutes before departure.',
        timestamp: '2 hours ago',
        read: false,
    },
    {
        id: 'notif-3',
        type: 'payment',
        title: 'Payment Successful',
        message: 'Payment of PKR 2,850 was successfully processed for ticket #BNG-92841 via Card.',
        timestamp: 'Yesterday',
        read: true,
        bookingId: 'BNG-92841',
    },
    {
        id: 'notif-4',
        type: 'promo',
        title: 'Weekend Special: 15% OFF',
        message: 'Use promo code WEEKEND15 to get 15% off on all executive bus trips this weekend!',
        timestamp: '2 days ago',
        read: true,
    },
    {
        id: 'notif-5',
        type: 'system',
        title: 'New Route Added',
        message: 'Faisal Movers daily executive routes between Faisalabad and Multan are now open for booking.',
        timestamp: '3 days ago',
        read: true,
    },
];
