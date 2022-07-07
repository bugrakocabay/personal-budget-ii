const passport = require("passport");
const { db } = require("../db/db");
const LocalStrategy = require("passport-local");
const bcrypt = require("bcrypt");

function initialize(passport) {
  const authenticateUser = (username, password, done) => {
    db.query(
      "SELECT * FROM users WHERE username = $1",
      [username],
      (err, results) => {
        if (err) {
          throw err;
        }
        if (results.rows.length > 0) {
          const user = results.rows[0];

          bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) {
              throw err;
            }
            if (isMatch) {
              return done(null, user);
            } else {
              /// incorrect password
              return done(null, false, { message: "Hatalı şifre" });
            }
          });
        } else {
          /// No user
          return done(null, false, { message: "Kullanıcı bulunamadı" });
        }
      }
    );
  };
  passport.use(
    new LocalStrategy(
      {
        usernameField: "username",
        passwordField: "password",
      },
      authenticateUser
    )
  );
  passport.serializeUser((user, done) => done(null, user.id));

  passport.deserializeUser((id, done) => {
    db.query(`select * from users where id = $1`, [id], (err, results) => {
      if (err) {
        throw err;
      }
      return done(null, results.rows[0]);
    });
  });
}

module.exports = initialize;
