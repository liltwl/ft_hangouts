import React, { useState, useEffect, useCallback } from 'react';
import {
    View, Text, TextInput, FlatList,
    TouchableOpacity, StyleSheet, NativeModules, NativeEventEmitter, Platform, StatusBar
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'; // or FontAwesome, Ionicons, etc.
import Header from '../components/Header';

const { DatabaseModule, SmsModule } = NativeModules;

const ChatHeader = ({ contact, headerColor, onBack, strings }: any) => (
    <View style={[styles.header, { backgroundColor: headerColor, paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight! + 8 : 40 }]}>
        <TouchableOpacity onPress={onBack} style={styles.backBtnContainer} activeOpacity={0.7}>
            <Icon name="arrow-back" size={24} color="#F1F5F9" />
            <Text style={styles.backText}>{strings.back || 'Back'}</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{contact?.firstName} {contact?.lastName}</Text>
        <View style={{ width: 48 }} /> {/* empty placeholder for right side */}
    </View>
);


const ConversationScreen = ({ selectedContact: contact, headerColor, strings, navigate }: {
    selectedContact: any; headerColor: string; strings: any; navigate: any
}) => {
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState('');

    const onBack = () => navigate('detail', contact);

    const loadMessages = useCallback(async () => {
        if (!DatabaseModule || !contact?.id) return;
        try {
            const msgs = await DatabaseModule.getMessages(contact.id);
            setMessages(msgs);
        } catch (error) {
            console.log('Failed to load messages:', error);
        }
    }, [contact?.id]);

    useEffect(() => {
        loadMessages();
        const emitter = new NativeEventEmitter(SmsModule);
        const sub = emitter.addListener('onSmsReceived', async (event) => {
            await DatabaseModule.saveMessage(contact?.id, event.body, 'received');
            loadMessages();
        });
        return () => sub.remove();
    }, [loadMessages]);

    const send = async () => {
        if (!text.trim()) return;
        try {
            await DatabaseModule.saveMessage(contact?.id, text, 'sent');
            loadMessages();
            SmsModule.sendSms(contact?.phone, text); // fake auto-reply
            setText('');
        } catch (error) {
            console.log('Send failed:', error);
        }
    };

    const renderItem = ({ item }) => (
        <View style={[
            styles.bubble,
            item.type === 'sent' ? { backgroundColor: headerColor, alignSelf: 'flex-end' } : styles.received
        ]}>
            <Text style={[styles.msgText, item.type === 'sent' && { color: '#fff' }]}>{item.body}</Text>
            <Text style={styles.time}>{new Date(parseInt(item.timestamp)).toLocaleTimeString()}</Text>
        </View>
    );

    return (
        <View style={[styles.container, { backgroundColor: '#0F172A' }]}>
            <Header
                title={strings.edit_contact || 'Edit Contact'}
                color={headerColor}
                onBack={() => navigate('detail', contact)}
            />
            <FlatList
                data={messages}
                keyExtractor={(_, i) => i.toString()}
                renderItem={renderItem}
                contentContainerStyle={styles.list}
            />
            <View style={styles.inputRow}>
                <TextInput
                    style={styles.input}
                    value={text}
                    onChangeText={setText}
                    placeholder={strings.typeMessage || 'Type a message...'}
                    placeholderTextColor="#94A3B8"
                />
                <TouchableOpacity style={[styles.sendBtn, { backgroundColor: headerColor }]} onPress={send}>
                    <Text style={styles.sendText}>{strings.send || 'Send'}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 14,
        height: 60,
        paddingVertical: 10,
    },
    backBtnContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: 80,
    },
    backText: {
        color: '#F1F5F9',
        fontSize: 16,
        marginLeft: 4,
    },
    title: {
        flex: 1,
        textAlign: 'center',
        fontSize: 18,
        fontWeight: 'bold',
        color: '#F1F5F9',
    },
    backBtn: { color: '#F1F5F9', fontSize: 16, marginRight: 12 },
    list: { padding: 12 },
    bubble: {
        padding: 12,
        borderRadius: 16,
        marginVertical: 4,
        maxWidth: '75%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
    },
    received: {
        backgroundColor: '#1E293B',
        alignSelf: 'flex-start'
    },
    msgText: { fontSize: 15, color: '#F1F5F9' },
    time: { fontSize: 10, color: '#94A3B8', marginTop: 4, alignSelf: 'flex-end' },
    inputRow: {
        flexDirection: 'row',
        padding: 10,
        borderTopWidth: 1,
        borderColor: '#334155',
        backgroundColor: '#0F172A'
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#334155',
        borderRadius: 25,
        paddingHorizontal: 16,
        paddingVertical: 10,
        fontSize: 15,
        color: '#F1F5F9',
        backgroundColor: '#1E293B'
    },
    sendBtn: {
        marginLeft: 8,
        borderRadius: 25,
        paddingHorizontal: 16,
        justifyContent: 'center',
        alignItems: 'center'
    },
    sendText: { color: '#F1F5F9', fontWeight: '600' },
});

export default ConversationScreen;
