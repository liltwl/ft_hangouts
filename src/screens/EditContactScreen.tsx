import React, { useState } from 'react';
import { View, TextInput, StyleSheet, ScrollView, TouchableOpacity, Text } from 'react-native';
import { NativeModules } from 'react-native';
import Header from '../components/Header';

const { DatabaseModule } = NativeModules;

const EditContactScreen = ({
    strings,
    headerColor,
    navigate,
    selectedContact
}: { strings: any; headerColor: string; navigate: any; selectedContact: any }) => {
    const [form, setForm] = useState({ ...selectedContact });

    const save = async () => {
        if (!form.firstName || !form.lastName || !form.phone) return;
        await DatabaseModule.updateContact(form.id, form);
        navigate('detail', form);
    };

    const field = (key: string, placeholder: string) => (
        <View key={key} style={styles.inputWrapper}>
            <TextInput
                style={styles.input}
                placeholder={strings[key] || placeholder}
                placeholderTextColor="#94A3B8"
                value={form[key]}
                onChangeText={t => setForm(p => ({ ...p, [key]: t }))}
            />
        </View>
    );

    return (
        <View style={[styles.container, { backgroundColor: '#0F172A' }]}>
            <Header
                title={strings.edit_contact || 'Edit Contact'}
                color={headerColor}
                onBack={() => navigate('detail', selectedContact)}
            />
            <ScrollView contentContainerStyle={styles.form}>
                {field('firstName', 'First Name')}
                {field('lastName', 'Last Name')}
                {field('phone', 'Phone')}
                {field('email', 'Email')}
                {field('address', 'Address')}

                <View style={styles.buttons}>
                    <TouchableOpacity
                        style={[styles.button, { backgroundColor: '#334155' }]}
                        onPress={() => navigate('detail', selectedContact)}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.buttonText}>{strings.cancel || 'Cancel'}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.button, { backgroundColor: headerColor }]}
                        onPress={save}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.buttonText}>{strings.save || 'Save'}</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    form: { padding: 24 },
    inputWrapper: {
        marginBottom: 16,
        borderRadius: 14,
        backgroundColor: '#1E293B',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 2,
    },
    input: {
        paddingHorizontal: 16,
        paddingVertical: 14,
        color: '#F1F5F9',
        fontSize: 16,
        borderRadius: 14,
    },
    buttons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 30,
    },
    button: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 25,
        alignItems: 'center',
        marginHorizontal: 8,
    },
    buttonText: {
        color: '#F1F5F9',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default EditContactScreen;
