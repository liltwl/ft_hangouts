import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Button, ScrollView } from 'react-native';
import { NativeModules } from 'react-native';
import Header from '../components/Header';

const { DatabaseModule } = NativeModules;

const EditContactScreen = ({ strings, headerColor, navigate, selectedContact }: { strings: any; headerColor: any; navigate: any; selectedContact: any }) => {
    const [form, setForm] = useState({ ...selectedContact });

    const save = async () => {
        if (!form.firstName || !form.lastName || !form.phone) return;
        await DatabaseModule.updateContact(form.id, form);
        navigate('detail', form);
    };

    const field = (key, placeholder) => (
        <TextInput
            key={key}
            style={styles.input}
            placeholder={strings[key] || placeholder}
            value={form[key]}
            onChangeText={t => setForm(p => ({ ...p, [key]: t }))}
        />
    );

    return (
        <View style={styles.container}>
            <Header title={strings.edit_contact || 'Edit Contact'} color={headerColor} onBack={() => navigate('detail', selectedContact)} />
            <ScrollView style={styles.form}>
                {field('firstName', 'First Name')}
                {field('lastName', 'Last Name')}
                {field('phone', 'Phone')}
                {field('email', 'Email')}
                {field('address', 'Address')}
                <View style={styles.buttons}>
                    <Button title={strings.cancel || 'Cancel'} onPress={() => navigate('detail', selectedContact)} color="#999" />
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

export default EditContactScreen;
