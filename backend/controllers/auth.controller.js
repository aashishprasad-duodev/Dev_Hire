const bcrypt = require("bcrypt");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

const createUser = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    res.status(201).json({
      success: true,
      message: "User created successfully",
    });
  } catch (err) {
    if(err.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "User already exists",
      });
    }
    next(err);
    
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid password",
      });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token
    });
  } catch (err) {
    next(err);
  }
};


const profileController = (req, res, next) => {
    try {
        const user = req.user.id;

        res.status(200).json({
            success: true,
            user
        });
    } catch (err) {
        next(err);
    }
};

module.exports = {
  createUser,
  loginUser,
  profileController
};
