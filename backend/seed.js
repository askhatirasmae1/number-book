const db = require("./db");
const bcrypt = require("bcryptjs");

/* =========================
   SEED ADMIN AUTOMATIQUE
   =========================
   - Crée un admin par défaut si la base est vide
   - S'exécute au démarrage du serveur
*/

const seedAdmin = () => {

  console.log("Seed admin en cours...");

  const email = "Askhatir@gmail.com";

  /* Vérifier si l'admin existe déjà */
  db.query(
    "SELECT * FROM utilisateurs WHERE email = ?",
    [email],
    (err, result) => {

      if (err) {
        return console.log("Erreur seed admin :", err);
      }

      console.log("Utilisateurs trouvés :", result.length);

      /* Si admin n'existe pas */
      if (result.length === 0) {

        /* Hash du mot de passe */
        bcrypt.hash("2234682", 10, (err, hash) => {

          if (err) {
            return console.log("Erreur hash password :", err);
          }

          const sql = `
            INSERT INTO utilisateurs (nom, email, mot_de_passe, role)
            VALUES (?, ?, ?, ?)
          `;

          db.query(sql, ["Askhatir", email, hash, "admin"], (err) => {

            if (err) {
              return console.log("Erreur création admin :", err);
            }

            console.log("Admin créé automatiquement ✔");
          });
        });

      } else {
        console.log("Admin déjà existant ✔");
      }
    }
  );
};

module.exports = seedAdmin;