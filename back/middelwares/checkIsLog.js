const isLogged = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.status(401).json({ message: "Accès non authorisé" });
  }
};

module.exports = isLogged;
