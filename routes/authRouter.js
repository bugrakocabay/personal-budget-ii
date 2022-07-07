const express = require("express");
const {
  registerPage,
  loginPage,
  loginUser,
  logoutUser,
  registerUser,
  checkAuthenticated,
} = require("../controllers/authController");

const router = express.Router();

router
  .route("/register")
  .get(checkAuthenticated, registerPage)
  .post(registerUser);
router.route("/login").get(checkAuthenticated, loginPage).post(loginUser);
router.route("/logout").get(logoutUser);

module.exports = router;
