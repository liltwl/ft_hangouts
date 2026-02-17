import React, { useState, useCallback } from 'react';
import { View, FlatList, Text, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import { NativeModules } from 'react-native';
import Header from '../components/Header';

const { DatabaseModule } = NativeModules;

const HomeScreen = ({ strings, headerColor, navigate }: { strings: any; headerColor: string; navigate: any }) => {
    const [contacts, setContacts] = useState([]);

    const loadContacts = useCallback(() => {
        DatabaseModule.getAllContacts()
            .then(setContacts)
            .catch((err: any) => {
                setContacts([]);
                console.error('Error loading contacts:', err);
            });
    }, []);

    React.useEffect(() => { loadContacts(); }, [loadContacts]);

    const renderContact = ({ item }: any) => {
        const leading = item.firstName?.[0]?.toUpperCase() || '?';
        return (
            <TouchableOpacity
                style={styles.contactItem}
                onPress={() => navigate('detail', item)}
                activeOpacity={0.7}
            >
                <View style={[styles.leadingCircle, { backgroundColor: headerColor }]}>
                    <Text style={styles.leadingText}>{leading}</Text>
                </View>
                <View style={styles.contactText}>
                    <Text style={styles.contactName}>{item.firstName} {item.lastName}</Text>
                    {item.phone ? <Text style={styles.contactPhone}>{item.phone}</Text> : null}
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View style={[styles.container, { backgroundColor: '#0F172A' }]}>
            <StatusBar backgroundColor={headerColor} barStyle="light-content" />
            <Header
                title={strings?.home || 'Homeeee'}
                color={headerColor}
                onRight={() => navigate('settings')}
                rightIcon="settings"
            />

            {contacts.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyIcon}>📇</Text>
                    <Text style={styles.emptyTitle}>{strings?.no_contacts || 'No contacts yet'}</Text>
                    <Text style={styles.emptySubtitle}>
                        {strings?.add_first || 'Tap + to add your first contact'}
                    </Text>
                </View>
            ) : (
                <FlatList
                    data={contacts}
                    keyExtractor={item => String(item.id)}
                    contentContainerStyle={styles.listContent}
                    ItemSeparatorComponent={() => <View style={styles.separator} />}
                    renderItem={renderContact}
                />
            )}

            <TouchableOpacity
                style={[styles.fab, { backgroundColor: headerColor }]}
                onPress={() => navigate('add')}
                activeOpacity={0.85}
            >
                <Text style={styles.fabText}>+</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    listContent: { paddingVertical: 8 },
    separator: { height: 1, backgroundColor: '#334155', marginLeft: 72 },
    emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 32 },
    emptyIcon: { fontSize: 64, marginBottom: 16, color: '#94A3B8' },
    emptyTitle: { fontSize: 20, fontWeight: '500', color: '#F1F5F9', marginBottom: 8 },
    emptySubtitle: { fontSize: 14, color: '#94A3B8', textAlign: 'center' },

    contactItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 14,
        backgroundColor: '#1E293B',
        marginHorizontal: 16,
        marginVertical: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 2,
    },
    leadingCircle: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    leadingText: { color: '#F1F5F9', fontSize: 18, fontWeight: '600' },
    contactText: { flex: 1 },
    contactName: { color: '#F1F5F9', fontSize: 16, fontWeight: '600' },
    contactPhone: { color: '#94A3B8', fontSize: 14, marginTop: 2 },

    fab: {
        position: 'absolute',
        bottom: 24,
        right: 24,
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 6,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.27,
        shadowRadius: 4.65,
    },
    fabText: { color: '#F1F5F9', fontSize: 28, fontWeight: '600', lineHeight: 30 },
});

export default HomeScreen;
