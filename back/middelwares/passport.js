const LocalStrategy = require("passport-local").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const pool = require("./bd");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");

dotenv.config();

const initialize = (passport) => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: `${process.env.BACK_URL}/login/auth/google/callback`,
        scope: ["profile", "email"],
        state: true,
      },
      async (accessToken, refreshToken, profile, cb) => {
        try {
          const { rows: existing } = await pool.query(
            "SELECT * FROM users WHERE provider = $1 AND subject = $2",
            ["https://accounts.google.com", profile.id]
          );

          if (existing.length === 0) {
            // Nouvel utilisateur : d'abord insérer le nom
            const { rows: insertedUser } = await pool.query(
              "INSERT INTO users(name, provider, subject, role, mail) VALUES($1, $2, $3, $4, $5) RETURNING id",
              [
                profile.displayName,
                "https://accounts.google.com",
                profile.id,
                "client",
                profile.emails?.[0]?.value,
              ]
            );
            const userId = insertedUser[0].id;
            const user = { id: userId, name: profile.displayName };
            return cb(null, user);
          } else {
            // Utilisateur déjà connu
            const { rows: user } = await pool.query(
              "SELECT * FROM users WHERE subject = $1",
              [profile.id]
            );

            if (user.length === 0) return cb(null, false);

            return cb(null, user[0]);
          }
        } catch (err) {
          return cb(err);
        }
      }
    )
  );

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
      done(error);
    }
  });
};

module.exports = initialize;
