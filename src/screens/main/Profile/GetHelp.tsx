import React, { useState } from 'react';
import {
    View,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    FlatList,
    StatusBar,
    Linking,
    Modal,
    TextInput,
    KeyboardAvoidingView,
    Platform,
    TouchableWithoutFeedback,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { scale, verticalScale } from 'react-native-size-matters';
import Toast from 'react-native-toast-message';
import ScreenWrapper from '../../../component/common/ScreenWrapper';
import AppText from '../../../component/common/AppText';
import AppButton from '../../../component/common/AppButton';
import colors, { Colors } from '../../../utils/colors';
import Header from '../../../component/Header';
import {
    Arrow,
    Help,
    Phone,
    Mail,
    Feedback,
    CloseCircle,
} from '../../../assets/svg';
import {
    SUPPORT_CHANNELS,
    SUPPORT_FAQS,
    SupportChannel,
    SupportFAQ,
} from '../../../data/support.data';

interface ChatMessage {
    id: string;
    sender: 'agent' | 'user';
    text: string;
    time: string;
}

const FAQRow = ({
    item,
    isOpen,
    onToggle,
}: {
    item: SupportFAQ;
    isOpen: boolean;
    onToggle: () => void;
}) => {
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
                <AppText size={13} color="#475569" weight="500" style={styles.faqAnswer}>
                    {item.answer}
                </AppText>
            )}
        </TouchableOpacity>
    );
};

const GetHelp = () => {
    const { t } = useTranslation();
    const [openIndex, setOpenIndex] = useState<number | null>(0);
    const [isSessionModalOpen, setIsSessionModalOpen] = useState(false);
    const [inputText, setInputText] = useState('');
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
        {
            id: 'msg-1',
            sender: 'agent',
            text: 'Hello! Welcome to BookNGo Live Support. How can we assist you with your bus reservation today?',
            time: 'Just now',
        },
    ]);

    const handleToggle = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    const handleChannelPress = (channel: SupportChannel) => {
        if (channel.actionType === 'chat') {
            setIsSessionModalOpen(true);
        } else {
            Linking.openURL(channel.actionValue).catch(err => {
                console.error('Could not open link:', err);
                Toast.show({
                    type: 'error',
                    text1: 'Could not open channel',
                    text2: 'Please try another contact method.',
                    position: 'bottom',
                });
            });
        }
    };

    const handleSendMessage = () => {
        if (!inputText.trim()) return;

        const userMsg: ChatMessage = {
            id: `msg-${Date.now()}`,
            sender: 'user',
            text: inputText.trim(),
            time: 'Just now',
        };

        setChatMessages(prev => [...prev, userMsg]);
        setInputText('');

        // Simulate instant support acknowledgment
        setTimeout(() => {
            const agentReply: ChatMessage = {
                id: `msg-${Date.now() + 1}`,
                sender: 'agent',
                text: 'Thank you for reaching out. Ticket #BNG-8492 has been created for your request. A live transport representative will message you shortly.',
                time: 'Just now',
            };
            setChatMessages(prev => [...prev, agentReply]);
        }, 800);
    };

    const renderChannelIcon = (type: SupportChannel['actionType']) => {
        switch (type) {
            case 'chat':
                return <Help width={scale(20)} height={scale(20)} />;
            case 'whatsapp':
                return <Feedback width={scale(20)} height={scale(20)} />;
            case 'call':
                return <Phone width={scale(20)} height={scale(20)} />;
            case 'email':
                return <Mail width={scale(20)} height={scale(20)} />;
        }
    };

    return (
        <ScreenWrapper
            backgroundColor={Colors.BACKGROUND}
            header={<Header title={t('support_center_title') || 'Help & Support'} showBack={true} />}
        >
            <StatusBar barStyle="dark-content" backgroundColor={Colors.BACKGROUND} />
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* 1. Live Support Session Banner Card */}
                <View style={styles.sessionBannerCard}>
                    <View style={styles.bannerTopRow}>
                        <View style={styles.statusBadge}>
                            <View style={styles.statusDot} />
                            <AppText size={11} weight="800" color="#059669">
                                {t('support_agent_online') || 'AGENT ONLINE 24/7'}
                            </AppText>
                        </View>
                    </View>

                    <AppText size={18} weight="900" color={Colors.PRIMARY} style={styles.bannerTitle}>
                        {t('support_session_modal_title') || 'Live Support Session'}
                    </AppText>
                    <AppText size={13} color="#475569" weight="500" style={styles.bannerSubtitle}>
                        {t('support_session_desc') || 'Have questions regarding your bus ticket, cancellation, or schedule? Chat with us live.'}
                    </AppText>

                    <AppButton
                        title={t('support_session_btn') || 'Start Live Support Session'}
                        onPress={() => setIsSessionModalOpen(true)}
                        style={styles.startSessionButton}
                    />
                </View>

                {/* 2. Direct Support Channels Section */}
                <AppText size={13} color={Colors.TEXT_GREY} weight="800" style={styles.sectionHeader}>
                    {t('support_channels_title') || 'SUPPORT CHANNELS'}
                </AppText>

                <View style={styles.channelsCard}>
                    <FlatList
                        data={SUPPORT_CHANNELS}
                        scrollEnabled={false}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item: channel, index }) => {
                            const isLast = index === SUPPORT_CHANNELS.length - 1;
                            return (
                                <TouchableOpacity
                                    key={channel.id}
                                    style={[styles.channelRow, isLast && styles.noBorder]}
                                    activeOpacity={0.7}
                                    onPress={() => handleChannelPress(channel)}
                                >
                                    <View style={styles.channelIconCircle}>
                                        {renderChannelIcon(channel.actionType)}
                                    </View>
                                    <View style={styles.channelTextContainer}>
                                        <AppText size={15} weight="800" color={colors.PRIMARY}>
                                            {channel.title}
                                        </AppText>
                                        <AppText size={12} color="#64748B" weight="500" style={styles.channelSubtitle}>
                                            {channel.subtitle} • <AppText size={12} weight="700" color={colors.PRIMARY}>{channel.detail}</AppText>
                                        </AppText>
                                    </View>
                                    <Arrow
                                        width={scale(12)}
                                        height={scale(12)}
                                        style={{ transform: [{ rotate: '180deg' }] }}
                                        fill="#94A3B8"
                                    />
                                </TouchableOpacity>
                            );
                        }}
                    />
                </View>

                {/* 3. Frequently Asked Questions Section */}
                <AppText size={13} color={colors.TEXT_GREY} weight="800" style={styles.sectionHeader}>
                    {t('support_faqs_title') || 'FREQUENTLY ASKED QUESTIONS'}
                </AppText>

                <View style={styles.faqCard}>
                    <FlatList
                        data={SUPPORT_FAQS}
                        scrollEnabled={false}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item: faq, index }) => (
                            <FAQRow
                                key={faq.id}
                                item={faq}
                                isOpen={openIndex === index}
                                onToggle={() => handleToggle(index)}
                            />
                        )}
                    />
                </View>
            </ScrollView>

            {/* Live Chat Support Session Modal */}
            <Modal
                visible={isSessionModalOpen}
                transparent
                animationType="slide"
                onRequestClose={() => setIsSessionModalOpen(false)}
            >
                <TouchableWithoutFeedback onPress={() => setIsSessionModalOpen(false)}>
                    <View style={styles.modalOverlay}>
                        <TouchableWithoutFeedback>
                            <KeyboardAvoidingView
                                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                                style={styles.chatModalContainer}
                            >
                                {/* Chat Header */}
                                <View style={styles.chatHeader}>
                                    <View style={styles.chatHeaderInfo}>
                                        <View style={styles.agentAvatar}>
                                            <Help width={scale(18)} height={scale(18)} />
                                        </View>
                                        <View>
                                            <AppText size={16} weight="800" color={Colors.PRIMARY}>
                                                BookNGo Support Agent
                                            </AppText>
                                            <View style={styles.liveIndicatorRow}>
                                                <View style={styles.statusDot} />
                                                <AppText size={11} color="#059669" weight="700">
                                                    Online • Avg. reply 2m
                                                </AppText>
                                            </View>
                                        </View>
                                    </View>
                                    <TouchableOpacity
                                        activeOpacity={0.7}
                                        onPress={() => setIsSessionModalOpen(false)}
                                        style={styles.closeChatBtn}
                                    >
                                        <CloseCircle width={scale(26)} height={scale(26)} />
                                    </TouchableOpacity>
                                </View>

                                {/* Chat Messages List */}
                                <FlatList
                                    style={styles.chatScroll}
                                    contentContainerStyle={styles.chatScrollContent}
                                    showsVerticalScrollIndicator={false}
                                    data={chatMessages}
                                    keyExtractor={(msg) => msg.id}
                                    renderItem={({ item: msg }) => (
                                        <View
                                            style={[
                                                styles.chatBubble,
                                                msg.sender === 'user' ? styles.userBubble : styles.agentBubble,
                                            ]}
                                        >
                                            <AppText
                                                size={13}
                                                weight="500"
                                                color={msg.sender === 'user' ? Colors.WHITE : '#1E293B'}
                                            >
                                                {msg.text}
                                            </AppText>
                                            <AppText
                                                size={9}
                                                weight="600"
                                                color={msg.sender === 'user' ? 'rgba(255,255,255,0.7)' : '#94A3B8'}
                                                style={styles.chatTimeText}
                                            >
                                                {msg.time}
                                            </AppText>
                                        </View>
                                    )}
                                />

                                {/* Chat Input Bar */}
                                <View style={styles.inputContainer}>
                                    <TextInput
                                        style={styles.textInput}
                                        placeholder={t('support_input_placeholder') || 'Type your message or booking ID...'}
                                        placeholderTextColor="#94A3B8"
                                        value={inputText}
                                        onChangeText={setInputText}
                                        multiline={false}
                                    />
                                    <TouchableOpacity
                                        style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
                                        activeOpacity={0.7}
                                        onPress={handleSendMessage}
                                        disabled={!inputText.trim()}
                                    >
                                        <AppText size={13} weight="800" color={Colors.WHITE}>
                                            {t('support_send_msg') || 'Send'}
                                        </AppText>
                                    </TouchableOpacity>
                                </View>
                            </KeyboardAvoidingView>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        </ScreenWrapper>
    );
};

export default GetHelp;

const styles = StyleSheet.create({
    scrollContent: {
        paddingHorizontal: scale(16),
        paddingTop: verticalScale(12),
        paddingBottom: verticalScale(40),
    },
    sessionBannerCard: {
        backgroundColor: Colors.SURFACE,
        borderRadius: scale(20),
        padding: scale(18),
        borderWidth: 1,
        borderColor: Colors.BORDER_GREY,
        marginBottom: verticalScale(20),
        shadowColor: Colors.PRIMARY,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.06,
        shadowRadius: 10,
        elevation: 3,
    },
    bannerTopRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: verticalScale(8),
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ECFDF5',
        paddingHorizontal: scale(10),
        paddingVertical: verticalScale(4),
        borderRadius: scale(12),
        borderWidth: 1,
        borderColor: '#A7F3D0',
    },
    statusDot: {
        width: scale(7),
        height: scale(7),
        borderRadius: scale(3.5),
        backgroundColor: '#10B981',
        marginRight: scale(6),
    },
    bannerTitle: {
        marginBottom: verticalScale(4),
    },
    bannerSubtitle: {
        lineHeight: verticalScale(18),
        marginBottom: verticalScale(16),
    },
    startSessionButton: {
        backgroundColor: '#172C6B',
        borderRadius: scale(12),
        paddingVertical: verticalScale(12),
    },
    sectionHeader: {
        marginLeft: scale(4),
        marginBottom: verticalScale(8),
        letterSpacing: 0.8,
    },
    channelsCard: {
        backgroundColor: Colors.SURFACE,
        borderRadius: scale(18),
        borderWidth: 1,
        borderColor: Colors.BORDER_GREY,
        marginBottom: verticalScale(22),
        overflow: 'hidden',
        shadowColor: Colors.BLACK,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 8,
        elevation: 2,
    },
    channelRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: scale(16),
        paddingVertical: verticalScale(14),
        borderBottomWidth: 1,
        borderBottomColor: Colors.BORDER_GREY,
    },
    channelIconCircle: {
        width: scale(40),
        height: scale(40),
        borderRadius: scale(20),
        backgroundColor: '#EEF2FF',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: scale(12),
    },
    channelTextContainer: {
        flex: 1,
    },
    channelSubtitle: {
        marginTop: verticalScale(2),
    },
    faqCard: {
        backgroundColor: Colors.SURFACE,
        borderColor: Colors.BORDER_GREY,
        borderRadius: scale(18),
        borderWidth: 1,
        elevation: 2,
        overflow: 'hidden',
        shadowColor: Colors.BLACK,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 8,
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
    faqAnswer: {
        lineHeight: verticalScale(19),
        marginTop: verticalScale(10),
    },
    noBorder: {
        borderBottomWidth: 0,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(15, 23, 42, 0.6)',
        justifyContent: 'flex-end',
    },
    chatModalContainer: {
        backgroundColor: Colors.WHITE,
        borderTopLeftRadius: scale(24),
        borderTopRightRadius: scale(24),
        maxHeight: '85%',
        minHeight: '60%',
        paddingBottom: verticalScale(20),
    },
    chatHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: scale(18),
        paddingVertical: verticalScale(14),
        borderBottomWidth: 1,
        borderBottomColor: Colors.BORDER_GREY,
    },
    chatHeaderInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    agentAvatar: {
        width: scale(38),
        height: scale(38),
        borderRadius: scale(19),
        backgroundColor: '#EEF2FF',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: scale(10),
    },
    liveIndicatorRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: verticalScale(2),
    },
    closeChatBtn: {
        padding: scale(4),
    },
    chatScroll: {
        flex: 1,
    },
    chatScrollContent: {
        paddingHorizontal: scale(16),
        paddingVertical: verticalScale(16),
        rowGap: verticalScale(10),
    },
    chatBubble: {
        maxWidth: '82%',
        paddingHorizontal: scale(14),
        paddingVertical: verticalScale(10),
        borderRadius: scale(16),
    },
    agentBubble: {
        alignSelf: 'flex-start',
        backgroundColor: '#F1F5F9',
        borderBottomLeftRadius: scale(4),
    },
    userBubble: {
        alignSelf: 'flex-end',
        backgroundColor: '#172C6B',
        borderBottomRightRadius: scale(4),
    },
    chatTimeText: {
        marginTop: verticalScale(4),
        alignSelf: 'flex-end',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: scale(16),
        paddingTop: verticalScale(10),
        borderTopWidth: 1,
        borderTopColor: Colors.BORDER_GREY,
    },
    textInput: {
        flex: 1,
        backgroundColor: '#F8FAFC',
        borderRadius: scale(20),
        paddingHorizontal: scale(16),
        paddingVertical: verticalScale(10),
        fontSize: scale(13),
        color: '#1E293B',
        borderWidth: 1,
        borderColor: Colors.BORDER_GREY,
        marginRight: scale(10),
    },
    sendButton: {
        backgroundColor: '#172C6B',
        paddingHorizontal: scale(16),
        paddingVertical: verticalScale(10),
        borderRadius: scale(20),
    },
    sendButtonDisabled: {
        backgroundColor: '#94A3B8',
    },
});
