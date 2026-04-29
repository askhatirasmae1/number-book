package projet.fst.ma.number_book.activities;

import android.os.Bundle;
import android.text.Editable;
import android.text.TextWatcher;
import android.view.View;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;

import java.util.ArrayList;
import java.util.List;

import projet.fst.ma.number_book.adapters.ContactAdapter;
import projet.fst.ma.number_book.databinding.ActivityContactsBinding;
import projet.fst.ma.number_book.models.Contact;
import projet.fst.ma.number_book.models.Group;
import projet.fst.ma.number_book.network.RetrofitClient;
import projet.fst.ma.number_book.utils.SessionManager;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class ContactsActivity extends AppCompatActivity {

    private ActivityContactsBinding binding;
    private SessionManager session;
    private ContactAdapter adapter;

    private List<Contact> allContacts = new ArrayList<>();
    private List<Group> allGroups = new ArrayList<>();
    private int selectedGroupId = -1;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        binding = ActivityContactsBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());

        session = new SessionManager(this);

        // 🔥 Toolbar + back arrow
        setSupportActionBar(binding.toolbar);
        if (getSupportActionBar() != null) {
            getSupportActionBar().setDisplayHomeAsUpEnabled(true);
            getSupportActionBar().setTitle("Contacts");
        }

        binding.toolbar.setNavigationOnClickListener(v -> finish());

        adapter = new ContactAdapter(this, new ArrayList<>(), session);
        binding.recyclerContacts.setLayoutManager(new LinearLayoutManager(this));
        binding.recyclerContacts.setAdapter(adapter);

        binding.etSearch.addTextChangedListener(new TextWatcher() {
            @Override public void beforeTextChanged(CharSequence s, int start, int count, int after) {}
            @Override public void onTextChanged(CharSequence s, int start, int before, int count) {
                filterContacts();
            }
            @Override public void afterTextChanged(Editable s) {}
        });

        loadGroupsThenContacts();
    }

    private void loadGroupsThenContacts() {
        RetrofitClient.getService()
                .getGroups(session.getBearerToken())
                .enqueue(new Callback<List<Group>>() {
                    @Override
                    public void onResponse(Call<List<Group>> call, Response<List<Group>> response) {
                        if (response.isSuccessful() && response.body() != null) {
                            allGroups = response.body();
                            setupGroupSpinner();
                        }
                        loadContacts();
                    }

                    @Override
                    public void onFailure(Call<List<Group>> call, Throwable t) {
                        Toast.makeText(ContactsActivity.this, "Erreur groupes", Toast.LENGTH_SHORT).show();
                        loadContacts();
                    }
                });
    }

    private void setupGroupSpinner() {
        List<String> names = new ArrayList<>();
        names.add("Tous les groupes");

        for (Group g : allGroups) {
            names.add(g.getNom());
        }

        ArrayAdapter<String> spinnerAdapter = new ArrayAdapter<>(
                this,
                android.R.layout.simple_spinner_item,
                names
        );

        spinnerAdapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
        binding.spinnerGroup.setAdapter(spinnerAdapter);

        binding.spinnerGroup.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
            @Override
            public void onItemSelected(AdapterView<?> parent, View view, int position, long id) {
                selectedGroupId = position == 0 ? -1 : allGroups.get(position - 1).getId();
                filterContacts();
            }

            @Override public void onNothingSelected(AdapterView<?> parent) {}
        });
    }

    private void loadContacts() {
        binding.progressBar.setVisibility(View.VISIBLE);

        RetrofitClient.getService()
                .getContacts(session.getBearerToken())
                .enqueue(new Callback<List<Contact>>() {
                    @Override
                    public void onResponse(Call<List<Contact>> call, Response<List<Contact>> response) {
                        binding.progressBar.setVisibility(View.GONE);

                        if (response.isSuccessful() && response.body() != null) {
                            allContacts = response.body();
                            filterContacts();
                        } else {
                            Toast.makeText(ContactsActivity.this, "Erreur contacts", Toast.LENGTH_SHORT).show();
                        }
                    }

                    @Override
                    public void onFailure(Call<List<Contact>> call, Throwable t) {
                        binding.progressBar.setVisibility(View.GONE);
                        Toast.makeText(ContactsActivity.this, "Erreur réseau", Toast.LENGTH_SHORT).show();
                    }
                });
    }

    private void filterContacts() {
        String q = binding.etSearch.getText().toString().toLowerCase();
        List<Contact> filtered = new ArrayList<>();

        for (Contact c : allContacts) {
            boolean matchSearch =
                    c.getNom().toLowerCase().contains(q) ||
                            c.getTelephone().contains(q);

            boolean matchGroup =
                    selectedGroupId == -1 ||
                            (c.getGroupeId() != null && c.getGroupeId() == selectedGroupId);

            if (matchSearch && matchGroup) {
                filtered.add(c);
            }
        }

        adapter.updateList(filtered);

        if (filtered.isEmpty()) {
            binding.tvEmpty.setVisibility(View.VISIBLE);
            binding.recyclerContacts.setVisibility(View.GONE);
        } else {
            binding.tvEmpty.setVisibility(View.GONE);
            binding.recyclerContacts.setVisibility(View.VISIBLE);
        }
    }
}