export interface SupportChannel {
    id: string;
    title: string;
    subtitle: string;
    detail: string;
    actionType: 'chat' | 'whatsapp' | 'call' | 'email';
    actionValue: string;
    isAvailable247?: boolean;
}

export interface SupportFAQ {
    id: string;
    category: 'booking' | 'refund' | 'luggage' | 'payment';
    question: string;
    answer: string;
}

export const SUPPORT_CHANNELS: SupportChannel[] = [
    {
        id: 'live_chat',
        title: 'Live Chat Support Session',
        subtitle: 'Instant agent assistance',
        detail: 'Avg. response time: 2 mins',
        actionType: 'chat',
        actionValue: 'live_chat_session',
        isAvailable247: true,
    },
    {
        id: 'whatsapp',
        title: 'WhatsApp Official Support',
        subtitle: 'Chat directly on WhatsApp',
        detail: '+92 300 1234567',
        actionType: 'whatsapp',
        actionValue: 'https://wa.me/923001234567?text=Hello%20BookNGo%20Support,%20I%20need%20assistance%20with%20my%20booking.',
    },
    {
        id: 'call',
        title: '24/7 Phone Helpline (UAN)',
        subtitle: 'Call customer care center',
        detail: '042-111-266-564',
        actionType: 'call',
        actionValue: 'tel:042111266564',
    },
    {
        id: 'email',
        title: 'Email Ticketing Support',
        subtitle: 'Send formal tickets and complaints',
        detail: 'support@bookngo.pk',
        actionType: 'email',
        actionValue: 'mailto:support@bookngo.pk?subject=BookNGo%20Support%20Inquiry',
    },
];

export const SUPPORT_FAQS: SupportFAQ[] = [
    {
        id: 'faq-1',
        category: 'booking',
        question: 'How do I book a bus ticket on BookNGo?',
        answer: 'Select your Departure City, Destination City, and Travel Date on the Home screen. Browse available bus services (e.g., Daewoo Express, Faisal Movers), pick your seats, enter CNIC/passenger info, and complete payment.',
    },
    {
        id: 'faq-2',
        category: 'booking',
        question: 'Do I need a printed ticket at the terminal?',
        answer: 'No! BookNGo provides a digital E-Ticket with a QR Code. You can present your digital ticket on your phone directly to the bus conductor at the boarding terminal.',
    },
    {
        id: 'faq-3',
        category: 'refund',
        question: 'How can I cancel my bus ticket and get a refund?',
        answer: 'Go to the My Bookings tab, select your active booking, and tap "Cancel Booking". Cancellations made at least 4 hours before departure are eligible for instant wallet credit or bank refund as per the operator policy.',
    },
    {
        id: 'faq-4',
        category: 'payment',
        question: 'Which payment methods are accepted?',
        answer: 'We support Visa/Mastercard debit and credit cards, JazzCash, Easypaisa, 1Link Online Banking, and Pay-at-Terminal options.',
    },
    {
        id: 'faq-5',
        category: 'luggage',
        question: 'What is the standard luggage allowance per seat?',
        answer: 'Standard bus tickets include up to 20kg of cargo luggage and 1 small carry-on bag. Extra baggage can be booked at the bus terminal parcel counter.',
    },
];
