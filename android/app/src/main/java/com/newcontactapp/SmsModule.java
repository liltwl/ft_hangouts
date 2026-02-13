package com.newcontactapp;

import android.telephony.SmsManager;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.os.Bundle;
import android.telephony.SmsMessage;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.modules.core.DeviceEventManagerModule;

public class SmsModule extends ReactContextBaseJavaModule {

    private ReactApplicationContext reactContext;

    public SmsModule(ReactApplicationContext context) {
        super(context);
        this.reactContext = context;
        registerReceiver();
    }

    @Override
    public String getName() {
        return "SmsModule";
    }

    @ReactMethod
    public void sendSms(String phone, String message, Promise promise) {
        try {
            SmsManager sms = SmsManager.getDefault();
            sms.sendTextMessage(phone, null, message, null, null);
            promise.resolve(true);
        } catch (Exception e) {
            promise.reject("ERR", e.getMessage());
        }
    }

    private void registerReceiver() {
        BroadcastReceiver receiver = new BroadcastReceiver() {
            @Override
            public void onReceive(Context context, Intent intent) {
                Bundle bundle = intent.getExtras();
                if (bundle != null) {
                    Object[] pdus = (Object[]) bundle.get("pdus");
                    String format = bundle.getString("format");
                    if (pdus != null) {
                        for (Object pdu : pdus) {
                            SmsMessage msg = SmsMessage.createFromPdu((byte[]) pdu, format);
                            WritableMap map = Arguments.createMap();
                            map.putString("sender", msg.getOriginatingAddress());
                            map.putString("body", msg.getMessageBody());
                            map.putString("timestamp", String.valueOf(msg.getTimestampMillis()));
                            reactContext
                                    .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                                    .emit("onSmsReceived", map);
                        }
                    }
                }
            }
        };
        IntentFilter filter = new IntentFilter("android.provider.Telephony.SMS_RECEIVED");
        filter.setPriority(999);
        reactContext.registerReceiver(receiver, filter);
    }

    @ReactMethod
    public void addListener(String eventName) {
    }

    @ReactMethod
    public void removeListeners(int count) {
    }
}
