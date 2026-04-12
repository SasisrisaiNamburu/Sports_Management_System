const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Register
router.post('/register', async (req, res) => {
    const user = new User(req.body);
    await user.save();
    res.send("Registered Successfully");
});

// Login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    const user = await User.findOne({ username, password });

    if (user) {
        res.send("Login Successful");
    } else {
        res.send("Invalid Credentials");
    }
});

module.exports = router;
