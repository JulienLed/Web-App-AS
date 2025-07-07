const express = require("express");
const router = express.Router();
const passport = require("passport");

router.post("/", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      console.log("Erreur auth:", err, info);
      return res
        .status(401)
        .json({ message: "Pas d'utilisateur avec cet adresse mail" });
    }
    req.logIn(user, (err) => {
      if (err) {
        console.log("Erreur auth:", err, info);
        return next(err);
      }
      res.json({ message: "Connecté", user });
    });
  })(req, res, next);
});

passport.authenticate("local", (err, user, info) => {
  if (err || !user) {
    console.log("Erreur auth:", err, info);
    return res.status(401).json({ message: "Mauvais identifiants" });
  }

  req.login(user, (err) => {
    if (err) {
      console.log("Erreur login():", err);
      return res.status(500).json({ message: "Erreur session" });
    }

    console.log("✅ Login réussi. Session ID:", req.sessionID);
    res.status(200).json({ message: "Connecté", user });
  });
})(req, res);

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
