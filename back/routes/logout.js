const router = require("express").Router();

router.post("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.clearCookie("connect.sid");
    res.status(200).json({ message: "Déconnexion réussie" });
  });
});

module.exports = router;
