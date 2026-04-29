const verifyRole = (role) => {

  /* Vérifie si l'utilisateur a le rôle requis (admin ou user) */
  return (req, res, next) => {

    /* Si l'utilisateur n'existe pas ou rôle غير مطابق */
    if (!req.user || req.user.role !== role) {
      return res.status(403).json({
        message: "Accès refusé (rôle insuffisant)"
      });
    }

    /* Autorisation accordée */
    next();
  };
};

module.exports = verifyRole;