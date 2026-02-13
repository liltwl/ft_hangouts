import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Button, ScrollView } from 'react-native';
import { NativeModules } from 'react-native';
import Header from '../components/Header';

const { DatabaseModule } = NativeModules;

const AddContactScreen = ({ strings, headerColor, navigate }: {
    strings: any;
    headerColor: any;
    navigate: any
}) => {
    const [form, setForm] = useState({ firstName: '', lastName: '', phone: '', email: '', address: '' });

    const save = async () => {
        console.log('Saving contact', form);
        if (!form.firstName || !form.lastName || !form.phone) return;
        await DatabaseModule.addContact(form);
        navigate('home');
    };

    const field = ({ key, placeholder }: { key: string; placeholder: string }) => (
        <TextInput
            key={key}
            style={styles.input}
            placeholder={strings[key] || placeholder}
            value={form[key]}
            onChangeText={t => setForm(p => ({ ...p, [key]: t }))}
            keyboardType={key === 'phone' ? 'phone-pad' : key === 'email' ? 'email-address' : 'default'}
        />
    );

    return (
        <View style={styles.container}>
            <Header title={strings.add_contact || 'Add Contact'} color={headerColor} onBack={() => navigate('home')} />
            <ScrollView style={styles.form}>
                {field('firstName', 'First Name')}
                {field('lastName', 'Last Name')}
                {field('phone', 'Phone')}
                {field('email', 'Email')}
                {field('address', 'Address')}
                <View style={styles.buttons}>
                    <Button title={strings.cancel || 'Cancel'} onPress={() => navigate('home')} color="#999" />
                    <Button title={strings.save || 'Save'} onPress={save} color={headerColor} />
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    form: { padding: 20 },
    input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, marginBottom: 14, fontSize: 16 },
    buttons: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 10 },
});

export default AddContactScreen;
