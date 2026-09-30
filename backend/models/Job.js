const mongoose = require("mongoose");

const JobSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim:true,
        minlength:3
    },

    description: {
        type: String,
        required: true,
        trim:true,
        minlength:20
    },

    company: {
        type: String,
        required: true,
        trim:true,
        minlength:2
    },

    location: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
    
    },

    salary: {
        type: String,
        required: true,
        trim:true
    },

    skills: {
        type: [String],
        required: true,
        validate: {
        validator: (skills) => skills.length > 0,
        message: "At least one skill is required",
    },
    },

    status: {
        type: String,
        enum: ["open", "closed"],
        default: "open",
        trim:true
    },

    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    }
},{
    timestamps: true
});

const Job = mongoose.model("Job", JobSchema);

module.exports = Job;