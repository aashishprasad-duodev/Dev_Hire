const express = require("express");
const authMiddleware = require("../middleware/auth.middleware");
const authorizeRole = require("../middleware/role.middleware");
const { createJob, getJobs ,getJobById} = require("../controllers/job.controller");
const router = express.Router();

router.post(
    "/",
    authMiddleware,
    authorizeRole("recruiter"),
    createJob
);

router.get("/", getJobs);

router.get('/:id',getJobById);



module.exports = router;