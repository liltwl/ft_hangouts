package com.newcontactapp;

import com.facebook.react.bridge.*;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import android.os.Handler;
import android.os.Looper;

public class SmsModule extends ReactContextBaseJavaModule {
    private final ReactApplicationContext reactContext;

    public SmsModule(ReactApplicationContext context) {
        super(context);
        this.reactContext = context;
    }

    @Override
    public String getName() {
        return "SmsModule";
    }

    @ReactMethod
    public void sendSms(String phoneNumber, String message) {
        // No real SMS — just simulate a reply after 2 seconds
        new Handler(Looper.getMainLooper()).postDelayed(() -> {
            WritableMap params = Arguments.createMap();
            params.putString("sender", phoneNumber);
            params.putString("body", "Auto-reply from " + phoneNumber + ": Got your message! eee");
            reactContext
                    .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                    .emit("onSmsReceived", params);
        }, 2000);
    }
}
