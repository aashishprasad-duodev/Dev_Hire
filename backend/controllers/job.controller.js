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
    const title = req.query.title;
    const skill = req.query.skill;

    const pageParam = req.query.page;

    let page = 1;
    if (pageParam !== undefined) {
      page = Number(pageParam);

      if (!Number.isInteger(page) || page < 1) {
        return res.status(400).json({
          success: false,
          message: "Page must be a positive integer",
        });
      }
    }

    const limitParam = req.query.limit;
    let limit = 10;
    if (limitParam !== undefined) {
      limit = Number(limitParam);
      if (!Number.isInteger(limit) || limit < 1) {
        return res.status(400).json({
          success: false,
          message: "Limit must be a positive integer",
        });
      }
      if (limit > 100) {
        return res.status(400).json({
          success: false,
          message: "Limit must not be greater than 100",
        });
      }
    }
    const skip = (page - 1) * limit;

    const filter = {
      status: "open",
    };

    if (location) {
      filter.location = {
        $regex: location,
        $options: "i",
      };
    }

    if (title) {
      filter.title = {
        $regex: title,
        $options: "i",
      };
    }

    if (skill) {
      filter.skills = {
        $regex: skill,
        $options: "i",
      };
    }

    const jobs = await Job.find(filter)
      .populate("postedBy", "name")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalJobs = await Job.countDocuments(filter);
    const totalPages = Math.ceil(totalJobs / limit);

    return res.status(200).json({
      success: true,
      jobs,
      pagination: {
        page,
        limit,
        totalJobs,
        totalPages,
      },
    });
  } catch (err) {
    next(err);
  }
};
const getJobById = async (req, res, next) => {
  try {
    const id = req.params.id;

    const job = await Job.findById(id).populate("postedBy", "name");

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

const updateJob = async (req, res, next) => {
  try {
    // 1. Get Job ID from URL
    const id = req.params.id;

    // 2. Find the job
    const job = await Job.findById(id);

    // 3. Check if job exists
    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    // 4. Get logged-in user's information
    const userId = req.user.id;
    const userRole = req.user.role;

    // 5. Debug information


    // 6. Check recruiter role + job ownership
    if (userRole !== "recruiter" || userId !== job.postedBy.toString()) {
      return res.status(403).json({
        success: false,
        message: "Forbidden",
      });
    }

    // 7. Create update object
    const updateData = {};

    // 8. Add only fields provided by the client
    if (req.body.title !== undefined) {
      updateData.title = req.body.title;
    }

    if (req.body.description !== undefined) {
      updateData.description = req.body.description;
    }

    if (req.body.company !== undefined) {
      updateData.company = req.body.company;
    }

    if (req.body.location !== undefined) {
      updateData.location = req.body.location;
    }

    if (req.body.salary !== undefined) {
      updateData.salary = req.body.salary;
    }

    if (req.body.skills !== undefined) {
      updateData.skills = req.body.skills;
    }

    if (req.body.status !== undefined) {
      updateData.status = req.body.status;
    }

    // 9. Check if there is anything to update
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No fields provided for update",
      });
    }

    // 10. Update the job
    const updatedJob = await Job.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    // 11. Send response
    return res.status(200).json({
      success: true,
      message: "Job updated successfully",
      job: updatedJob,
    });
  } catch (err) {
    next(err);
  }
};

const deleteJob = async (req, res, next) => {
    try {
        // 1. Get Job ID from URL
        const id = req.params.id;

        // 2. Find job
        const job = await Job.findById(id);

        // 3. Check job exists
        if (!job) {
            return res.status(404).json({
                success: false,
                message: "Job not found",
            });
        }

        // 4. Get logged-in user's ID and role
        const userId = req.user.id;
        const userRole = req.user.role;

        // 5. Check role + ownership
        if (
            userRole !== "recruiter" ||
            userId !== job.postedBy.toString()
        ) {
            return res.status(403).json({
                success: false,
                message: "Forbidden",
            });
        }

        // 6. Delete job
        const deletedJob = await Job.findByIdAndDelete(id);

        // 7. Response
        return res.status(200).json({
            success: true,
            message: "Job deleted successfully",
            job: deletedJob,
        });

    } catch (err) {
        next(err);
    }
};

module.exports = {
  createJob,
  getJobs,
  getJobById,
  updateJob,
  deleteJob,
};
