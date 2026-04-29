const mysql = require("mysql2");

/* =========================
   CONNEXION BASE DE DONNÉES
   =========================
   - Connexion à MySQL (phpMyAdmin)
   - Base: number_book
*/
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "number_book"
});

/* =========================
   TEST DE CONNEXION
   =========================
   - Vérifier si la connexion est réussie
*/
db.connect((err) => {

  if (err) {
    console.log("Erreur de connexion à la base de données :", err);
  } else {
    console.log("Connexion à la base de données réussie");
  }

});

module.exports = db;