const express = require("express")
const router = express.Router()

let players = {user1: { username: 'user1', balance: 0 }}

router.get('/players', (req, res) => {
    res.json(players)
});

router.post('/players', (req, res) => {
    const newPlayer = req.body

    let newPlayerName = newPlayer.username
    players[newPlayerName] = newPlayer
    // console.log(players)

    res.status(201).json(newPlayer);
});

module.exports = (io) => {
    io.on('connection', (socket) => {

        socket.on("player joined", (username) => {
            console.log(`${username} has joined`)
            socket.broadcast.emit("player joined")
        })
        
        

    });

    return router;
};