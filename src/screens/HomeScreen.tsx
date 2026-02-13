import React, { useState, useCallback } from 'react';
import { View, FlatList, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { NativeModules } from 'react-native';
import Header from '../components/Header';
import ContactItem from '../components/ContactItem';

const { DatabaseModule } = NativeModules;

const HomeScreen = ({ strings, headerColor, navigate }: { strings: any; headerColor: any; navigate: any }) => {
    const [contacts, setContacts] = useState([]);

    const loadContacts = useCallback(() => {
        DatabaseModule.getAllContacts().then(setContacts).catch(() => { });
    }, []);

    // Reload every time screen is shown
    // React.useEffect(() => { loadContacts(); }, [loadContacts]);

    return (
        <View style={styles.container}>
            <Header
                title={strings?.home || 'Home'}
                color={headerColor}
                onRight={() => navigate('settings')}
            />
            {contacts.length === 0 ? (
                <Text style={styles.empty}>{strings?.no_contacts || 'No contacts yet'}</Text>
            ) : (
                <FlatList
                    data={contacts}
                    keyExtractor={item => String(item.id)}
                    renderItem={({ item }) => (
                        <ContactItem contact={item} onPress={c => navigate('detail', c)} />
                    )}
                />
            )}
            <TouchableOpacity style={[styles.fab, { backgroundColor: headerColor }]} onPress={() => navigate('add')}>
                <Text style={styles.fabText}>+</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    empty: { textAlign: 'center', marginTop: 60, color: '#aaa', fontSize: 16 },
    fab: { position: 'absolute', bottom: 24, right: 24, width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center', elevation: 4 },
    fabText: { color: '#fff', fontSize: 28, lineHeight: 30 },
});

export default HomeScreen;
