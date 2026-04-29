package projet.fst.ma.number_book.activities;

import android.content.ClipData;
import android.content.ClipboardManager;
import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.view.View;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;

import java.util.HashMap;
import java.util.Map;

import projet.fst.ma.number_book.databinding.ActivityContactDetailBinding;
import projet.fst.ma.number_book.network.RetrofitClient;
import projet.fst.ma.number_book.utils.SessionManager;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class ContactDetailActivity extends AppCompatActivity {

    private ActivityContactDetailBinding binding;
    private SessionManager session;

    private int contactId;
    private String telephone;
    private String email;
    private boolean isFavorite;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        binding = ActivityContactDetailBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());

        session = new SessionManager(this);

        contactId = getIntent().getIntExtra("contact_id", -1);
        String nom = getIntent().getStringExtra("contact_nom");
        telephone = getIntent().getStringExtra("contact_tel");
        email = getIntent().getStringExtra("contact_email");
        String desc = getIntent().getStringExtra("contact_desc");
        String groupe = getIntent().getStringExtra("contact_groupe");
        isFavorite = getIntent().getBooleanExtra("is_favorite", false);

        setSupportActionBar(binding.toolbar);

        if (getSupportActionBar() != null) {
            getSupportActionBar().setDisplayHomeAsUpEnabled(true);
            getSupportActionBar().setTitle(nom != null ? nom : "Détail contact");
        }

        binding.toolbar.setNavigationOnClickListener(v -> finish());

        binding.tvNom.setText(nom != null ? nom : "—");
        binding.tvTelephone.setText(telephone != null ? telephone : "—");
        binding.tvEmail.setText(email != null && !email.isEmpty() ? email : "—");
        binding.tvDescription.setText(desc != null && !desc.isEmpty() ? desc : "Aucune description");
        binding.tvGroupe.setText(groupe != null && !groupe.isEmpty() ? groupe : "Aucun groupe");

        if (email == null || email.isEmpty()) {
            binding.btnEmail.setVisibility(View.GONE);
        }

        updateFavoriteButton();

        binding.btnCall.setOnClickListener(v -> {
            if (telephone == null || telephone.isEmpty()) return;
            Intent intent = new Intent(Intent.ACTION_DIAL, Uri.parse("tel:" + telephone));
            startActivity(intent);
        });

        binding.btnCopy.setOnClickListener(v -> {
            ClipboardManager clipboard = (ClipboardManager) getSystemService(Context.CLIPBOARD_SERVICE);
            ClipData clip = ClipData.newPlainText("Téléphone", telephone);
            clipboard.setPrimaryClip(clip);
            Toast.makeText(this, "Numéro copié", Toast.LENGTH_SHORT).show();
        });

        binding.btnEmail.setOnClickListener(v -> {
            if (email == null || email.isEmpty()) return;
            Intent intent = new Intent(Intent.ACTION_SENDTO);
            intent.setData(Uri.parse("mailto:" + email));
            startActivity(intent);
        });

        binding.btnFavorite.setOnClickListener(v -> toggleFavorite());
    }

    private void toggleFavorite() {
        binding.btnFavorite.setEnabled(false);

        if (isFavorite) {
            RetrofitClient.getService()
                    .removeFavorite(session.getBearerToken(), contactId)
                    .enqueue(new Callback<Void>() {
                        @Override
                        public void onResponse(Call<Void> call, Response<Void> response) {
                            binding.btnFavorite.setEnabled(true);

                            if (response.isSuccessful()) {
                                isFavorite = false;
                                updateFavoriteButton();
                                Toast.makeText(ContactDetailActivity.this, "Retiré des favoris", Toast.LENGTH_SHORT).show();
                                finish();
                            } else {
                                Toast.makeText(ContactDetailActivity.this, "Erreur suppression", Toast.LENGTH_SHORT).show();
                            }
                        }

                        @Override
                        public void onFailure(Call<Void> call, Throwable t) {
                            binding.btnFavorite.setEnabled(true);
                            Toast.makeText(ContactDetailActivity.this, "Erreur réseau", Toast.LENGTH_SHORT).show();
                        }
                    });

        } else {
            Map<String, Integer> body = new HashMap<>();
            body.put("contact_id", contactId);

            RetrofitClient.getService()
                    .addFavorite(session.getBearerToken(), body)
                    .enqueue(new Callback<Void>() {
                        @Override
                        public void onResponse(Call<Void> call, Response<Void> response) {
                            binding.btnFavorite.setEnabled(true);

                            if (response.isSuccessful()) {
                                isFavorite = true;
                                updateFavoriteButton();
                                Toast.makeText(ContactDetailActivity.this, "Ajouté aux favoris", Toast.LENGTH_SHORT).show();
                            } else {
                                Toast.makeText(ContactDetailActivity.this, "Déjà dans les favoris", Toast.LENGTH_SHORT).show();
                            }
                        }

                        @Override
                        public void onFailure(Call<Void> call, Throwable t) {
                            binding.btnFavorite.setEnabled(true);
                            Toast.makeText(ContactDetailActivity.this, "Erreur réseau", Toast.LENGTH_SHORT).show();
                        }
                    });
        }
    }

    private void updateFavoriteButton() {
        binding.btnFavorite.setText(isFavorite ? "♥ Retirer des favoris" : "♡ Ajouter aux favoris");
    }
}