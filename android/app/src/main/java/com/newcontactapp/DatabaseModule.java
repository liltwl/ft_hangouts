package com.newcontactapp;

import android.content.ContentValues;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;
import android.database.sqlite.SQLiteOpenHelper;
import android.content.Context;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReadableMap;

public class DatabaseModule extends ReactContextBaseJavaModule {

    private static final String DB_NAME = "contacts.db";
    private static final int DB_VERSION = 1;
    private SQLiteDatabase db;

    public DatabaseModule(ReactApplicationContext context) {
        super(context);
        SQLiteOpenHelper helper = new SQLiteOpenHelper(context, DB_NAME, null, DB_VERSION) {
            @Override
            public void onCreate(SQLiteDatabase db) {
                db.execSQL("CREATE TABLE IF NOT EXISTS contacts (" +
                        "id INTEGER PRIMARY KEY AUTOINCREMENT," +
                        "firstName TEXT NOT NULL," +
                        "lastName TEXT NOT NULL," +
                        "phone TEXT NOT NULL," +
                        "email TEXT," +
                        "address TEXT)");
                db.execSQL("CREATE TABLE IF NOT EXISTS messages (" +
                        "id INTEGER PRIMARY KEY AUTOINCREMENT," +
                        "contactId INTEGER," +
                        "body TEXT," +
                        "type TEXT," + // 'sent' or 'received'
                        "timestamp TEXT," +
                        "FOREIGN KEY(contactId) REFERENCES contacts(id))");
            }

            @Override
            public void onUpgrade(SQLiteDatabase db, int oldV, int newV) {
                db.execSQL("DROP TABLE IF EXISTS messages");
                db.execSQL("DROP TABLE IF EXISTS contacts");
                onCreate(db);
            }
        };
        db = helper.getWritableDatabase();
    }

    @Override
    public String getName() {
        return "DatabaseModule";
    }

    @ReactMethod
    public void addContact(ReadableMap data, Promise promise) {
        try {
            ContentValues cv = new ContentValues();
            cv.put("firstName", data.getString("firstName"));
            cv.put("lastName", data.getString("lastName"));
            cv.put("phone", data.getString("phone"));
            cv.put("email", data.hasKey("email") ? data.getString("email") : "");
            cv.put("address", data.hasKey("address") ? data.getString("address") : "");
            long id = db.insert("contacts", null, cv);
            promise.resolve((double) id);
        } catch (Exception e) {
            promise.reject("ERR", e.getMessage());
        }
    }

    @ReactMethod
    public void updateContact(int id, ReadableMap data, Promise promise) {
        try {
            ContentValues cv = new ContentValues();
            cv.put("firstName", data.getString("firstName"));
            cv.put("lastName", data.getString("lastName"));
            cv.put("phone", data.getString("phone"));
            cv.put("email", data.hasKey("email") ? data.getString("email") : "");
            cv.put("address", data.hasKey("address") ? data.getString("address") : "");
            db.update("contacts", cv, "id=?", new String[] { String.valueOf(id) });
            promise.resolve(true);
        } catch (Exception e) {
            promise.reject("ERR", e.getMessage());
        }
    }

    @ReactMethod
    public void deleteContact(int id, Promise promise) {
        try {
            db.delete("messages", "contactId=?", new String[] { String.valueOf(id) });
            db.delete("contacts", "id=?", new String[] { String.valueOf(id) });
            promise.resolve(true);
        } catch (Exception e) {
            promise.reject("ERR", e.getMessage());
        }
    }

    @ReactMethod
    public void getAllContacts(Promise promise) {
        try {
            Cursor c = db.rawQuery("SELECT * FROM contacts ORDER BY firstName", null);
            WritableArray arr = Arguments.createArray();
            while (c.moveToNext()) {
                WritableMap map = Arguments.createMap();
                map.putInt("id", c.getInt(0));
                map.putString("firstName", c.getString(1));
                map.putString("lastName", c.getString(2));
                map.putString("phone", c.getString(3));
                map.putString("email", c.getString(4));
                map.putString("address", c.getString(5));
                arr.pushMap(map);
            }
            c.close();
            promise.resolve(arr);
        } catch (Exception e) {
            promise.reject("ERR", e.getMessage());
        }
    }

    @ReactMethod
    public void getContact(int id, Promise promise) {
        try {
            Cursor c = db.rawQuery("SELECT * FROM contacts WHERE id=?", new String[] { String.valueOf(id) });
            if (c.moveToFirst()) {
                WritableMap map = Arguments.createMap();
                map.putInt("id", c.getInt(0));
                map.putString("firstName", c.getString(1));
                map.putString("lastName", c.getString(2));
                map.putString("phone", c.getString(3));
                map.putString("email", c.getString(4));
                map.putString("address", c.getString(5));
                c.close();
                promise.resolve(map);
            } else {
                c.close();
                promise.reject("ERR", "Contact not found");
            }
        } catch (Exception e) {
            promise.reject("ERR", e.getMessage());
        }
    }

    @ReactMethod
    public void saveMessage(int contactId, String body, String type, Promise promise) {
        try {
            ContentValues cv = new ContentValues();
            cv.put("contactId", contactId);
            cv.put("body", body);
            cv.put("type", type);
            cv.put("timestamp", new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss", java.util.Locale.getDefault())
                    .format(new java.util.Date()));
            long id = db.insert("messages", null, cv);
            promise.resolve((double) id);
        } catch (Exception e) {
            promise.reject("ERR", e.getMessage());
        }
    }

    @ReactMethod
    public void getMessages(int contactId, Promise promise) {
        try {
            Cursor c = db.rawQuery("SELECT * FROM messages WHERE contactId=? ORDER BY timestamp ASC",
                    new String[] { String.valueOf(contactId) });
            WritableArray arr = Arguments.createArray();
            while (c.moveToNext()) {
                WritableMap map = Arguments.createMap();
                map.putInt("id", c.getInt(0));
                map.putInt("contactId", c.getInt(1));
                map.putString("body", c.getString(2));
                map.putString("type", c.getString(3));
                map.putString("timestamp", c.getString(4));
                arr.pushMap(map);
            }
            c.close();
            promise.resolve(arr);
        } catch (Exception e) {
            promise.reject("ERR", e.getMessage());
        }
    }
}
