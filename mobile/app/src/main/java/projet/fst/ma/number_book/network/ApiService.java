package projet.fst.ma.number_book.network;

import projet.fst.ma.number_book.models.Contact;
import projet.fst.ma.number_book.models.Group;
import projet.fst.ma.number_book.models.LoginResponse;

import java.util.List;
import java.util.Map;

import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.DELETE;
import retrofit2.http.GET;
import retrofit2.http.Header;
import retrofit2.http.POST;
import retrofit2.http.Path;

public interface ApiService {

    @POST("auth/login")
    Call<LoginResponse> login(@Body Map<String, String> body);

    @GET("contacts")
    Call<List<Contact>> getContacts(@Header("Authorization") String token);

    @GET("groups")
    Call<List<Group>> getGroups(@Header("Authorization") String token);

    @GET("favorites")
    Call<List<Contact>> getFavorites(@Header("Authorization") String token);

    @POST("favorites")
    Call<Void> addFavorite(
            @Header("Authorization") String token,
            @Body Map<String, Integer> body
    );

    @DELETE("favorites/{contact_id}")
    Call<Void> removeFavorite(
            @Header("Authorization") String token,
            @Path("contact_id") int contactId
    );
}