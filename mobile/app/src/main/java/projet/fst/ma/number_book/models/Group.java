package projet.fst.ma.number_book.models;

import com.google.gson.annotations.SerializedName;

public class Group {
    @SerializedName("id")
    private int id;

    @SerializedName("nom")
    private String nom;

    public int getId() { return id; }
    public String getNom() { return nom; }

    @Override
    public String toString() {
        return nom;
    }
}
