const LocalStrategy = require("passport-local").Strategy;
const pool = require("./bd");
const bcrypt = require("bcrypt");

const initialize = (passport) => {
  passport.use(
    new LocalStrategy(
      { usernameField: "mail", passwordField: "password" },
      async (mail, password, done) => {
        try {
          const result = await pool.query(
            "SELECT * FROM users WHERE mail = $1",
            [mail]
          );
          const user = result.rows[0];
          if (!user)
            return done(null, false, { message: "Pas d'utilisateur trouvé" });
          const isPasswordValidated = await bcrypt.compare(
            password,
            user.password
          );
          if (!isPasswordValidated)
            return done(null, false, { message: "Mauvais mot de passe" });
          done(null, user);
        } catch (error) {
          console.log("Erreur dans passport: " + error);
          done(error);
        }
      }
    )
  );
  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id, done) => {
    try {
      const result = await pool.query("SELECT * FROM users WHERE id=$1", [id]);
      done(null, result.rows[0]);
    } catch (error) {
      console.log("Erreur dans le deserialize: " + error);
      done(error);
    }
  });
};

module.exports = initialize;
