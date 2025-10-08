const PORT = process.env.PORT || 3000;
import express from "express";
import { createServer } from "http";
import path from "path";
import { Server } from "socket.io";
import { instrument } from "@socket.io/admin-ui";
// import { CanvasInput } from "canvasinput";
// let input = new CanvasInput({
//     canvas: document.getElementById("canvas"),
// });
const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
    },
});

const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, "game")));


let rooms = {};

io.on("connection", (socket) => {
    console.log(`New connection from ${socket.handshake.address}, ${socket.handshake.time}`);
    io.emit("updateRoomList", rooms);

    socket.on("nickname", (nickname) => {
        socket.nickname = nickname;
    });

    socket.on("createRoom", (roomId, nickname, character) => {
        console.log("Creating room");
        const newPlayer = {
            nickname,
            leader: true,
            character,
        };
        rooms[roomId] = {
            id: roomId,
            players: [newPlayer],
        };
        socket.roomId = roomId;
        socket.join(roomId);
        io.emit("updateRoomList", rooms);
        socket.emit("roomCreated", rooms[roomId]);
    });

    socket.on("joinRoom", (roomId, nickname) => {
        let character = "fireboy";
        if (rooms[roomId].players[0].character == "fireboy") {
            character = "watergirl";
        }

        const newPlayer = {
            nickname,
            leader: false,
            character,
        };
        rooms[roomId].players.push(newPlayer);
        console.log("Joining room " + roomId);

        socket.roomId = roomId;
        socket.join(roomId);
        io.emit("updateRoomList", rooms);
        io.to(roomId).emit("roomJoined", rooms[roomId]);
    });

    socket.on("menu-diamond-pressed", (levelIndex) => {
        socket.to(socket.roomId).emit("menu-diamond-pressed", levelIndex);
    });

    socket.on("menu-button-pressed", (menuButton) => {
        socket.to(socket.roomId).emit("menu-button-pressed", menuButton);
    });

    socket.on("player-moved", (playerPosition) => {
        socket.to(socket.roomId).emit("player-moved", playerPosition);
    });

    socket.on("key-down", (key, position) => {
        socket.to(socket.roomId).emit("key-down", key, position);
    });

    socket.on("key-up", (key, position) => {
        socket.to(socket.roomId).emit("key-up", key, position);
    });

    socket.on("disconnect", () => {
        console.log("User disconnected");
        if (socket.roomId) {
            console.log(socket.roomId);
            io.to(socket.roomId).emit("deleteRoom", rooms[socket.roomId]);
            delete rooms[socket.roomId];
            io.emit("updateRoomList", rooms);
        }
    });
});

instrument(io, {
    auth: false,
    mode: "development",
});

server.listen(PORT, () => console.log(`Server is running on ${PORT}`));
