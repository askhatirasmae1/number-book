package projet.fst.ma.number_book.utils;

import android.content.Context;
import android.content.SharedPreferences;

public class SessionManager {
    private static final String PREF_NAME = "NumberBookSession";
    private static final String KEY_TOKEN = "jwt_token";
    private static final String KEY_ROLE = "user_role";
    private static final String KEY_NOM = "user_nom";

    private final SharedPreferences prefs;

    public SessionManager(Context context) {
        prefs = context.getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE);
    }

    public void saveSession(String token, String role, String nom) {
        prefs.edit()
                .putString(KEY_TOKEN, token)
                .putString(KEY_ROLE, role)
                .putString(KEY_NOM, nom)
                .apply();
    }

    public String getToken() {
        return prefs.getString(KEY_TOKEN, null);
    }

    public String getRole() {
        return prefs.getString(KEY_ROLE, "user");
    }

    public String getNom() {
        return prefs.getString(KEY_NOM, "");
    }

    public boolean isLoggedIn() {
        return getToken() != null;
    }

    public String getBearerToken() {
        return "Bearer " + getToken();
    }

    public void logout() {
        prefs.edit().clear().apply();
    }
}