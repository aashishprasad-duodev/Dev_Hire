const Application = require("../models/Application");
const Job = require("../models/Job");

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

        // Create application
        const application = await Application.create({
            jobseekerId,
            jobId,
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


module.exports = {
    applyForJob,
    updateApplicationStatus,
    getMyApplications,
    getRecruiterApplications,
};