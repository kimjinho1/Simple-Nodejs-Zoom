// 백엔드와 연결
// html에서 socket.io 코드들을 import 했기 때문에 가능함
const socket = io();

const welcome = document.querySelector("#welcome");
const form = welcome.querySelector("form");
const room = document.querySelector("#room");

room.hidden = true;

let roomName;

function addMessage(message) {
  const ul = room.querySelector("ul");
  const li = document.createElement("li");
  li.innerText = message;
  ul.appendChild(li);
}

function handleNicknameSubmit(event) {
  event.preventDefault();
  const input = room.querySelector("#name input");
  const value = input.value;
  socket.emit("nickname", value);
  input.value = "";
}

function handleMessageSubmit(event) {
  event.preventDefault();
  const input = room.querySelector("#msg input");
  // 아래 줄이 없으면 input.value가 아래에서 비워진 상태라 동작이 이상해짐
  const value = input.value;
  socket.emit("new_message", value, roomName, () => {
    addMessage(`you: ${value}`);
  });
  input.value = "";
}

function showRoom() {
  welcome.hidden = true;
  room.hidden = false;
  const h3 = room.querySelector("h3");
  h3.innerText = `Room ${roomName}`;

  const nameForm = room.querySelector("#name");
  const msgForm = room.querySelector("#msg");
  nameForm.addEventListener("submit", handleNicknameSubmit);
  msgForm.addEventListener("submit", handleMessageSubmit);
}

function handleRoomSubmit(event) {
  event.preventDefault();
  const input = form.querySelector("input");
  // emit -> (event 이름, 보내고 싶은 데이터, 보내고 싶은 콜백 함수)
  // Websocket은 string만 보낼 수 있었는데, socket.io는 마음대로 가능함
  // 함수를 넣을거면 반드시 맨 마지막에 넣어야 함
  // 근데 함수를 백엔드로 보낸다고 그 함수가 백엔드에서 실행되는 것은 아님
  // -> 사실 프론트에서 실행됨 (console.log가 브라우저에서 출력됨)
  roomName = input.value;
  socket.emit("enter_room", input.value, showRoom);
  input.value = "";
}

form.addEventListener("submit", handleRoomSubmit);

socket.on("welcome", (user) => {
  addMessage(`${user} joined!`);
});

socket.on("bye", (left) => {
  addMessage(`${left} left!`);
});

socket.on("new_message", (msg) => addMessage(msg));
