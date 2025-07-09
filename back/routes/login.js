const express = require("express");
const router = express.Router();
const passport = require("passport");

router.post("/", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);

    if (!user) {
      return res
        .status(401)
        .json({ message: "Pas d'utilisateur avec cet adresse mail" });
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      req.session.save((err) => {
        if (err) {
          return res.status(500).json({ message: "Erreur session" });
        }
        res.status(200).json({ message: "Connecté" });
      });
    });
  })(req, res, next);
});

router.get("/google", passport.authenticate("google"));

router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
    failureMessage: true,
  }),
  (req, res, next) => res.redirect(`${process.env.FRONT_URL}/client`)
);

module.exports = router;
