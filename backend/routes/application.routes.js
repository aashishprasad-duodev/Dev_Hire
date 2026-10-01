const express = require("express");

const router = express.Router();

const ApplicationController = require("../controllers/application.controller");
const authMiddleware = require("../middleware/auth.middleware");
const uploadMiddleware = require("../middleware/upload.middleware");
const authorizeRole = require("../middleware/role.middleware");


router.post("/apply",authMiddleware,authorizeRole("jobseeker") ,ApplicationController.applyForJob);
router.patch("/:id/status",authMiddleware,authorizeRole("recruiter") ,ApplicationController.updateApplicationStatus);
router.get("/my",authMiddleware,authorizeRole("jobseeker") ,ApplicationController.getMyApplications);
router.get("/all",authMiddleware,authorizeRole("recruiter") ,ApplicationController.getRecruiterApplications);
router.post("/upload", authMiddleware, authorizeRole("jobseeker"), uploadMiddleware.single("resume"), ApplicationController.uploadResume);
router.get("/download/:id", authMiddleware, authorizeRole("recruiter"), ApplicationController.downloadResume);
module.exports = router;