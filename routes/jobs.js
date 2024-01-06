const express = require("express");
const router = express.Router();
const {
  getAllJobs,
  getJob,
  deleteJob,
  createJob,
  updateJob,
} = require("../controllers/jobs");
router.route("/").get(getAllJobs).post(createJob);
router.route("/:id").patch(updateJob).delete(deleteJob).get(getJob);
module.exports = router;
