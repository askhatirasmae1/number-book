const express = require("express");
const router = express.Router();
const db = require("../db");

const verifyToken = require("../middleware/auth");
const verifyRole = require("../middleware/role");

/* GET CONTACTS + SEARCH/FILTER */
router.get("/", verifyToken, (req, res) => {
  const { q, groupe_id } = req.query;

  let sql = "SELECT * FROM contacts WHERE 1=1";
  const params = [];

  if (q) {
    sql += " AND (nom LIKE ? OR telephone LIKE ? OR email LIKE ? OR description LIKE ?)";
    params.push(`%${q}%`, `%${q}%`, `%${q}%`, `%${q}%`);
  }

  if (groupe_id) {
    sql += " AND groupe_id = ?";
    params.push(groupe_id);
  }

  db.query(sql, params, (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Erreur serveur" });
    }

    res.json(result);
  });
});

/* ADD CONTACT ADMIN */
router.post("/", verifyToken, verifyRole("admin"), (req, res) => {
  const { nom, telephone, email, description, groupe_id } = req.body;

  if (!nom || !telephone) {
    return res.status(400).json({
      message: "Le nom et le téléphone sont obligatoires"
    });
  }

  const checkSql = "SELECT * FROM contacts WHERE nom = ? AND telephone = ?";

  db.query(checkSql, [nom, telephone], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Erreur serveur" });
    }

    if (result.length > 0) {
      return res.status(409).json({
        message: "Ce contact existe déjà"
      });
    }

    const sql = `
      INSERT INTO contacts (nom, telephone, email, description, groupe_id)
      VALUES (?, ?, ?, ?, ?)
    `;

    db.query(
      sql,
      [nom, telephone, email || null, description || null, groupe_id || null],
      (err) => {
        if (err) {
          return res.status(500).json({
            message: "Erreur lors de l'ajout du contact"
          });
        }

        res.json({ message: "Contact ajouté avec succès" });
      }
    );
  });
});

/* UPDATE CONTACT ADMIN */
router.put("/:id", verifyToken, verifyRole("admin"), (req, res) => {
  const { nom, telephone, email, description, groupe_id } = req.body;
  const id = req.params.id;

  if (!nom || !telephone) {
    return res.status(400).json({
      message: "Le nom et le téléphone sont obligatoires"
    });
  }

  const checkSql = `
    SELECT * FROM contacts
    WHERE nom = ? AND telephone = ? AND id != ?
  `;

  db.query(checkSql, [nom, telephone, id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Erreur serveur" });
    }

    if (result.length > 0) {
      return res.status(409).json({
        message: "Un autre contact avec le même nom et téléphone existe déjà"
      });
    }

    const sql = `
      UPDATE contacts
      SET nom=?, telephone=?, email=?, description=?, groupe_id=?
      WHERE id=?
    `;

    db.query(
      sql,
      [nom, telephone, email || null, description || null, groupe_id || null, id],
      (err) => {
        if (err) {
          return res.status(500).json({
            message: "Erreur lors de la modification du contact"
          });
        }

        res.json({ message: "Contact modifié avec succès" });
      }
    );
  });
});

/* DELETE CONTACT ADMIN */
router.delete("/:id", verifyToken, verifyRole("admin"), (req, res) => {
  const sql = "DELETE FROM contacts WHERE id=?";

  db.query(sql, [req.params.id], (err) => {
    if (err) {
      return res.status(500).json({
        message: "Erreur lors de la suppression du contact"
      });
    }

    res.json({ message: "Contact supprimé avec succès" });
  });
});

module.exports = router;