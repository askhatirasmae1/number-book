const jwt = require("jsonwebtoken");

const SECRET_KEY = "number_book_secret";

/* Vérifie le token JWT envoyé dans les headers */
const verifyToken = (req, res, next) => {

  const header = req.headers["authorization"];

  /* Si pas de token */
  if (!header) {
    return res.status(401).json({ message: "Token manquant" });
  }

  /* Récupérer le token après "Bearer" */
  const token = header.split(" ")[1];

  /* Vérifier le token */
  jwt.verify(token, SECRET_KEY, (err, decoded) => {

    /* Si token invalide */
    if (err) {
      return res.status(403).json({ message: "Token invalide" });
    }

    /* Sauvegarder les infos utilisateur */
    req.user = decoded;

    next();
  });
};

module.exports = verifyToken;