const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware.js');
const {createUser, loginUser , profileController} = require('../controllers/auth.controller.js');

router.post('/register',createUser)
router.post('/login',loginUser)
router.get("/profile", authMiddleware, profileController);

module.exports = router;