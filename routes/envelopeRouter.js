const express = require("express");
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

router.route("/:id/edit").get(updatePage).post(updateEnv);
router.route("/:id/delete").get(deleteEnv);
router.route("/create").get(readCreatePage).post(createEnv);
router.route("/").get(getAllEnvs);
router.route("/:id").get(getEnv, getEnvelopeTransactions);

router
  .route("/:id/transactions")
  .post(createEnvTransaction)
  .get(readTransactionPage);

module.exports = router;
