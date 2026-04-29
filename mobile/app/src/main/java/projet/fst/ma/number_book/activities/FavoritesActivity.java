package projet.fst.ma.number_book.activities;

import android.os.Bundle;
import android.view.View;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;

import java.util.ArrayList;
import java.util.List;

import projet.fst.ma.number_book.adapters.ContactAdapter;
import projet.fst.ma.number_book.databinding.ActivityFavoritesBinding;
import projet.fst.ma.number_book.models.Contact;
import projet.fst.ma.number_book.network.RetrofitClient;
import projet.fst.ma.number_book.utils.SessionManager;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class FavoritesActivity extends AppCompatActivity {

    private ActivityFavoritesBinding binding;
    private SessionManager session;
    private ContactAdapter adapter;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        binding = ActivityFavoritesBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());

        session = new SessionManager(this);

        // 🔥 مهم: تشغيل toolbar + السهم
        setSupportActionBar(binding.toolbar);
        if (getSupportActionBar() != null) {
            getSupportActionBar().setDisplayHomeAsUpEnabled(true);
            getSupportActionBar().setTitle("Mes favoris");
        }

        // 🔥 السهم يرجع
        binding.toolbar.setNavigationOnClickListener(v -> finish());

        adapter = new ContactAdapter(this, new ArrayList<>(), session, true);
        binding.recyclerFavorites.setLayoutManager(new LinearLayoutManager(this));
        binding.recyclerFavorites.setAdapter(adapter);

        loadFavorites();
    }

    @Override
    protected void onResume() {
        super.onResume();
        loadFavorites();
    }

    private void loadFavorites() {
        binding.progressBar.setVisibility(View.VISIBLE);

        RetrofitClient.getService()
                .getFavorites(session.getBearerToken())
                .enqueue(new Callback<List<Contact>>() {
                    @Override
                    public void onResponse(Call<List<Contact>> call, Response<List<Contact>> response) {
                        binding.progressBar.setVisibility(View.GONE);

                        if (response.isSuccessful() && response.body() != null) {
                            List<Contact> favorites = response.body();
                            adapter.updateList(favorites);

                            if (favorites.isEmpty()) {
                                binding.tvEmpty.setVisibility(View.VISIBLE);
                                binding.recyclerFavorites.setVisibility(View.GONE);
                            } else {
                                binding.tvEmpty.setVisibility(View.GONE);
                                binding.recyclerFavorites.setVisibility(View.VISIBLE);
                            }
                        } else {
                            Toast.makeText(FavoritesActivity.this, "Erreur favoris", Toast.LENGTH_SHORT).show();
                        }
                    }

                    @Override
                    public void onFailure(Call<List<Contact>> call, Throwable t) {
                        binding.progressBar.setVisibility(View.GONE);
                        Toast.makeText(FavoritesActivity.this, "Erreur réseau: " + t.getMessage(), Toast.LENGTH_LONG).show();
                    }
                });
    }
}