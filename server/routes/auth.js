const express = require('express');
const router = express.Router();
const authcontroller = require('../controllers/authcontroller');
const { check } = require('express-validator');


const auth = require('../middleware/authMiddleware');


router.post('/login', [
  // Validation checks for login
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Password is required').exists(),
],
  authcontroller.login
);


// 📋 [GET] List all students
router.post('/signup',
  [
    // Validation checks
    check('name', 'Username is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
  ],
  authcontroller.signup
);
router.post("/google-login", authcontroller.googleLogin);
router.post("/forgot-password", authcontroller.forgotPassword);
router.post("/verify-otp", authcontroller.verifyOtp);


// router.post("/forgot-password", authcontroller.forgotPassword);
router.post("/reset-password", authcontroller.resetPassword);

module.exports = router;