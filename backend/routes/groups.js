const express = require("express");
const router = express.Router();

const db = require("../db");
const verifyToken = require("../middleware/auth");
const verifyRole = require("../middleware/role");

/* GET GROUPS */
router.get("/", verifyToken, (req, res) => {
  const sql = "SELECT * FROM groupes_contacts ORDER BY nom ASC";

  db.query(sql, (err, result) => {
    if (err) {
      return res.status(500).json({
        message: "Erreur lors de la récupération des groupes"
      });
    }

    res.json(result);
  });
});

/* ADD GROUP ADMIN */
router.post("/", verifyToken, verifyRole("admin"), (req, res) => {
  const { nom } = req.body;

  if (!nom || !nom.trim()) {
    return res.status(400).json({
      message: "Le nom du groupe est obligatoire"
    });
  }

  const checkSql = "SELECT * FROM groupes_contacts WHERE nom = ?";

  db.query(checkSql, [nom], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Erreur serveur" });
    }

    if (result.length > 0) {
      return res.status(409).json({
        message: "Ce groupe existe déjà"
      });
    }

    const sql = "INSERT INTO groupes_contacts (nom) VALUES (?)";

    db.query(sql, [nom], (err) => {
      if (err) {
        return res.status(500).json({
          message: "Erreur lors de l'ajout du groupe"
        });
      }

      res.json({ message: "Groupe ajouté avec succès" });
    });
  });
});

/* UPDATE GROUP ADMIN */
router.put("/:id", verifyToken, verifyRole("admin"), (req, res) => {
  const { nom } = req.body;

  if (!nom || !nom.trim()) {
    return res.status(400).json({
      message: "Le nom du groupe est obligatoire"
    });
  }

  const sql = "UPDATE groupes_contacts SET nom=? WHERE id=?";

  db.query(sql, [nom, req.params.id], (err) => {
    if (err) {
      return res.status(500).json({
        message: "Erreur lors de la modification du groupe"
      });
    }

    res.json({ message: "Groupe modifié avec succès" });
  });
});

/* DELETE GROUP ADMIN */
router.delete("/:id", verifyToken, verifyRole("admin"), (req, res) => {
  const sql = "DELETE FROM groupes_contacts WHERE id=?";

  db.query(sql, [req.params.id], (err) => {
    if (err) {
      return res.status(500).json({
        message: "Erreur lors de la suppression du groupe"
      });
    }

    res.json({ message: "Groupe supprimé avec succès" });
  });
});

module.exports = router;