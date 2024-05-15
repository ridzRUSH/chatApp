const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const { generateMessage } = require("./utils/messages.js");
const {
  addUser,
  removeUser,
  getUserInRoom,
  getUser,
  users,
} = require("./utils/users.js");

const app = express();
const server = http.createServer(app);

const io = socketio(server);
const PORT = 3000;

const publicDirectory = path.join(__dirname, "../public");
app.use(express.static(publicDirectory));

io.on("connection", (socket) => {
  socket.on("messageSend", (msg) => {
    const user = getUser(socket.id);
    io.to(user.roomId).emit(
      "receivedMessage",
      generateMessage(user.username, msg)
    );
  });

  socket.on("join", ({ username, roomId }, callback) => {
    const { error, user } = addUser({ id: socket.id, username, roomId });
    if (error) {
      return callback(error);
    }

    socket.join(user.roomId);

    socket.emit("receivedMessage", generateMessage("admin", "hello"));
    socket.broadcast
      .to(user.roomId)
      .emit(
        "receivedMessage",
        generateMessage(user.username, `${user.username} has joined`)
      );
    io.to(user.roomId).emit("roomData", {
      room: user.roomId,
      users: getUserInRoom(user.roomId),
    });

    callback();
  });

  socket.on("disconnect", () => {
    const user = removeUser(socket.id);
    if (user) {
      io.to(user.roomId).emit(
        "receivedMessage",
        generateMessage("Admin", `${user.username} has left`)
      );
      io.to(user.roomId).emit("roomData", {
        room: user.roomId,
        users: getUserInRoom(user.roomId),
      });
    }
  });

  socket.on("location", (pos, callback) => {
    const user = getUser(socket.id);
    io.to(user.roomId).emit(
      "location",
      `https://www.google.com/maps/@${pos.lat},${pos.lon},15z?entry=ttu`,
      user.username
    );
    callback();
  });
});

server.listen(PORT, () => {
  console.log(" app is up 0n 3000");
});
