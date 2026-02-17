import React from 'react';
import { View, TouchableOpacity, StyleSheet, Platform, StatusBar, Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'; // or FontAwesome, Ionicons, etc.

const Header = ({ title, color, onBack, onRight, rightIcon }: {
    title: string;
    color?: string;
    onBack?: () => void;
    onRight?: () => void;
    rightIcon?: string; // name of the icon for right button
}) => {
    return (
        <View style={[styles.header, { backgroundColor: color || '#2563EB' }]}>
            {onBack ? (
                <TouchableOpacity onPress={onBack} style={styles.btn} activeOpacity={0.7}>
                    <Icon name="arrow-back" size={24} color="#F1F5F9" />
                </TouchableOpacity>
            ) : <View style={styles.btnPlaceholder} />}

            <Text style={styles.title}>{title}</Text>

            {onRight ? (
                <TouchableOpacity onPress={onRight} style={styles.btn} activeOpacity={0.7}>
                    <Icon name={rightIcon || "settings"} size={24} color="#F1F5F9" />
                </TouchableOpacity>
            ) : <View style={styles.btnPlaceholder} />}
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight! + 8 : 40,
        paddingBottom: 14,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
    },
    title: {
        flex: 1,
        color: '#F1F5F9',
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    btn: {
        padding: 8,
    },
    btnPlaceholder: {
        width: 32,
    },
});

export default Header;
