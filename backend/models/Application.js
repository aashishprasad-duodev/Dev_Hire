const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
    {
        jobseekerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        jobId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Job",
            required: true
        },

        status: {
            type: String,
            enum: [
                "applied",
                "pending",
                "interview",
                "completed",
                "rejected"
            ],
            default: "applied",
            trim: true
        }
    },
    {
        timestamps: true
    }
);

// One jobseeker can apply to a particular job only once
applicationSchema.index(
    { jobseekerId: 1, jobId: 1 },
    { unique: true }
);

const Application = mongoose.model("Application", applicationSchema);

module.exports = Application;