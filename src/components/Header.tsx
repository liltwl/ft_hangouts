import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const Header = ({ title, color, onBack, onRight, rightLabel }: {
    title: string;
    color?: string;
    onBack?: () => void;
    onRight?: () => void;
    rightLabel?: string;
}) => (
    <View style={[styles.header, { backgroundColor: color }]}>
        {onBack && (
            <TouchableOpacity onPress={onBack} style={styles.btn}>
                <Text style={styles.btnText}>←</Text>
            </TouchableOpacity>
        )}
        <Text style={styles.title}>{title}</Text>
        {onRight && (
            <TouchableOpacity onPress={onRight} style={styles.btn}>
                <Text style={styles.btnText}>{rightLabel || '⚙'}</Text>
            </TouchableOpacity>
        )}
    </View>
);

const styles = StyleSheet.create({
    header: { flexDirection: 'row', alignItems: 'center', padding: 14, paddingTop: 40 },
    title: { flex: 1, color: '#fff', fontSize: 20, fontWeight: 'bold', textAlign: 'center' },
    btn: { padding: 8 },
    btnText: { color: '#fff', fontSize: 18 },
});

export default Header;
