package projet.fst.ma.number_book.adapters;

import android.content.Context;
import android.content.Intent;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;
import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import java.util.List;

import projet.fst.ma.number_book.R;
import projet.fst.ma.number_book.activities.ContactDetailActivity;
import projet.fst.ma.number_book.models.Contact;
import projet.fst.ma.number_book.utils.SessionManager;

public class ContactAdapter extends RecyclerView.Adapter<ContactAdapter.ViewHolder> {

    private final Context context;
    private List<Contact> contacts;
    private final SessionManager session;
    private final boolean favoritesMode;

    private static final int[] COLORS = {
            0xFF4F8EF7,
            0xFF34D399,
            0xFFFBBF24,
            0xFFA78BFA,
            0xFFF25C5C
    };

    public ContactAdapter(Context context, List<Contact> contacts, SessionManager session) {
        this(context, contacts, session, false);
    }

    public ContactAdapter(Context context, List<Contact> contacts, SessionManager session, boolean favoritesMode) {
        this.context = context;
        this.contacts = contacts;
        this.session = session;
        this.favoritesMode = favoritesMode;
    }

    public void updateList(List<Contact> newList) {
        this.contacts = newList;
        notifyDataSetChanged();
    }

    @NonNull
    @Override
    public ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(context).inflate(R.layout.item_contact, parent, false);
        return new ViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull ViewHolder holder, int position) {
        Contact c = contacts.get(position);

        holder.tvNom.setText(c.getNom());
        holder.tvTelephone.setText(c.getTelephone());
        holder.tvInitiale.setText(c.getInitiale());

        holder.tvInitiale.setBackgroundTintList(
                android.content.res.ColorStateList.valueOf(COLORS[position % COLORS.length])
        );

        if (c.getGroupeNom() != null && !c.getGroupeNom().isEmpty()) {
            holder.tvGroupe.setText(c.getGroupeNom());
            holder.tvGroupe.setVisibility(View.VISIBLE);
        } else {
            holder.tvGroupe.setVisibility(View.GONE);
        }

        holder.itemView.setOnClickListener(v -> {
            Intent intent = new Intent(context, ContactDetailActivity.class);

            intent.putExtra("contact_id", c.getId());
            intent.putExtra("contact_nom", c.getNom());
            intent.putExtra("contact_tel", c.getTelephone());
            intent.putExtra("contact_email", c.getEmail());
            intent.putExtra("contact_desc", c.getDescription());
            intent.putExtra("contact_groupe", c.getGroupeNom());
            intent.putExtra("is_favorite", favoritesMode);

            context.startActivity(intent);
        });
    }

    @Override
    public int getItemCount() {
        return contacts.size();
    }

    static class ViewHolder extends RecyclerView.ViewHolder {
        TextView tvInitiale, tvNom, tvTelephone, tvGroupe;

        ViewHolder(@NonNull View itemView) {
            super(itemView);
            tvInitiale = itemView.findViewById(R.id.tvInitiale);
            tvNom = itemView.findViewById(R.id.tvNom);
            tvTelephone = itemView.findViewById(R.id.tvTelephone);
            tvGroupe = itemView.findViewById(R.id.tvGroupe);
        }
    }
}