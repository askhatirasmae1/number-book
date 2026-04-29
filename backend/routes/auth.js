const express = require("express");
const router = express.Router();

const db = require("../db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const SECRET_KEY = "number_book_secret";

/* REGISTER */
router.post("/register", (req, res) => {
  const { nom, email, mot_de_passe } = req.body;

  if (!nom || !email || !mot_de_passe) {
    return res.status(400).json({
      message: "Nom, email et mot de passe sont obligatoires"
    });
  }

  const checkSql = "SELECT * FROM utilisateurs WHERE email = ?";

  db.query(checkSql, [email], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Erreur serveur" });
    }

    if (result.length > 0) {
      return res.status(409).json({
        message: "Cet email est déjà utilisé"
      });
    }

    bcrypt.hash(mot_de_passe, 10, (err, hash) => {
      if (err) {
        return res.status(500).json({ message: "Erreur lors du hash" });
      }

      const sql = `
        INSERT INTO utilisateurs (nom, email, mot_de_passe, role)
        VALUES (?, ?, ?, ?)
      `;

      db.query(sql, [nom, email, hash, "user"], (err) => {
        if (err) {
          return res.status(500).json({
            message: "Erreur lors de l'inscription"
          });
        }

        res.json({ message: "Utilisateur créé avec succès" });
      });
    });
  });
});

/* LOGIN */
router.post("/login", (req, res) => {
  const { email, mot_de_passe } = req.body;

  if (!email || !mot_de_passe) {
    return res.status(400).json({
      message: "Email et mot de passe sont obligatoires"
    });
  }

  const sql = "SELECT * FROM utilisateurs WHERE email = ?";

  db.query(sql, [email], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Erreur serveur" });
    }

    if (result.length === 0) {
      return res.status(404).json({
        message: "Utilisateur introuvable"
      });
    }

    const user = result[0];

    bcrypt.compare(mot_de_passe, user.mot_de_passe, (err, isMatch) => {
      if (err) {
        return res.status(500).json({
          message: "Erreur lors de la vérification du mot de passe"
        });
      }

      if (!isMatch) {
        return res.status(401).json({
          message: "Mot de passe incorrect"
        });
      }

      const token = jwt.sign(
        { id: user.id, role: user.role },
        SECRET_KEY,
        { expiresIn: "1d" }
      );

      res.json({
        message: "Connexion réussie",
        token,
        user: {
          id: user.id,
          nom: user.nom,
          email: user.email,
          role: user.role
        }
      });
    });
  });
});

module.exports = router;