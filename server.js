const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Routes (we'll create these next)
const authRoutes = require('./routes/auth');
const playerRoutes = require('./routes/players');

app.use('/auth', authRoutes);
app.use('/players', playerRoutes);

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

// Start server
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/pages/login.html');
});
app.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});

app.put('/players/update/:id', async (req, res) => {
    try {
        await Player.findByIdAndUpdate(req.params.id, req.body);
        res.send("Player updated successfully");
    } catch (err) {
        res.status(500).send("Error updating player");
    }
});
