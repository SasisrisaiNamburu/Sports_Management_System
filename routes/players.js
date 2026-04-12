const express = require('express');
const router = express.Router();
const Player = require('../models/Player');

// Add player
router.post('/add', async (req, res) => {
    const player = new Player(req.body);
    await player.save();
    res.send("Player Added");
});

// Get all players
router.get('/', async (req, res) => {
    const players = await Player.find();
    res.json(players);
});

// Delete player
router.delete('/delete/:id', async (req, res) => {
    await Player.findByIdAndDelete(req.params.id);
    res.send("Player Deleted");
});

// Update player (bonus)
router.put('/update/:id', async (req, res) => {
    await Player.findByIdAndUpdate(req.params.id, req.body);
    res.send("Player Updated");
});

module.exports = router;
