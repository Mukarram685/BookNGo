export interface PolicySection {
    id: string;
    title: string;
    content: string;
    points?: string[];
}

export const getPrivacyPolicySections = (t: (key: string) => string): PolicySection[] => [
    {
        id: 'intro',
        title: t('privacy_intro_title') || 'Introduction & Scope',
        content: t('privacy_intro_desc') || 'Welcome to BookNGo. We respect your privacy and are committed to protecting your personal data. This privacy policy describes how we collect, handle, process, and safeguard your personal information when using our mobile bus ticketing application and associated travel services across Pakistan.',
    },
    {
        id: 'collection',
        title: t('privacy_collection_title') || '1. Information We Collect',
        content: t('privacy_collection_desc') || 'To provide seamless bus ticket reservations, we collect the following types of information:',
        points: [
            t('privacy_collection_p1') || 'Personal Identification: Full name, CNIC number, gender, and date of birth for ticketing and passenger manifests.',
            t('privacy_collection_p2') || 'Contact Information: Phone number (for SMS ticket confirmations and bus tracking updates) and email address.',
            t('privacy_collection_p3') || 'Booking Details: Selected bus routes, departure/arrival cities, seat numbers, travel dates, and boarding terminals.',
            t('privacy_collection_p4') || 'Payment Details: Secure transaction references (we do not store your raw credit/debit card numbers or CVV on our servers).',
            t('privacy_collection_p5') || 'Device & Location Data: Approximate location to help you find nearby bus terminals and optimize route searching.',
        ],
    },
    {
        id: 'usage',
        title: t('privacy_usage_title') || '2. How We Use Your Information',
        content: t('privacy_usage_desc') || 'We use your information strictly for legitimate travel and service purposes, including:',
        points: [
            t('privacy_usage_p1') || 'Issuing digital e-tickets and QR-coded boarding passes.',
            t('privacy_usage_p2') || 'Communicating real-time schedule updates, bus departure delays, or gate changes.',
            t('privacy_usage_p3') || 'Verifying passenger identities at bus boarding terminals in compliance with transport regulatory authorities.',
            t('privacy_usage_p4') || 'Providing 24/7 customer support and processing ticket refunds or cancellations.',
            t('privacy_usage_p5') || 'Enhancing application speed, safety, and personalized journey suggestions.',
        ],
    },
    {
        id: 'sharing',
        title: t('privacy_sharing_title') || '3. Data Sharing with Bus Operators',
        content: t('privacy_sharing_desc') || 'When you purchase a ticket, essential passenger details (Name, CNIC, Phone Number, and Seat Number) are securely transmitted to the relevant bus service operator (e.g., Faisal Movers, Daewoo Express, Bilal Travels, Sania Express) strictly to facilitate your journey and generate lawful passenger manifests.',
    },
    {
        id: 'security',
        title: t('privacy_security_title') || '4. Security & Data Protection',
        content: t('privacy_security_desc') || 'We implement industry-standard AES-256 encryption and Secure Sockets Layer (SSL) protocols for data transmission. All payment processing is handled through PCI-DSS certified banking gateways to ensure absolute financial safety.',
    },
    {
        id: 'rights',
        title: t('privacy_rights_title') || '5. Your Rights & Account Control',
        content: t('privacy_rights_desc') || 'You maintain full control over your personal data. You can:',
        points: [
            t('privacy_rights_p1') || 'View and update your profile details (Name, Phone, CNIC) anytime from the Profile settings.',
            t('privacy_rights_p2') || 'Access your complete past and active booking histories.',
            t('privacy_rights_p3') || 'Request permanent deletion of your account and associated personal data by contacting our Data Protection Officer.',
        ],
    },
    {
        id: 'contact',
        title: t('privacy_contact_title') || '6. Contact Data Protection Officer',
        content: t('privacy_contact_desc') || 'If you have any questions, concerns, or data requests regarding this Privacy Policy, please reach out to our privacy compliance team at privacy@bookngo.pk or via the in-app Support Session.',
    },
];

export const POLICY_LAST_UPDATED = 'August 2026';
