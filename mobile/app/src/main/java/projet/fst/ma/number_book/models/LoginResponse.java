package projet.fst.ma.number_book.models;

import com.google.gson.annotations.SerializedName;

public class LoginResponse {
    @SerializedName("token")
    private String token;

    @SerializedName("message")
    private String message;

    @SerializedName("user")
    private User user;

    public String getToken() { return token; }
    public String getMessage() { return message; }
    public User getUser() { return user; }
}