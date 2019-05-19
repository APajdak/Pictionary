let socket = io();

document
  .querySelector('#userName input[type="submit"]')
  .addEventListener("click", enterToTheGame);
document.querySelector("#sendMessage").addEventListener("submit", sendMessage);

let wordSpan = document.createElement("span");
wordSpan.id = "word";
let erase = document.querySelector("#erase");
let canvas = document.querySelector("#canvas");
let ctx = canvas.getContext("2d");
let rect = canvas.getBoundingClientRect();
let canvasData = {
  color: document.querySelector(".clicked").id,
  penSize: document.querySelector("#penSize").value
};

let colors = document.querySelector(".colors").children;

let score = document.querySelector("#user-list");

function scrollChatWindow() {
  document.querySelector(".chatWindow").scrollTop = document.querySelector(
    ".chatWindow"
  ).scrollHeight;
}

function enterToTheGame(e) {
  e.preventDefault();
  let userName = document.querySelector('#userName input[type="text"]').value;

  socket.emit("joinGame", userName, err => {
    if (err) {
      alert(err);
      window.location.href = "/";
    }
  });
  document.querySelector("#login").classList.add("hide");
  document.querySelector(".container").classList.remove("blur");
  document.querySelector("#messageInput").removeAttribute("disabled");
}

function sendMessage(e) {
  e.preventDefault();
  socket.emit("message", document.querySelector("#messageInput").value);
  document.querySelector("#messageInput").value = "";
}
socket.on("scoreBoard", users => {
  let template = document.querySelector("#score-board-template").innerHTML;
  let html = Mustache.render(template, { users });
  let scoreBoard = document.querySelector("#user-list");
  while (scoreBoard.hasChildNodes()) {
    scoreBoard.removeChild(scoreBoard.childNodes[0]);
  }
  scoreBoard.insertAdjacentHTML("beforeend", html);
});

socket.on("drawer", word => {
  wordSpan.innerHTML = `Draw: ${word}`;
  document.querySelector("#pwd").innerHTML = "";
  document.querySelector("#pwd").appendChild(wordSpan);
  document.querySelector("#messageInput").setAttribute("disabled", "disabled");
  document
    .querySelector("#messageInput")
    .setAttribute("placeholder", "You are drawing");

  canvas.addEventListener("mousedown", onMouseDown);
  canvas.addEventListener("mouseup", onMouseUp);
  canvas.addEventListener("mousemove", onMouseMove);
  erase.addEventListener("click", clearCanvas);

  document
    .querySelector("#penSize")
    .addEventListener("change", chanagePencilSize);

  for (let i = 0; i < colors.length; i++) {
    colors[i].addEventListener("click", changeColor);
  }
});

socket.on("guess", category => {
  wordSpan.innerHTML = `Category: ${category}`;
  document.querySelector("#pwd").innerHTML = "";
  document.querySelector("#pwd").appendChild(wordSpan);
  document
    .querySelector("#messageInput")
    .removeAttribute("disabled", "disabled");
  document
    .querySelector("#messageInput")
    .setAttribute("placeholder", "Your guess");

  canvas.removeEventListener("mousedown", onMouseDown);
  canvas.removeEventListener("mouseup", onMouseUp);
  canvas.removeEventListener("mousemove", onMouseMove);
  erase.removeEventListener("click", clearCanvas);
  document
    .querySelector("#penSize")
    .removeEventListener("change", chanagePencilSize);

  for (let i = 0; i < colors.length; i++) {
    colors[i].removeEventListener("click", changeColor);
  }
});

socket.on("timeLeft", time => {
  document.querySelector("#timeLeft").innerText = time;
});

// Canvas

function drawLine(canvasData) {
  ctx.beginPath();
  ctx.lineCap = "round";
  ctx.lineWidth = canvasData.penSize;
  ctx.strokeStyle = canvasData.color;
  ctx.moveTo(canvasData.X, canvasData.Y);
  ctx.lineTo(canvasData.eX, canvasData.eY);
  ctx.stroke();
  ctx.closePath();
}

function sendCanvas() {
  let img = canvas.toDataURL("image/png", 1);
  socket.emit("drawing", img);
}

socket.on("drawing", pic => {
  let img = new Image();
  img.onload = () => {
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  };
  img.src = pic;
});

function clearCanvas() {
  socket.emit("clear");
}

let draw = true;

function onMouseUp(e) {
  if (!draw) {
    return;
  }
  draw = false;
  canvasData.eX = Math.floor(
    ((e.clientX - rect.left) / (rect.right - rect.left)) * canvas.width
  );
  canvasData.eY = Math.floor(
    ((e.clientY - rect.top) / (rect.bottom - rect.top)) * canvas.height
  );
  drawLine(canvasData);
  sendCanvas();
}

function onMouseDown(e) {
  draw = true;
  canvasData.X = Math.floor(
    ((e.clientX - rect.left) / (rect.right - rect.left)) * canvas.width
  );
  canvasData.Y = Math.floor(
    ((e.clientY - rect.top) / (rect.bottom - rect.top)) * canvas.height
  );
}

function onMouseMove(e) {
  if (!draw) {
    return;
  }
  canvasData.eX = Math.floor(
    ((e.clientX - rect.left) / (rect.right - rect.left)) * canvas.width
  );
  canvasData.eY = Math.floor(
    ((e.clientY - rect.top) / (rect.bottom - rect.top)) * canvas.height
  );
  drawLine(canvasData);
  canvasData.X = Math.floor(
    ((e.clientX - rect.left) / (rect.right - rect.left)) * canvas.width
  );
  canvasData.Y = Math.floor(
    ((e.clientY - rect.top) / (rect.bottom - rect.top)) * canvas.height
  );
}
socket.on("clearCanvas", function() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
});

function chanagePencilSize() {
  canvasData.penSize = document.querySelector("#penSize").value;
}

function changeColor(e) {
  for (let i = 0; i < colors.length; i++) {
    colors[i].classList.remove("clicked");
  }
  this.classList.add("clicked");
  canvasData.color = this.id;
}

// Mustache template

socket.on("chatWindow", data => {
  let template = document.querySelector("#message-template").innerHTML;
  let html = Mustache.render(template, {
    text: data.text,
    from: data.from,
    sendedAt: data.sendedAt
  });
  document.querySelector(".chatWindow").insertAdjacentHTML("beforeend", html);
  scrollChatWindow();
});

socket.on("serverMessage", data => {
  let template = document.querySelector("#server-message-template").innerHTML;
  let html = Mustache.render(template, {
    text: data.text,
    from: data.from
  });
  document.querySelector(".chatWindow").insertAdjacentHTML("beforeend", html);
  scrollChatWindow();
});
