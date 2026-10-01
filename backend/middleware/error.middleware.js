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
      errors,
    });
  }

  if (err.name === "CastError") {
    return res.status(400).json({
      success: false,
      message: "Invalid Job ID",
    });
  }
  // Multer file type error
  if (err.message === "Only PDF files are allowed") {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }

  // Multer file size error
  if (err.code === "LIMIT_FILE_SIZE") {
    return res.status(413).json({
      success: false,
      message: "File size must not exceed 5 MB",
    });
  }

  return res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
};

module.exports = errorMiddleware;
