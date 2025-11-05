// server.js (updated)
require('dotenv').config(); // <-- load env first

const path = require("path");
const mongoose = require("mongoose");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const formatMessage = require("./utils/messages");
const { encrypt, decrypt } = require("./utils/cryptography.js");
const Cryptr = require("cryptr");
const Room = require("./RoomSchema");
const bcrypt = require("bcrypt");
var bodyParser = require("body-parser");
const cryptr = new Cryptr(
    "56dce7276d2b0a24e032beedf0473d743dbacf92aafe898e5a0f8d9898c9eae80a73798beed53489e8dbfd94191c1f28dc58cad12321d8150b93a2e092a744265fd214d7c2ef079e2f01b6d06319b7b2"
);

const {
    userJoin,
    getCurrentUser,
    userLeave,
    getRoomUsers,
} = require("./utils/users");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Setting static folder
app.use(express.static(path.join(__dirname, "public")));
// for parsing application/json
app.use(bodyParser.json());
// for parsing application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// ---------- MongoDB connection (use .env MONGODB_URI or fallback to local) ----------
const mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017/chat_db";

mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log(`✅ MongoDB connected: ${mongoUri}`))
    .catch((err) => {
        console.error("❌ MongoDB connection error:", err.message || err);
        // Optional: exit process if DB is required for app to run
        // process.exit(1);
    });

// -------------------------------------------------------------------------------

const botName = "Admin";

// Run when client connects
io.on("connection", (socket) => {
    socket.on("joinRoom", ({ username, room }) => {
        const user = userJoin(socket.id, username, room);

        socket.join(user.room);

        // Welcome current user
        socket.emit(
            "message",
            formatMessage(botName, cryptr.encrypt("Welcome To Chatbox"))
        );

        // Broadcast to other users in the room
        socket.broadcast
            .to(user.room)
            .emit(
                "message",
                formatMessage(
                    botName,
                    cryptr.encrypt(`${user.username} has entered the chat room`)
                )
            );

        // Send room and users info
        io.to(user.room).emit("roomUsers", {
            room: user.room,
            users: getRoomUsers(user.room),
        });
    });

    socket.on("chatMessage", (msg) => {
        const user = getCurrentUser(socket.id);
        io.to(user.room).emit("message", formatMessage(user.username, msg));
    });

    // When user disconnects
    socket.on("disconnect", () => {
        const user = userLeave(socket.id);

        if (user) {
            io.to(user.room).emit(
                "message",
                formatMessage(
                    botName,
                    cryptr.encrypt(`${user.username} has left the chat`)
                )
            );

            // Send users and room info
            io.to(user.room).emit("roomUsers", {
                room: user.room,
                users: getRoomUsers(user.room),
            });
        }
    });
});

// ROUTES
app.get("/decrypt", (req, res) => {
    const message = req.query.message;
    console.log("LD: " + (message ? message.length : 0));
    const decrypted = message ? cryptr.decrypt(message) : "";
    res.json(decrypted);
});

app.get("/encrypt", (req, res) => {
    const message = req.query.message;
    const encrypted = message ? cryptr.encrypt(message) : "";
    console.log("LE: " + (encrypted ? encrypted.length : 0));
    res.json(encrypted);
});

app.post("/validate", (req, res) => {
    const username = req.body["username"];
    const roomName = req.body["room"];
    const key = req.body.key;
    Room.findOne({ name: roomName }, async (err, room) => {
        if (room === null) {
            return res.redirect("wrong-password.html"); // Room not found
        }

        try {
            if (await bcrypt.compare(key, room.secretKey)) {
                const rn = room.name;
                const usern = username;
                const url = "chat.html?room=" + rn + "&username=" + usern + "&sk=" + room._id;
                console.log(url);
                return res.redirect(url);
            } else {
                return res.redirect("wrong-password.html"); // Incorrect Password
            }
        } catch (error) {
            console.error("Error during /validate:", error);
            return res.redirect("wrong-password.html"); // unknown error
        }
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
