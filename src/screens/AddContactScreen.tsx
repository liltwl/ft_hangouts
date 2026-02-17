import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Text, ScrollView } from 'react-native';
import { NativeModules } from 'react-native';
import Header from '../components/Header';

const { DatabaseModule } = NativeModules;

const AddContactScreen = ({ strings, headerColor, navigate }: {
    strings: any;
    headerColor: string; // dynamic user-selected color
    navigate: any
}) => {
    const [form, setForm] = useState({ firstName: '', lastName: '', phone: '', email: '', address: '' });

    const save = async () => {
        if (!form.firstName || !form.lastName || !form.phone) return;
        await DatabaseModule.addContact(form);
        navigate('home');
    };

    const field = ({ key, placeholder }: { key: string; placeholder: string }) => (
        <View key={key} style={styles.inputWrapper}>
            <TextInput
                style={styles.input}
                placeholder={strings[key] || placeholder}
                placeholderTextColor="#94A3B8"
                value={form[key]}
                onChangeText={t => setForm(p => ({ ...p, [key]: t }))}
                keyboardType={key === 'phone' ? 'phone-pad' : key === 'email' ? 'email-address' : 'default'}
            />
        </View>
    );

    return (
        <View style={[styles.container, { backgroundColor: '#0F172A' }]}>
            <Header title={strings.add_contact || 'Add Contact'} color={headerColor} onBack={() => navigate('home')} />
            <ScrollView contentContainerStyle={styles.form}>
                {field({ key: 'firstName', placeholder: 'First Name' })}
                {field({ key: 'lastName', placeholder: 'Last Name' })}
                {field({ key: 'phone', placeholder: 'Phone' })}
                {field({ key: 'email', placeholder: 'Email' })}
                {field({ key: 'address', placeholder: 'Address' })}

                <View style={styles.buttons}>
                    <TouchableOpacity
                        style={[styles.button, { backgroundColor: '#334155' }]}
                        onPress={() => navigate('home')}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.buttonText}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.button, { backgroundColor: headerColor }]}
                        onPress={save}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.buttonText}>Save</Text>
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

export default AddContactScreen;
