import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Header from '../components/Header';

const COLORS = ['#4A90D9', '#e74c3c', '#2ecc71', '#9b59b6', '#f39c12', '#1abc9c', '#34495e'];

const SettingsScreen = ({ strings, headerColor, navigate, setHeaderColor }: { strings: any; headerColor: any; navigate: any; setHeaderColor: any }) => (
    <View style={styles.container}>
        <Header title={strings.settings || 'Settings'} color={headerColor} onBack={() => navigate('home')} />
        <View style={styles.body}>
            <Text style={styles.label}>{strings.header_color || 'Header Color'}</Text>
            <View style={styles.colors}>
                {COLORS.map(c => (
                    <TouchableOpacity
                        key={c}
                        style={[styles.swatch, { backgroundColor: c }, headerColor === c && styles.selected]}
                        onPress={() => setHeaderColor(c)}
                    />
                ))}
            </View>
        </View>
    </View>
);

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    body: { padding: 24 },
    label: { fontSize: 17, fontWeight: '600', marginBottom: 16 },
    colors: { flexDirection: 'row', flexWrap: 'wrap', gap: 14 },
    swatch: { width: 48, height: 48, borderRadius: 24 },
    selected: { borderWidth: 3, borderColor: '#333' },
});

export default SettingsScreen;
