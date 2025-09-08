const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator'); // For input validation
const User = require('../models/User');
const nodemailer = require('nodemailer');
const OTP = require('../models/otp'); // Import OTP model


// ...existing code...
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL, // Your Gmail address (e.g., 'your_email@gmail.com')
        pass: process.env.GMAIL_PASSWORD // The generated App Password
    }
});


exports.login = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
        // Check if user exists
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid Credentials' }); // Use generic message for security
        }

        // Compare entered password with hashed password in DB
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        // Create and return JWT
        const payload = {
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                profilePicture: user.profilePicture,
            },
        };
        user.lastLogin = new Date(); // Update last login time
        await user.save(); // Save the updated user with last login time

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '1d' }, // Token expires in 7 days (1 week)
            (err, token) => {
                if (err) throw err;
                res.json({ token, msg: 'Logged in successfully!' });
            }
        );
    }
    catch (err) {
        console.error('❌ Error during login:', err);
        res.status(500).json({ msg: 'Server error' });
    }
};

exports.signup = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;


    try {
        // Check if user already exists (by email or username)
        let user = await User.findOne({ $or: [{ email }, { name }] });
        if (user && user.isActive == true) {
            return res.status(400).json({ warning: 'User with that email or username already exists' });
        }

        if (!user) {
            // Create new user instance
            user = new User({
                name,
                email,
                password, // Password will be hashed below
                lastLogin: new Date(), // Set last login time
                isActive: false, // Default to active
            });

            // Hash password
            const salt = await bcrypt.genSalt(10); // Generate a salt
            user.password = await bcrypt.hash(password, salt); // Hash the password with the salt

            // Save user to the database
            await user.save();
        }
        else {
            // If user exists but is not active, update the existing user
            user.name = name;
            user.email = email;
            user.password = await bcrypt.hash(password, await bcrypt.genSalt(10)); // Hash the new password
            user.lastLogin = new Date(); // Update last login time
            user.isActive = false; // Set to inactive
            await user.save();
        }
        // // Create and return JWT
        // const payload = {
        //     user: {
        //         id: user.id,
        //         name: user.name,
        //         email: user.email,
        //         role: "user", // Include role in the payload
        //     },
        // };
        // try {
        //     const token = jwt.sign(
        //         payload,
        //         process.env.JWT_SECRET,
        //         { expiresIn: '1d' }
        //     );
        //     res.json({ token, msg: 'User registered successfully!' });
        // } catch (err) {
        //     console.error('❌ Error during signup:', err);
        //     res.status(500).json({ error: 'JWT signing failed' });
        // }
        // Generate OTP (One Time Password)
        const otp = Math.floor(100000 + Math.random() * 900000); // Generate a 6-digit OTP
        // Save OTP to the database
        const otpEntry = new OTP({
            email,
            otp,
        });
        await otpEntry.save();
        // Send OTP via email
        try {
            // Define email options
            const mailOptions = {
                from: process.env.GMAIL, // Sender address (must be your Gmail address)
                to: email, // Recipient email address
                subject: "Registration Otp", // Subject line
                text: "text", // Plain text body
                html: `<h1>Registration Otp</h1><p>Your OTP is: <strong>${otp}</strong></p>` // HTML body (optional, can be used instead of or in addition to text)
            };
            // Send the email
            const info = await transporter.sendMail(mailOptions);
            console.log('Email sent: %s', info.messageId);
            // You can log the preview URL for testing emails in development if you're not sending to a real address
            // console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
            res.status(200).json({ success: true, message: 'Email sent successfully!', messageId: info.messageId, });
        } catch (error) {
            console.error('Error sending email:', error);
            res.status(500).json({ success: false, message: 'Failed to send email.', error: error.message });
        }

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.verifyOtp = async (req, res) => {
    const { email, otp } = req.body;
    try {
        if (email && otp) {
            const otpEntry = await OTP.findOne({ email, otp });
            if (!otpEntry) {
                res.status(400).json({ warning: 'Invalid OTP' });
            }
            else {
                if (otpEntry.createdAt.getTime() + 5 * 60 * 1000 < new Date().getTime()) {
                    res.status(400).json({ warning: 'OTP has expired' });
                } else {
                    const user = await User.findOne({ email });
                    if (user) {
                        user.isActive = true;
                        await user.save();
                        await otpEntry.deleteOne();
                        const payload = {
                            user: {
                                id: user.id,
                                name: user.name,
                                email: user.email,
                                role: user.role,
                                profilePicture: user.profilePicture,
                            },
                        };
                        try {
                            const token = jwt.sign(
                                payload,
                                process.env.JWT_SECRET,
                                { expiresIn: '1d' }
                            );
                            res.json({ token, msg: 'User registered successfully!' });
                        } catch (err) {
                            console.error('❌ Error during signup:', err);
                            res.status(500).json({ error: 'JWT signing failed' });
                        }
                    } else {
                        res.status(500).json({ error: "user not found" })
                    }
                }
            }
        }
    } catch (error) {
        console.error('Error verifying OTP:', error);
        res.status(500).json({ error: 'Failed to verify OTP' });
    }
}

exports.googleLogin = async (req, res) => {
    const { email, name, photoURL } = req.body;

    try {
        // Check if user already exists
        let user = await User.findOne({ email });
        if (user) { // If user exists, create JWT and return it
            const payload = {
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    profilePicture: user.profilePicture,
                },
            };
            const token = jwt.sign(
                payload,
                process.env.JWT_SECRET,
                { expiresIn: '1d' }
            );
            return res.json({ token, msg: 'Logged in successfully!' });
        }
        // If user does not exist, create a new user
        user = new User({
            name,
            email,
            password: await bcrypt.hash('password', await bcrypt.genSalt(10)), // Placeholder password, not used for Google login
            role: 'user', // Default role for new users
            lastLogin: new Date(), // Set last login time
            profilePicture: photoURL,
            isActive: true, // Google users are active by default
        });
        await user.save();
        // Create JWT for the new user
        const payload = {
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                profilePicture: user.profilePicture,
            },
        };
        const token = jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );
        res.json({ token, msg: 'User registered and logged in successfully!' });
    } catch (err) {
        console.error('❌ Error during Google login:', err);
        res.status(500).json({ msg: 'Server error' });
    }
};

exports.forgotPassword = async (req, res) => {

    try {
        const { email } = req.body;

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found.' });
        }
        // Generate OTP (One Time Password)
        const otp = Math.floor(100000 + Math.random() * 900000); // Generate a 6-digit OTP
        // Save OTP to the database
        const otpEntry = new OTP({
            email,
            otp,
        });
        await otpEntry.save();
        // Send OTP via email
        try {
            // Define email options
            const mailOptions = {
                from: process.env.GMAIL, // Sender address (must be your Gmail address)
                to: email, // Recipient email address
                subject: "Password Reset otp", // Subject line
                text: "text", // Plain text body
                html: `<h1>Password Reset otp</h1><p>Your OTP is: <strong>${otp}</strong></p>` // HTML body (optional, can be used instead of or in addition to text)
            };
            // Send the email
            const info = await transporter.sendMail(mailOptions);
            console.log('Email sent: %s', info.messageId);
            // You can log the preview URL for testing emails in development if you're not sending to a real address
            // console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
            res.status(200).json({ success: true, message: 'Email sent successfully!', messageId: info.messageId, });

        } catch (error) {
            console.error('Error sending email:', error);
            res.status(500).json({ success: false, message: 'Failed to send email.', error: error.message });
        }
    } catch (error) {
        console.error('Error in forgotPassword:', error);
        res.status(500).json({ success: false, message: 'Failed to process forgot password request.', error: error.message });
    }

};

exports.resetPassword = async (req, res) => {
    const { otp, email, newPassword } = req.body;

    try {
        // Find the OTP entry
        const otpEntry = await OTP.findOne({ email, otp });
        if (!otpEntry) {
            return res.status(400).json({ success: false, message: 'Invalid OTP or email.' });
        }

        // Check if OTP is expired
        const currentTime = new Date();
        if (otpEntry.createdAt.getTime() + 5 * 60 * 1000 < currentTime.getTime()) {
            return res.status(400).json({ success: false, message: 'OTP has expired.' });
        }

        // Hash new password and update user
        const salt = await bcrypt.genSalt(10);
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found.' });
        }
        // Update user's password
        user.password = await bcrypt.hash(newPassword, salt);
        await user.save();

        res.status(200).json({ success: true, message: 'Password reset successfully!' });
    } catch (error) {
        console.error('Error resetting password:', error);
        res.status(500).json({ success: false, message: 'Failed to reset password.', error: error.message });
    }

};