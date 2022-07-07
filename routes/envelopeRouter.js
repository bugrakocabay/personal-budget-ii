const express = require("express");
const { checkNotAuthenticated } = require("../controllers/authController");
const {
  getAllEnvs,
  createEnv,
  readCreatePage,
  getEnv,
  updateEnv,
  deleteEnv,
  createEnvTransaction,
  getEnvelopeTransactions,
  updatePage,
  readTransactionPage,
} = require("../controllers/envController");

const router = express.Router();

router
  .route("/:id/edit")
  .get(checkNotAuthenticated, updatePage)
  .post(updateEnv);
router.route("/:id/delete").get(checkNotAuthenticated, deleteEnv);
router
  .route("/create")
  .get(checkNotAuthenticated, readCreatePage)
  .post(createEnv);
router.route("/").get(checkNotAuthenticated, getAllEnvs);
router
  .route("/:id")
  .get(checkNotAuthenticated, getEnv, getEnvelopeTransactions);

router
  .route("/:id/transactions")
  .post(createEnvTransaction)
  .get(readTransactionPage);

module.exports = router;
