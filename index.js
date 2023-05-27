const express = require('express');
const app = express()
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);


app.use(express.static('assets'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});


let rooms = {};
let num = 1;

function comperison(one, two) {
    if (one[1] === two[1]) {
        return "tied";
    }
    if (one[1] === 'rock') {
        if (two[1] === 'paper') {
            return `${two[0]} Win`;
        }
        if (two[1] === 'scissors') {
            return `${one[0]} Win`;
        }
    } else if (one[1] === 'paper') {
        if (two[1] === 'rock') {
            return `${one[0]} Win`;
        }
        if (two[1] === 'scissors') {
            return `${two[0]} Win`;
        }

    } else if (one[1] === 'scissors') {
        if (two[1] === 'rock') {
            return `${two[0]} Win`;
        }
        if (two[1] === 'paper') {
            return `${one[0]} Win`;
        }
    }
}

let socketsRooms = {}

io.on('connection', (socket) => {
    socket.on("join-room", (roomName, socketName) => {
        if (rooms[roomName] && rooms[roomName]['playersNum'] === 2) {

            io.to(socket.id).emit("room-full");
            return 0;

        }
        if (!rooms[roomName] || rooms[roomName]['playersNum'] < 2) {
            socket.join(roomName);
            if (rooms[roomName]) {
                rooms[roomName]['playersNum'] += 1;
                rooms[roomName]['secondPlayer'] = socketName;
                io.to(socket.id).emit("you-joined", rooms[roomName]['firstPlayer']);
            } else {
                rooms[roomName] = {};
                rooms[roomName]['playersNum'] = num;
                rooms[roomName]['plays'] = [];
                rooms[roomName]['firstPlayer'] = socketName;

                io.to(socket.id).emit("you-joined", false);
            }
            socketsRooms[socket.id] = [socketName, roomName];
            socket.broadcast.to(roomName).emit("joined", socketName);

            return 0;
        }



    });

    socket.on("player-played", (choice, roomName, pName) => {

        rooms[roomName]['plays'].push([pName, choice]);
        socket.broadcast.to(roomName).emit("player-played", "player-played", choice, pName);

        if (rooms[roomName]['plays'].length === 2) {
            let one = rooms[roomName]['plays'][0];
            let two = rooms[roomName]['plays'][1];
            let result = comperison(one, two);

            io.to(roomName).emit("result", result);
        }


    });

    socket.on("another-game", (sName, roomName) => {
        if (rooms[roomName]['playersNum'] < 2) {
            io.to(socket.id).emit("wait-refresh");
            return;
        }
        if (rooms[roomName]['another']) {
            rooms[roomName]['another'] = false;
            rooms[roomName]['plays'] = [];
            io.to(roomName).emit("reset");

        } else {
            rooms[roomName]['another'] = num;
            socket.broadcast.to(roomName).emit("want-another", sName);

        }
    })
    socket.on("got-request", (roomName) => {
        socket.broadcast.to(roomName).emit("wait-response");
    })

    socket.on("disconnect", () => {
        console.log("someone disconnected");
        if (socketsRooms[socket.id]) {
            if (socketsRooms[socket.id][1]) {
                var rName = socketsRooms[socket.id][1];
                var pName = socketsRooms[socket.id][0];
                rooms[rName]['firstPlayer'] === pName ? rooms[rName]['firstPlayer'] = rooms[rName]['secondPlayer'] : rooms[rName]['secondPlayer'] = '';
                rooms[rName]['playersNum'] -= 1;
                rooms[rName]['plays'] = [];
                socket.broadcast.to(rName).emit("leaved")
            }

        }

        socket._cleanup()
        socket.disconnect()

    })

});


const port = process.env.PORT || 3000

server.listen(port, () => {
    console.log(`It runs on port ${port}`);
});

module.exports = app;

/*c
classes : 
win | h1
opacity | app
class_ | card
choices | c | chosen

*/