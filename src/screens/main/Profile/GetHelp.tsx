import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { scale, verticalScale } from 'react-native-size-matters';
import ScreenWrapper from '../../../component/common/ScreenWrapper';
import AppText from '../../../component/common/AppText';
import Colors from '../../../utils/Colors.util';
import Header from '../../../component/Header';
import { Arrow } from '../../../assets/svg';

interface FAQItem {
    question: string;
    answer: string;
}

const FAQRow = ({ item, isOpen, onToggle }: { item: FAQItem; isOpen: boolean; onToggle: () => void }) => {
    return (
        <TouchableOpacity style={styles.faqRow} onPress={onToggle} activeOpacity={0.7}>
            <View style={styles.faqHeader}>
                <AppText size={14} weight="700" color={Colors.PRIMARY} style={styles.faqQuestion}>
                    {item.question}
                </AppText>
                <Arrow
                    width={scale(12)}
                    height={scale(12)}
                    style={{ transform: [{ rotate: isOpen ? '90deg' : '180deg' }] }}
                    fill={Colors.PRIMARY}
                />
            </View>
            {isOpen && (
                <AppText size={13} color={Colors.TEXT_GREY} weight="500" style={styles.faqAnswer}>
                    {item.answer}
                </AppText>
            )}
        </TouchableOpacity>
    );
};

const GetHelp = () => {
    const { t } = useTranslation();
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const faqs: FAQItem[] = [
        {
            question: "How do I book a ticket?",
            answer: "Simply go to the Search tab, choose your departure and destination locations, select dates, find a transit option, choose seats, enter passenger info, and complete the payment."
        },
        {
            question: "Can I cancel my booking?",
            answer: "Yes, you can cancel your booking from the Booking History page. Please note that refund eligibility and fees depend on the transit provider's cancellation policy."
        },
        {
            question: "How do I download my ticket?",
            answer: "After booking, you will receive a confirmation. Navigate to Booking History, select the booking, and download your ticket as a PDF or view the QR code."
        },
        {
            question: "What payment methods are supported?",
            answer: "We support major credit/debit cards (Visa, MasterCard), Stripe, and other localized digital payment methods depending on your location."
        }
    ];

    const handleToggle = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <ScreenWrapper 
            backgroundColor={Colors.BACKGROUND} 
            header={<Header title={t('profile_help') || 'FAQ & Help'} showBack={true} />}
        >
                
                {/* Contact Support Section */}
                <AppText size={13} color={Colors.TEXT_GREY} weight="800" style={styles.sectionHeader}>
                    CONTACT US
                </AppText>
                <View style={styles.contactCard}>
                    <View style={styles.contactItem}>
                        <AppText size={15} weight="800" color={Colors.PRIMARY}>
                            Email Support
                        </AppText>
                        <AppText size={13} color={Colors.TEXT_GREY} weight="600" style={styles.contactSubText}>
                            support@bookngo.com
                        </AppText>
                    </View>
                    <View style={[styles.contactItem, styles.noBorder]}>
                        <AppText size={15} weight="800" color={Colors.PRIMARY}>
                            Phone Support
                        </AppText>
                        <AppText size={13} color={Colors.TEXT_GREY} weight="600" style={styles.contactSubText}>
                            +1 (800) 555-0199
                        </AppText>
                    </View>
                </View>

                {/* FAQ Accordion Section */}
                <AppText size={13} color={Colors.TEXT_GREY} weight="800" style={styles.sectionHeader}>
                    FREQUENTLY ASKED QUESTIONS
                </AppText>
                <View style={styles.faqCard}>
                    {faqs.map((faq, index) => (
                        <FAQRow
                            key={index}
                            item={faq}
                            isOpen={openIndex === index}
                            onToggle={() => handleToggle(index)}
                        />
                    ))}
                </View>

        </ScreenWrapper>
    );
};

const styles = StyleSheet.create({
    contactCard: {
        backgroundColor: Colors.SURFACE,
        borderColor: Colors.BORDER_GREY,
        borderRadius: scale(18),
        borderWidth: 1,
        elevation: 3,
        marginBottom: verticalScale(25),
        overflow: 'hidden',
        shadowColor: Colors.BLACK,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.03,
        shadowRadius: 12,
    },
    contactItem: {
        borderBottomColor: Colors.BORDER_GREY,
        borderBottomWidth: 1,
        paddingHorizontal: scale(16),
        paddingVertical: verticalScale(16),
    },
    contactSubText: {
        marginTop: verticalScale(2),
    },
    faqAnswer: {
        lineHeight: verticalScale(18),
        marginTop: verticalScale(10),
    },
    faqCard: {
        backgroundColor: Colors.SURFACE,
        borderColor: Colors.BORDER_GREY,
        borderRadius: scale(18),
        borderWidth: 1,
        elevation: 3,
        overflow: 'hidden',
        shadowColor: Colors.BLACK,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.03,
        shadowRadius: 12,
    },
    faqHeader: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    faqQuestion: {
        flex: 1,
        marginRight: scale(10),
    },
    faqRow: {
        borderBottomColor: Colors.BORDER_GREY,
        borderBottomWidth: 1,
        paddingHorizontal: scale(16),
        paddingVertical: verticalScale(16),
    },
    noBorder: {
        borderBottomWidth: 0,
    },
    sectionHeader: {
        letterSpacing: 1,
        marginBottom: verticalScale(8),
        marginLeft: scale(6),
    },
});

export default GetHelp;
