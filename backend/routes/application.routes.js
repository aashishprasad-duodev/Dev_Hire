const express = require("express");

const router = express.Router();

const ApplicationController = require("../controllers/application.controller");
const authMiddleware = require("../middleware/auth.middleware");
const authorizeRole = require("../middleware/role.middleware");


router.post("/apply",authMiddleware,authorizeRole("jobseeker") ,ApplicationController.applyForJob);
router.patch("/:id/status",authMiddleware,authorizeRole("recruiter") ,ApplicationController.updateApplicationStatus);
router.get("/my",authMiddleware,authorizeRole("jobseeker") ,ApplicationController.getMyApplications);
router.get("/all",authMiddleware,authorizeRole("recruiter") ,ApplicationController.getRecruiterApplications);

module.exports = router;