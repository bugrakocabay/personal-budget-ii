const bcrypt = require("bcrypt");
const passport = require("passport");
const { db } = require("../db/db");
const catchAsync = require("../config/catchAsync");

exports.loginUser = passport.authenticate("local", {
  successRedirect: "/envelopes",
  failureRedirect: "/user/login",
  failureFlash: true,
});

exports.logoutUser = (req, res, next) => {
  req.logOut(function (err) {
    if (err) {
      return next(err);
    }
    req.flash("success_msg", "you have been logged out");
    res.redirect("/user/login");
  });
};

exports.registerPage = (req, res) => {
  res.render("register");
};

exports.loginPage = (req, res) => {
  res.render("login");
};

exports.logoutPage = (req, res) => {
  req.logOut(function (err) {
    if (err) {
      return next(err);
    }
    req.flash("success_msg", "you have been logged out");
    res.redirect("/user/login");
  });
};

exports.registerUser = catchAsync(async (req, res, next) => {
  let { username, password, password2 } = req.body;
  let usernameTrim = username.replace(/\s+/g, "").toLowerCase();
  let passwordTrim = password.replace(/\s+/g, "");
  let password2Trim = password2.replace(/\s+/g, "");

  let errors = [];

  if (!usernameTrim || !passwordTrim || !password2Trim) {
    errors.push({ messsage: "Lütfen tüm boşlukları doldurun" });
  }

  if (passwordTrim.length < 6) {
    errors.push({ messsage: "Şifre 6 karakterden fazla olmalı" });
  }

  if (passwordTrim != password2Trim) {
    errors.push({ messsage: "Şifreler uyuşmuyor" });
  }

  if (errors.length > 0) {
    res.render("register", { errors });
  } else {
    let hashedPassword = await bcrypt.hash(passwordTrim, 10);
    let query = "SELECT * FROM users WHERE username = $1";

    const results = await db.query(query, [usernameTrim]);

    if (results.rows.length > 0) {
      errors.push({ message: "Kullanıcı adı kullanımda" });
      res.render("register", { errors });
    } else {
      const registerQuery =
        "INSERT INTO users (username, password) VALUES ($1, $2) RETURNING username, password";

      const resultsQuery = await db.query(registerQuery, [
        usernameTrim,
        hashedPassword,
      ]);

      req.flash("success_msg", "Kayıt başarılı! Lütfen giriş yap");
      res.redirect("/user/login");
    }
  }
});

exports.checkAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return res.redirect("/envelopes");
  }
  next();
};

exports.checkNotAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/user/login");
};
