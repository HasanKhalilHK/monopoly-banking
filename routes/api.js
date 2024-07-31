const express = require("express")
const router = express.Router()

let players = {user1: { username: 'user1', balance: 0 }, user2: { username: 'user2', balance: 500 }}

router.get('/players', (req, res) => {
    res.json(players)
});

router.post('/players', (req, res) => {
    const newPlayer = req.body

    let newPlayerName = newPlayer.username
    players[newPlayerName] = newPlayer
    // console.log(players)

    res.status(201).json(newPlayer);
});[]

// router.get('/players/pay', (req, res) => {
//     const sender  = req.query.sender
//     const receiver  = req.query.receiver
//     const amount = req.query.amount
//     if (players[sender].balance -amount >= 0){
//         players[receiver].balance += Number(amount) 
//         players[sender].balance -= Number(amount)
//         res.status(201).send("money sent")
//     }
//     else res.status(403).send("not enough money")
// })

module.exports = (io) => {
    io.on('connection', (socket) => {

        socket.on("player joined", (username) => {
            console.log(`${username} has joined`)
            io.emit("player joined")
        })

        socket.on("pay player", (sender, receiver, amount) => {
            console.log(sender, receiver, amount)
            if (players[sender].balance -amount >= 0){
                players[receiver].balance += Number(amount) 
                players[sender].balance -= Number(amount)
                io.emit("balance changed")
            }
        })
    });

    return router;
};