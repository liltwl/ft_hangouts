import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';

const ContactItem = ({ contact, onPress }: { contact: any; onPress: any }) => (
    <TouchableOpacity style={styles.item} onPress={() => onPress(contact)}>
        <View style={styles.avatar}>
            <Text style={styles.avatarText}>
                {contact.firstName[0]}{contact.lastName[0]}
            </Text>
        </View>
        <View style={styles.info}>
            <Text style={styles.name}>{contact.firstName} {contact.lastName}</Text>
            <Text style={styles.phone}>{contact.phone}</Text>
        </View>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    item: { flexDirection: 'row', padding: 14, borderBottomWidth: 1, borderColor: '#eee', alignItems: 'center' },
    avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#4A90D9', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
    avatarText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
    info: { flex: 1 },
    name: { fontSize: 16, fontWeight: '600' },
    phone: { fontSize: 13, color: '#888', marginTop: 2 },
});

export default ContactItem;
