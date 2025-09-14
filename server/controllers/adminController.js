const User = require('../models/User');
const LoginActivity = require('../models/LoginActivity');

/**
 * Fetches all users with their corresponding blog counts.
 */
exports.getUserBlogCounts = async (req, res) => {
    try {
        const userBlogCounts = await User.aggregate([
            {
                $lookup: {
                    from: "blogs",
                    localField: "_id",
                    foreignField: "author",
                    as: "blogs",
                },
            },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    email: 1,
                    role: 1,
                    blogCount: { $size: "$blogs" },
                },
            },
            {
                $sort: { name: 1 },
            },
        ]);

        res.status(200).json(userBlogCounts);
    } catch (err) {
        console.error("Error fetching user blog counts:", err);
        res.status(500).json({ error: "Internal server error" });
    }
};

/**
 * Fetches all users.
 */
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (err) {
        console.error('Error fetching users:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

/**
 * Deletes a user by ID.
 */
exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.userId);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        res.json({ msg: 'User deleted successfully' });
    } catch (err) {
        console.error(`Error deleting user with ID ${req.params.userId}:`, err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

/**
 * Updates a user's information by ID.
 */
exports.updateUser = async (req, res) => {
    const { name, email, role } = req.body;
    const updatedData = { name, email, role };

    if (!name || !email || !role) {
        return res.status(400).json({ msg: 'Please provide name, email, and role.' });
    }

    try {
        const user = await User.findByIdAndUpdate(
            req.params.userId,
            { $set: updatedData },
            { new: true, runValidators: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        res.json(user);
    } catch (err) {
        console.error(`Error updating user with ID ${req.params.userId}:`, err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

/**
 * Fetches today's user login stats (logins per hour).
 */
exports.getTodayLoginStats = async (req, res) => {
    try {
        const today = new Date();
        today.setUTCHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setUTCDate(today.getUTCDate() + 1);

        const logins = await LoginActivity.aggregate([
            { $match: { timestamp: { $gte: today, $lt: tomorrow } } },
            { $group: { _id: { $hour: { date: "$timestamp", timezone: "UTC" } }, count: { $sum: 1 } } },
            { $sort: { _id: 1 } }
        ]);

        const hourlyLogins = Array(24).fill(0);
        logins.forEach(login => {
            hourlyLogins[login._id] = login.count;
        });

        res.json({ logins: hourlyLogins });
    } catch (err) {
        console.error('Error fetching today\'s login stats:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};