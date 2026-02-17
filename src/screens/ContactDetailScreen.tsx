import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { NativeModules } from 'react-native';
import Header from '../components/Header';

const { DatabaseModule } = NativeModules;

const ContactDetailScreen = ({
    strings,
    headerColor,
    navigate,
    selectedContact
}: { strings: any; headerColor: string; navigate: any; selectedContact: any }) => {
    const c = selectedContact;

    const confirmDelete = () => {
        Alert.alert(
            strings.delete_contact || 'Delete Contact',
            strings.confirm_delete || 'Are you sure?',
            [
                { text: strings.cancel || 'Cancel', style: 'cancel' },
                {
                    text: strings.delete_contact || 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        await DatabaseModule.deleteContact(c.id);
                        navigate('home');
                    }
                },
            ]
        );
    };

    const row = (label: string, value: string) => (
        <View style={styles.row}>
            <Text style={styles.label}>{label}</Text>
            <View style={styles.valueWrapper}>
                <Text style={styles.value}>{value || '—'}</Text>
            </View>
        </View>
    );

    const ActionButton = ({ title, color, onPress }: { title: string; color: string; onPress: () => void }) => (
        <TouchableOpacity
            style={[styles.button, { backgroundColor: color }]}
            onPress={onPress}
            activeOpacity={0.8}
        >
            <Text style={styles.buttonText}>{title}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={[styles.container, { backgroundColor: '#0F172A' }]}>
            <Header
                title={`${c.firstName} ${c.lastName}`}
                color={headerColor}
                onBack={() => navigate('home')}
            />
            <ScrollView contentContainerStyle={styles.body}>
                {row(strings.first_name || 'First Name', c.firstName)}
                {row(strings.last_name || 'Last Name', c.lastName)}
                {row(strings.phone || 'Phone', c.phone)}
                {row(strings.email || 'Email', c.email)}
                {row(strings.address || 'Address', c.address)}

                <View style={styles.actions}>
                    <ActionButton
                        title={strings.edit_contact || 'Edit'}
                        color={headerColor}
                        onPress={() => navigate('edit', c)}
                    />
                    <ActionButton
                        title={strings.messages || 'Messages'}
                        color="#4CAF50"
                        onPress={() => navigate('conversation', c)}
                    />
                    <ActionButton
                        title={strings.delete_contact || 'Delete'}
                        color="#e74c3c"
                        onPress={confirmDelete}
                    />
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    body: { padding: 24 },
    row: {
        marginBottom: 16,
        padding: 16,
        borderRadius: 14,
        backgroundColor: '#1E293B',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 2,
    },
    label: { fontSize: 13, color: '#94A3B8', marginBottom: 4 },
    valueWrapper: {},
    value: { fontSize: 16, color: '#F1F5F9' },
    actions: {
        marginTop: 30,
        flexDirection: 'column',
        gap: 12,
    },
    button: {
        paddingVertical: 14,
        borderRadius: 25,
        alignItems: 'center',
    },
    buttonText: { color: '#F1F5F9', fontSize: 16, fontWeight: '600' },
});

export default ContactDetailScreen;
