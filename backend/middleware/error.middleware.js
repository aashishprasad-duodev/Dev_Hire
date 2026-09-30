const errorMiddleware = (err, req, res, next) => {

    console.log(err);

    if (err.name === "ValidationError") {

        const errors = {};

        Object.keys(err.errors).forEach((field) => {
            errors[field] = err.errors[field].message;
        });

        return res.status(400).json({
            success: false,
            message: "Validation failed",
            errors
        });
    }

    if (err.name === "CastError") {
        return res.status(400).json({
            success: false,
            message: "Invalid Job ID",
        });
    }

    return res.status(500).json({
        success: false,
        message: "Internal Server Error"
    });
};

module.exports = errorMiddleware;