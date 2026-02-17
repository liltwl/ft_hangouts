package com.newcontactapp;

import android.content.res.Resources;
import com.facebook.react.bridge.*;

public class LocaleModule extends ReactContextBaseJavaModule {
    private ReactApplicationContext ctx;

    public LocaleModule(ReactApplicationContext context) {
        super(context);
        ctx = context;
    }

    @Override
    public String getName() {
        return "LocaleModule";
    }

    @ReactMethod
    public void getStrings(String lang, Promise promise) {
        try {
            Resources res;

            android.content.res.Configuration config = new android.content.res.Configuration(
                    ctx.getResources().getConfiguration());

            java.util.Locale locale = new java.util.Locale(lang);
            java.util.Locale.setDefault(locale);
            config.setLocale(locale);

            android.content.Context localizedContext = ctx.createConfigurationContext(config);

            res = localizedContext.getResources();

            WritableMap map = Arguments.createMap();

            int[] ids = {
                    R.string.home, R.string.add_contact, R.string.edit_contact,
                    R.string.delete_contact, R.string.first_name, R.string.last_name,
                    R.string.phone, R.string.email, R.string.address, R.string.save,
                    R.string.cancel, R.string.send, R.string.messages, R.string.settings,
                    R.string.header_color, R.string.no_contacts, R.string.confirm_delete, R.string.app_background
            };

            String[] keys = {
                    "home", "add_contact", "edit_contact", "delete_contact",
                    "first_name", "last_name", "phone", "email", "address", "save",
                    "cancel", "send", "messages", "settings", "header_color", "no_contacts",
                    "confirm_delete", "app_background"
            };

            for (int i = 0; i < ids.length; i++) {
                map.putString(keys[i], res.getString(ids[i]));
            }

            promise.resolve(map);

        } catch (Exception e) {
            promise.reject("ERR", e);
        }
    }

}
