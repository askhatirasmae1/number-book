const express = require("express");
const router = express.Router();

const db = require("../db");
const verifyToken = require("../middleware/auth");

/* ADD FAVORITE */
router.post("/", verifyToken, (req, res) => {
  const user_id = req.user.id;
  const { contact_id } = req.body;

  if (!contact_id) {
    return res.status(400).json({
      message: "contact_id est obligatoire"
    });
  }

  const checkSql = `
    SELECT * FROM favoris
    WHERE utilisateur_id = ? AND contact_id = ?
  `;

  db.query(checkSql, [user_id, contact_id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Erreur serveur" });
    }

    if (result.length > 0) {
      return res.status(409).json({
        message: "Ce contact est déjà dans les favoris"
      });
    }

    const sql = `
      INSERT INTO favoris (utilisateur_id, contact_id)
      VALUES (?, ?)
    `;

    db.query(sql, [user_id, contact_id], (err) => {
      if (err) {
        return res.status(500).json({
          message: "Erreur lors de l'ajout aux favoris"
        });
      }

      res.json({ message: "Contact ajouté aux favoris" });
    });
  });
});

/* GET FAVORITES */
router.get("/", verifyToken, (req, res) => {
  const user_id = req.user.id;

  const sql = `
    SELECT c.*
    FROM contacts c
    JOIN favoris f ON c.id = f.contact_id
    WHERE f.utilisateur_id = ?
  `;

  db.query(sql, [user_id], (err, result) => {
    if (err) {
      return res.status(500).json({
        message: "Erreur lors de la récupération des favoris"
      });
    }

    res.json(result);
  });
});

/* REMOVE FAVORITE */
router.delete("/:contact_id", verifyToken, (req, res) => {
  const user_id = req.user.id;
  const contact_id = req.params.contact_id;

  const sql = `
    DELETE FROM favoris
    WHERE utilisateur_id = ? AND contact_id = ?
  `;

  db.query(sql, [user_id, contact_id], (err) => {
    if (err) {
      return res.status(500).json({
        message: "Erreur lors de la suppression du favori"
      });
    }

    res.json({ message: "Contact retiré des favoris" });
  });
});

module.exports = router;