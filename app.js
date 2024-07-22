const express = require("express");
const bodyParser = require('body-parser');
const cors = require("cors")
const { createServer } = require('node:http');
const { Server } = require('socket.io');

const app = express();
const server = createServer(app)
const io = new Server(server);

app.use(bodyParser.json());
app.use(cors());
app.use(express.static(__dirname + '/public'))

const PORT = 8000

const dashboard = require("./routes/dashboard")
const api = require("./routes/api")(io);


app.get("/", (req,res) => {
    res.sendFile("public/pages/login.html", {root:__dirname})
});


app.use("/api", api)

app.use("/dashboard", dashboard)


server.listen(PORT, () => {
    console.log(`Listening on port ${PORT} http://localhost:${PORT}`);
});
