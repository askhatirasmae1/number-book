package projet.fst.ma.number_book.models;

import com.google.gson.annotations.SerializedName;

public class Contact {

    @SerializedName("id")
    private int id;

    @SerializedName("nom")
    private String nom;

    @SerializedName("telephone")
    private String telephone;

    @SerializedName("email")
    private String email;

    @SerializedName("description")
    private String description;

    @SerializedName("groupe_id")
    private Integer groupeId;

    @SerializedName("groupe_nom")
    private String groupeNom;

    public Contact() {}

    public int getId() { return id; }
    public String getNom() { return nom; }
    public String getTelephone() { return telephone; }
    public String getEmail() { return email; }
    public String getDescription() { return description; }
    public Integer getGroupeId() { return groupeId; }
    public String getGroupeNom() { return groupeNom; }

    public void setGroupeNom(String groupeNom) {
        this.groupeNom = groupeNom;
    }

    public String getInitiale() {
        if (nom != null && !nom.isEmpty()) {
            return String.valueOf(nom.charAt(0)).toUpperCase();
        }
        return "?";
    }
}