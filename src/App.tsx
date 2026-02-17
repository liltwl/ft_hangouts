import React, { useState, useEffect, useRef } from 'react';
import { AppState, ToastAndroid, NativeModules, NativeEventEmitter } from 'react-native';
import AddContactScreen from './screens/AddContactScreen';
import ContactDetailScreen from './screens/ContactDetailScreen';
import EditContactScreen from './screens/EditContactScreen';
import ConversationScreen from './screens/ConversationScreen';
import SettingsScreen from './screens/SettingsScreen';
import HomeScreen from './screens/HomeScreen';


const { LocaleModule, DatabaseModule } = NativeModules;

const App = () => {
    const [screen, setScreen] = useState('home');
    const [selectedContact, setSelectedContact] = useState(null);
    const [headerColor, setHeaderColor] = useState('#4A90D9');
    const [strings, setStrings] = useState({});
    const [currentLang, setCurrentLang] = useState('en');
    const appState = useRef(AppState.currentState);
    const bgTimestamp = useRef(null);


    // Listen for language changes from native side
    useEffect(() => {
        const stringss = LocaleModule.getStrings(currentLang)
            .then((s) => {
                setStrings(s);
                return s;
            })
            .catch(() => { });
    }, [currentLang]);


    // Listen for app state changes to track background time
    useEffect(() => {
        const sub = AppState.addEventListener('change', nextState => {
            if (nextState === 'background' || nextState === 'inactive') {
                bgTimestamp.current = new Date().toLocaleString();
            }
            if (appState.current.match(/background|inactive/) && nextState === 'active') {
                if (bgTimestamp.current) {
                    const msg = (strings.app_background || 'App went to background at: %s').replace('%s', bgTimestamp.current);
                    ToastAndroid.show(msg, ToastAndroid.LONG);
                }
            }
            appState.current = nextState;
        });
        return () => sub.remove();
    }, []);

    const navigate = (s, contact) => {
        setSelectedContact(contact || null);
        setScreen(s);
    };

    const props = {
        strings,
        headerColor,
        navigate,
        selectedContact,
        setHeaderColor,
        currentLang,
        setLanguage: setCurrentLang
    };

    switch (screen) {
        case 'add': return <AddContactScreen {...props} />;
        case 'detail': return <ContactDetailScreen {...props} />;
        case 'edit': return <EditContactScreen {...props} />;
        case 'conversation': return <ConversationScreen {...props} />;
        case 'settings': return <SettingsScreen {...props} />;
        default: return <HomeScreen {...props} />;
    }
};

export default App;
