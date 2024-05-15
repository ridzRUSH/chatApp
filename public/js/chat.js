const socket = io();

const subBtn = document.querySelector("#sendMsg");
const messageBox = document.querySelector(".message-box");
const locationButton = document.querySelector("#btn-location");

// Tempelate
const messageTemplate = document.querySelector("#message-template").innerHTML;
const locationTempelate = document.querySelector(
  "#message-template-location"
).innerHTML;

const userTempelate = document.querySelector("#sidebar-template").innerHTML;

// query location
const params = new URLSearchParams(window.location.search);
const username = params.get("username");
const roomId = params.get("roomId");

subBtn.addEventListener("click", (e) => {
  // disable send messgae button
  subBtn.setAttribute("disabled", "disabled");
  e.preventDefault();
  socket.emit("messageSend", document.querySelector(".message-box").value);
  messageBox.value = "";
  messageBox.focus();

  subBtn.removeAttribute("disabled");

  // enbale send message button
});

socket.on("receivedMessage", (msg) => {
  const html = Mustache.render(messageTemplate, {
    username: msg.username,
    message: msg.message,
    createdAt: moment(msg.createdAt).calendar(),
  });
  document.querySelector(".msg").insertAdjacentHTML("beforeend", html);
});

socket.on("location", (url, username) => {
  const html = Mustache.render(locationTempelate, { url, username });
  document.querySelector(".msg").insertAdjacentHTML("beforeend", html);
});

socket.on("message", (msg) => {});

locationButton.addEventListener("click", () => {
  locationButton.setAttribute("disabled", "disabled");
  if (!navigator.geolocation) {
    alert("no support for location");
  } else {
    navigator.geolocation.getCurrentPosition((position) => {
      socket.emit(
        "location",
        {
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        },
        () => {}
      );
    });
  }
  locationButton.removeAttribute("disabled");
});

// room
socket.emit("join", { username, roomId }, (error) => {
  if (error) {
    alert(error);
    location.href = "/";
  }
});

socket.on("roomData", ({ room, users }) => {
  const html = Mustache.render(userTempelate, { room, users });

  document.querySelector(".sidebar").innerHTML = html;
});
