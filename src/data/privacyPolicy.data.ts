export interface PolicySection {
    id: string;
    title: string;
    content: string;
    points?: string[];
}

export const PRIVACY_POLICY_SECTIONS: PolicySection[] = [
    {
        id: 'intro',
        title: 'Introduction & Scope',
        content: 'Welcome to BookNGo. We respect your privacy and are committed to protecting your personal data. This privacy policy describes how we collect, handle, process, and safeguard your personal information when using our mobile bus ticketing application and associated travel services across Pakistan.',
    },
    {
        id: 'collection',
        title: '1. Information We Collect',
        content: 'To provide seamless bus ticket reservations, we collect the following types of information:',
        points: [
            'Personal Identification: Full name, CNIC number, gender, and date of birth for ticketing and passenger manifests.',
            'Contact Information: Phone number (for SMS ticket confirmations and bus tracking updates) and email address.',
            'Booking Details: Selected bus routes, departure/arrival cities, seat numbers, travel dates, and boarding terminals.',
            'Payment Details: Secure transaction references (we do not store your raw credit/debit card numbers or CVV on our servers).',
            'Device & Location Data: Approximate location to help you find nearby bus terminals and optimize route searching.',
        ],
    },
    {
        id: 'usage',
        title: '2. How We Use Your Information',
        content: 'We use your information strictly for legitimate travel and service purposes, including:',
        points: [
            'Issuing digital e-tickets and QR-coded boarding passes.',
            'Communicating real-time schedule updates, bus departure delays, or gate changes.',
            'Verifying passenger identities at bus boarding terminals in compliance with transport regulatory authorities.',
            'Providing 24/7 customer support and processing ticket refunds or cancellations.',
            'Enhancing application speed, safety, and personalized journey suggestions.',
        ],
    },
    {
        id: 'sharing',
        title: '3. Data Sharing with Bus Operators',
        content: 'When you purchase a ticket, essential passenger details (Name, CNIC, Phone Number, and Seat Number) are securely transmitted to the relevant bus service operator (e.g., Faisal Movers, Daewoo Express, Bilal Travels, Sania Express) strictly to facilitate your journey and generate lawful passenger manifests.',
    },
    {
        id: 'security',
        title: '4. Security & Data Protection',
        content: 'We implement industry-standard AES-256 encryption and Secure Sockets Layer (SSL) protocols for data transmission. All payment processing is handled through PCI-DSS certified banking gateways to ensure absolute financial safety.',
    },
    {
        id: 'rights',
        title: '5. Your Rights & Account Control',
        content: 'You maintain full control over your personal data. You can:',
        points: [
            'View and update your profile details (Name, Phone, CNIC) anytime from the Profile settings.',
            'Access your complete past and active booking histories.',
            'Request permanent deletion of your account and associated personal data by contacting our Data Protection Officer.',
        ],
    },
    {
        id: 'contact',
        title: '6. Contact Data Protection Officer',
        content: 'If you have any questions, concerns, or data requests regarding this Privacy Policy, please reach out to our privacy compliance team at privacy@bookngo.pk or via the in-app Support Session.',
    },
];

export const POLICY_LAST_UPDATED = 'August 2026';
