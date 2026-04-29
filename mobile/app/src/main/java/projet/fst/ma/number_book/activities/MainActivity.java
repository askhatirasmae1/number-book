package projet.fst.ma.number_book.activities;

import android.content.Intent;
import android.os.Bundle;

import androidx.appcompat.app.AppCompatActivity;

import projet.fst.ma.number_book.databinding.ActivityMainBinding;
import projet.fst.ma.number_book.utils.SessionManager;

public class MainActivity extends AppCompatActivity {

    private ActivityMainBinding binding;
    private SessionManager session;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        binding = ActivityMainBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());

        session = new SessionManager(this);

        binding.tvWelcome.setText("Bonjour 👋");

        binding.btnContacts.setOnClickListener(v ->
                startActivity(new Intent(this, ContactsActivity.class)));

        binding.btnFavorites.setOnClickListener(v ->
                startActivity(new Intent(this, FavoritesActivity.class)));

        binding.btnLogout.setOnClickListener(v -> {
            session.logout();
            startActivity(new Intent(this, LoginActivity.class));
            finish();
        });
    }
}