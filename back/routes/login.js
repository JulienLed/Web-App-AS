const express = require("express");
const router = express.Router();
const passport = require("passport");

router.post("/", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);
    if (!user)
      return res
        .status(401)
        .json({ message: "Pas d'utilisateur avec cet adresse mail" });
    req.logIn(user, (err) => {
      if (err) return next(err);
      res.json({ message: "Connecté", user });
    });
  })(req, res, next);
});

module.exports = router;
