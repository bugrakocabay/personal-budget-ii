const express = require("express");
const {
  getAllEnvs,
  createEnv,
  getEnv,
  updateEnv,
  deleteEnv,
} = require("./../controllers/envController");

const router = express.Router();

router.route("/").get(getAllEnvs).post(createEnv);
router.route("/:id").get(getEnv).put(updateEnv).delete(deleteEnv);

module.exports = router;
