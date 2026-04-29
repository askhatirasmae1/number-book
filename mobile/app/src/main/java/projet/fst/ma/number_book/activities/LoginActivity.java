package projet.fst.ma.number_book.activities;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;

import androidx.appcompat.app.AppCompatActivity;

import projet.fst.ma.number_book.databinding.ActivityLoginBinding;
import projet.fst.ma.number_book.models.LoginResponse;
import projet.fst.ma.number_book.network.RetrofitClient;
import projet.fst.ma.number_book.utils.SessionManager;

import java.util.HashMap;
import java.util.Map;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class LoginActivity extends AppCompatActivity {

    private ActivityLoginBinding binding;
    private SessionManager session;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        binding = ActivityLoginBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());

        session = new SessionManager(this);

        if (session.isLoggedIn()) {
            startActivity(new Intent(this, MainActivity.class));
            finish();
            return;
        }

        binding.btnLogin.setOnClickListener(v -> doLogin());
    }

    private void doLogin() {
        String email = binding.etEmail.getText().toString().trim();
        String password = binding.etPassword.getText().toString().trim();

        if (email.isEmpty()) {
            binding.etEmail.setError("Email requis");
            return;
        }

        if (password.isEmpty()) {
            binding.etPassword.setError("Mot de passe requis");
            return;
        }

        binding.progressBar.setVisibility(View.VISIBLE);
        binding.btnLogin.setEnabled(false);
        binding.tvError.setVisibility(View.GONE);

        Map<String, String> body = new HashMap<>();
        body.put("email", email);
        body.put("mot_de_passe", password);

        RetrofitClient.getService().login(body).enqueue(new Callback<LoginResponse>() {
            @Override
            public void onResponse(Call<LoginResponse> call, Response<LoginResponse> response) {
                binding.progressBar.setVisibility(View.GONE);
                binding.btnLogin.setEnabled(true);

                if (response.isSuccessful() && response.body() != null) {
                    LoginResponse data = response.body();

                    String role = data.getUser() != null ? data.getUser().getRole() : "user";
                    String nom = data.getUser() != null ? data.getUser().getNom() : "";

                    session.saveSession(data.getToken(), role, nom);

                    startActivity(new Intent(LoginActivity.this, MainActivity.class));
                    finish();
                } else {
                    binding.tvError.setVisibility(View.VISIBLE);
                    binding.tvError.setText("Email ou mot de passe incorrect");
                }
            }

            @Override
            public void onFailure(Call<LoginResponse> call, Throwable t) {
                binding.progressBar.setVisibility(View.GONE);
                binding.btnLogin.setEnabled(true);
                binding.tvError.setVisibility(View.VISIBLE);
                binding.tvError.setText("Impossible de contacter le serveur");
            }
        });
    }
}