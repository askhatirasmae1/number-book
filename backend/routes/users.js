const express = require("express");
const router = express.Router();

const db = require("../db");
const verifyToken = require("../middleware/auth");
const verifyRole = require("../middleware/role");

/* =========================
   GET ALL USERS (ADMIN ONLY)
   =========================
   - Récupérer la liste de tous les utilisateurs
*/
router.get("/", verifyToken, verifyRole("admin"), (req, res) => {

  const sql = "SELECT id, nom, email, role FROM utilisateurs";

  db.query(sql, (err, result) => {

    if (err) {
      return res.status(500).json({
        message: "Erreur serveur"
      });
    }

    res.json(result);
  });
});


/* =========================
   GET USER BY ID
   =========================
   - Admin peut voir tout
   - Utilisateur peut voir seulement son propre profil
*/
router.get("/:id", verifyToken, (req, res) => {

  const id = req.params.id;

  /* Vérification des permissions */
  if (req.user.id != id && req.user.role !== "admin") {
    return res.status(403).json({
      message: "Accès refusé"
    });
  }

  const sql = `
    SELECT id, nom, email, role
    FROM utilisateurs
    WHERE id = ?
  `;

  db.query(sql, [id], (err, result) => {

    if (err) {
      return res.status(500).json({
        message: "Erreur serveur"
      });
    }

    if (result.length === 0) {
      return res.status(404).json({
        message: "Utilisateur introuvable"
      });
    }

    res.json(result[0]);
  });
});


/* =========================
   DELETE USER (ADMIN ONLY)
   =========================
   - Suppression d’un utilisateur
*/
router.delete("/:id", verifyToken, verifyRole("admin"), (req, res) => {

  const sql = "DELETE FROM utilisateurs WHERE id = ?";

  db.query(sql, [req.params.id], (err) => {

    if (err) {
      return res.status(500).json({
        message: "Erreur serveur"
      });
    }

    res.json({
      message: "Utilisateur supprimé avec succès"
    });
  });
});

module.exports = router;