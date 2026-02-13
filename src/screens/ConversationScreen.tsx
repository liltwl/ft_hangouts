import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet, NativeModules, NativeEventEmitter } from 'react-native';
import Header from '../components/Header';

const { DatabaseModule, SmsModule } = NativeModules;

const ConversationScreen = ({ strings, headerColor, navigate, selectedContact }: { strings: any; headerColor: any; navigate: any; selectedContact: any }) => {
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState('');

    const load = () => {
        DatabaseModule.getMessages(selectedContact.id).then(setMessages).catch(() => { });
    };

    useEffect(() => { load(); }, []);

    useEffect(() => {
        const emitter = new NativeEventEmitter(SmsModule);
        const sub = emitter.addListener('onSmsReceived', async (event) => {
            // Match by phone number (basic match)
            if (event.sender && event.sender.includes(selectedContact.phone.slice(-9))) {
                await DatabaseModule.saveMessage(selectedContact.id, event.body, 'received');
                load();
            }
        });
        return () => sub.remove();
    }, [selectedContact]);

    const send = async () => {
        if (!text.trim()) return;
        await SmsModule.sendSms(selectedContact.phone, text);
        await DatabaseModule.saveMessage(selectedContact.id, text, 'sent');
        setText('');
        load();
    };

    return (
        <View style={styles.container}>
            <Header title={`${selectedContact.firstName}`} color={headerColor} onBack={() => navigate('detail', selectedContact)} />
            <FlatList
                data={messages}
                keyExtractor={item => String(item.id)}
                style={styles.list}
                renderItem={({ item }) => (
                    <View style={[styles.bubble, item.type === 'sent' ? styles.sent : styles.received]}>
                        <Text style={styles.msgText}>{item.body}</Text>
                        <Text style={styles.time}>{item.timestamp}</Text>
                    </View>
                )}
            />
            <View style={styles.inputRow}>
                <TextInput style={styles.input} value={text} onChangeText={setText} placeholder={strings.messages || 'Message...'} />
                <TouchableOpacity style={[styles.sendBtn, { backgroundColor: headerColor }]} onPress={send}>
                    <Text style={styles.sendText}>{strings.send || 'Send'}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f5f5' },
    list: { flex: 1, padding: 10 },
    bubble: { maxWidth: '75%', padding: 10, borderRadius: 12, marginBottom: 8 },
    sent: { alignSelf: 'flex-end', backgroundColor: '#DCF8C6' },
    received: { alignSelf: 'flex-start', backgroundColor: '#fff', borderWidth: 1, borderColor: '#eee' },
    msgText: { fontSize: 15 },
    time: { fontSize: 10, color: '#999', marginTop: 4, textAlign: 'right' },
    inputRow: { flexDirection: 'row', padding: 8, backgroundColor: '#fff', borderTopWidth: 1, borderColor: '#ddd' },
    input: { flex: 1, borderWidth: 1, borderColor: '#ddd', borderRadius: 20, paddingHorizontal: 14, fontSize: 15, marginRight: 8 },
    sendBtn: { borderRadius: 20, paddingHorizontal: 18, justifyContent: 'center' },
    sendText: { color: '#fff', fontWeight: 'bold' },
});

export default ConversationScreen;
