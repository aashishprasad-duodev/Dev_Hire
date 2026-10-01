const path = require("path");
const Application = require("../models/Application");
const Job = require("../models/Job");
const User = require("../models/User");
const fs = require("fs/promises");

// Apply for a job
const applyForJob = async (req, res, next) => {
    try {
        const jobseekerId = req.user.id;
        const { jobId } = req.body;

        // Check whether job exists
        const job = await Job.findById(jobId);

        if (!job) {
            return res.status(404).json({
                success: false,
                message: "Job not found",
            });
        }

        // Check duplicate application
        const existingApplication = await Application.findOne({
            jobseekerId,
            jobId,
        });

        if (existingApplication) {
            return res.status(409).json({
                success: false,
                message: "Already applied to this job",
            });
        }

        const user = await User.findById(jobseekerId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        if (!user.resume) {
            return res.status(400).json({
                success: false,
                message: "Please upload your resume before applying",
            });
        }

        // Create application
        const application = await Application.create({
            jobseekerId,
            jobId,
            resume: user.resume,
        });

        return res.status(201).json({
            success: true,
            message: "Application submitted successfully",
            application,
        });
    } catch (error) {
        next(error);
    }
};

// Update application status
const updateApplicationStatus = async (req, res, next) => {
    try {
        const applicationId = req.params.id;

        const application = await Application.findById(applicationId);

        if (!application) {
            return res.status(404).json({
                success: false,
                message: "Application not found",
            });
        }

        const job = await Job.findById(application.jobId);

        if (!job) {
            return res.status(404).json({
                success: false,
                message: "Job not found",
            });
        }

        // Verify recruiter owns the job
        if (
            req.user.role !== "recruiter" ||
            req.user.id !== job.postedBy.toString()
        ) {
            return res.status(403).json({
                success: false,
                message: "Forbidden",
            });
        }

        const { status } = req.body;

        const allowedStatuses = [
            "pending",
            "applied",
            "interview",
            "completed",
            "rejected",
        ];

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid status",
            });
        }

        application.status = status;

        await application.save();

        return res.status(200).json({
            success: true,
            message: "Application status updated successfully",
            application,
        });
    } catch (error) {
        next(error);
    }
};

// Get applications of logged-in jobseeker
const getMyApplications = async (req, res, next) => {
    try {
        const jobseekerId = req.user.id;

        const applications = await Application.find({
            jobseekerId,
        }).populate("jobId");

        if (applications.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No applications found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Applications retrieved successfully",
            applications,
        });
    } catch (error) {
        next(error);
    }
};

// Get applications for recruiter's own jobs
const getRecruiterApplications = async (req, res, next) => {
    try {
        const recruiterId = req.user.id;

        const jobs = await Job.find({
            postedBy: recruiterId,
        });

        const jobIds = jobs.map((job) => job._id);

        const applications = await Application.find({
            jobId: { $in: jobIds },
        }).populate("jobId");

        return res.status(200).json({
            success: true,
            message: "Applications retrieved successfully",
            applications,
        });
    } catch (error) {
        next(error);
    }
};

const uploadResume = async (req, res, next) => {
    try {
        if (req.user.role !== "jobseeker") {
            return res.status(403).json({
                success: false,
                message: "Only jobseekers can upload resumes",
            });
        }
        const file = req.file;
        if (!file) {
            return res.status(400).json({
                success: false,
                message: "No file uploaded",
            });
        }
        // Save the file path to the user's profile
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        user.resume = file.path;
        await user.save();
        return res.status(200).json({
            success: true,
            message: "Resume uploaded successfully",
            resumePath: file.path,
        });
    } catch (error) {
        next(error);
    }
};

const downloadResume = async (req, res, next) => {
    try {
        const application = await Application.findById(req.params.id);

        if (!application) {
            return res.status(404).json({
                success: false,
                message: "Application not found",
            });
        }

        if (!application.resume) {
            return res.status(404).json({
                success: false,
                message: "Resume not found for this application",
            });
        }

        const job = await Job.findById(application.jobId);

        if (!job) {
            return res.status(404).json({
                success: false,
                message: "Job not found",
            });
        }

        // Only the recruiter who owns this job can download the resume
        if (job.postedBy.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to download this resume",
            });
        }

        // Ensure the stored file is inside the uploads directory
        const uploadDir = path.resolve(__dirname, "../uploads");
        const resumePath = path.resolve(application.resume);
        const relativePath = path.relative(uploadDir, resumePath);

        if (relativePath.startsWith("..") || path.isAbsolute(relativePath)) {
            return res.status(403).json({
                success: false,
                message: "Invalid resume file path",
            });
        }

        await fs.access(resumePath);

        return res.download(resumePath, "candidate-resume.pdf");
    } catch (error) {
        if (error.code === "ENOENT") {
            return res.status(404).json({
                success: false,
                message: "Resume file not found on server",
            });
        }

        next(error);
    }
};

module.exports = {
    applyForJob,
    updateApplicationStatus,
    getMyApplications,
    getRecruiterApplications,
    uploadResume,
    downloadResume,
};
