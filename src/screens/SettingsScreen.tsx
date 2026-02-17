import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import Header from '../components/Header';

const COLORS = [
    '#4F46E5', '#3B82F6', '#10B981', '#F59E0B',
    '#EF4444', '#8B5CF6', '#14B8A6',
];

const LANGUAGES = [
    { code: 'en', label: 'English' },
    { code: 'fr', label: 'Français' },
];

const SettingsScreen = ({
    strings,
    headerColor,
    navigate,
    setHeaderColor,
    currentLang,
    setLanguage
}: {
    strings: any;
    headerColor: string;
    navigate: any;
    setHeaderColor: (c: string) => void;
    currentLang: string;
    setLanguage: (lang: string) => void;
}) => (
    <View style={[styles.container, { backgroundColor: '#0F172A' }]}>
        <Header title={strings.settings || 'Settings'} color={headerColor} onBack={() => navigate('home')} />
        <ScrollView contentContainerStyle={styles.body}>

            {/* Header color picker */}
            <Text style={styles.label}>{strings.header_color || 'Header Color'}</Text>
            <View style={styles.colors}>
                {COLORS.map(c => (
                    <TouchableOpacity
                        key={c}
                        style={[
                            styles.swatch,
                            { backgroundColor: c },
                            headerColor === c && styles.selected
                        ]}
                        onPress={() => setHeaderColor(c)}
                        activeOpacity={0.8}
                    />
                ))}
            </View>

            {/* Language selection */}
            <Text style={[styles.label, { marginTop: 32 }]}>{strings.language || 'Language'}</Text>
            <View style={styles.languages}>
                {LANGUAGES.map(lang => (
                    <TouchableOpacity
                        key={lang.code}
                        style={[
                            styles.langBtn,
                            currentLang === lang.code && { backgroundColor: headerColor }
                        ]}
                        onPress={() => setLanguage(lang.code)}
                        activeOpacity={0.8}
                    >
                        <Text style={[
                            styles.langText,
                            currentLang === lang.code && { color: '#F1F5F9', fontWeight: '600' }
                        ]}>
                            {lang.label}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

        </ScrollView>
    </View>
);

const styles = StyleSheet.create({
    container: { flex: 1 },
    body: { padding: 24 },
    label: { fontSize: 17, fontWeight: '600', marginBottom: 16, color: '#F1F5F9' },
    colors: { flexDirection: 'row', flexWrap: 'wrap', gap: 14 },
    swatch: {
        width: 48,
        height: 48,
        borderRadius: 24,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    selected: {
        borderColor: '#F1F5F9',
    },
    languages: { flexDirection: 'row', gap: 14 },
    langBtn: {
        paddingVertical: 10,
        paddingHorizontal: 18,
        borderRadius: 25,
        backgroundColor: '#1E293B',
    },
    langText: {
        color: '#F1F5F9',
        fontSize: 15,
    },
});

export default SettingsScreen;
