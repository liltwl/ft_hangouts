import React from 'react';
import { View, Text, StyleSheet, Button, Alert } from 'react-native';
import { NativeModules } from 'react-native';
import Header from '../components/Header';

const { DatabaseModule } = NativeModules;

const ContactDetailScreen = ({ strings, headerColor, navigate, selectedContact }: { strings: any; headerColor: any; navigate: any; selectedContact: any }) => {
    const c = selectedContact;

    const confirmDelete = () => {
        Alert.alert(
            strings.delete_contact || 'Delete Contact',
            strings.confirm_delete || 'Are you sure?',
            [
                { text: strings.cancel || 'Cancel', style: 'cancel' },
                {
                    text: strings.delete_contact || 'Delete', style: 'destructive', onPress: async () => {
                        await DatabaseModule.deleteContact(c.id);
                        navigate('home');
                    }
                },
            ]
        );
    };

    const row = (label, value) => (
        <View style={styles.row}>
            <Text style={styles.label}>{label}</Text>
            <Text style={styles.value}>{value || '—'}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <Header title={`${c.firstName} ${c.lastName}`} color={headerColor} onBack={() => navigate('home')} />
            <View style={styles.body}>
                {row(strings.first_name || 'First Name', c.firstName)}
                {row(strings.last_name || 'Last Name', c.lastName)}
                {row(strings.phone || 'Phone', c.phone)}
                {row(strings.email || 'Email', c.email)}
                {row(strings.address || 'Address', c.address)}
                <View style={styles.actions}>
                    <Button title={strings.edit_contact || 'Edit'} onPress={() => navigate('edit', c)} color={headerColor} />
                    <Button title={strings.messages || 'Messages'} onPress={() => navigate('conversation', c)} color="#4CAF50" />
                    <Button title={strings.delete_contact || 'Delete'} onPress={confirmDelete} color="#e74c3c" />
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    body: { padding: 20 },
    row: { marginBottom: 16 },
    label: { fontSize: 13, color: '#888', marginBottom: 2 },
    value: { fontSize: 17 },
    actions: { marginTop: 30, gap: 12 },
});

export default ContactDetailScreen;
