const Job = require("../models/Job");
const createJob = async (req, res, next) => {
  try {
    const { title, description, company, location, salary, skills } = req.body;
    const job = await Job.create({
      title,
      description,
      company,
      location,
      salary,
      skills,
      postedBy: req.user.id,
    });
    return res.status(201).json({
      success: true,
      message: "Job created successfully",
      job,
    });
  } catch (err) {
    next(err);
  }
};

const getJobs = async (req, res, next) => {
    try {
        const location = req.query.location;

        const filter = {
            status: "open"
        };

        if (location) {
            filter.location = {
                $regex: location,
                $options: "i",
            };
        }

        const jobs = await Job
            .find(filter)
            .populate("postedBy", "name")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            jobs,
        });

    } catch (err) {
        next(err);
    }
};
const getJobById = async (req, res, next) => {
    try {


        const id = req.params.id;

        const job = await Job
            .findById(id)
            .populate("postedBy", "name");
        
        if (!job) {
            return res.status(404).json({
                success: false,
                message: "Job not found",
            });
        }

        res.status(200).json({
            success: true,
            job,
        });

    } catch (err) {
        next(err);
    }
};

module.exports = {
  createJob,
  getJobs,
  getJobById,
};
