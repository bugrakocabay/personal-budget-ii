const express = require("express");
const {
  getAllEnvs,
  createEnv,
  getEnv,
  updateEnv,
  deleteEnv,
  createEnvTransaction,
  getEnvelopeTransactions,
} = require("../controllers/envController");

const router = express.Router();

router.route("/").get(getAllEnvs).post(createEnv);
router.route("/:id").get(getEnv).put(updateEnv).delete(deleteEnv);
router
  .route("/:id/transactions")
  .post(createEnvTransaction)
  .get(getEnvelopeTransactions);

module.exports = router;
