// 백엔드와 연결
// html에서 socket.io 코드들을 import 했기 때문에 가능함
const socket = io();

const welcome = document.querySelector("#welcome");
const form = welcome.querySelector("form");

function backendDone(msg) {
  console.log(`The backend says: ${msg}`);
}

function handleRoomSubmit(event) {
  event.preventDefault();
  const input = form.querySelector("input");
  // emit -> (event 이름, 보내고 싶은 데이터, 보내고 싶은 콜백 함수)
  // Websocket은 string만 보낼 수 있었는데, socket.io는 마음대로 가능함
  // 함수를 넣을거면 반드시 맨 마지막에 넣어야 함
  // 근데 함수를 백엔드로 보낸다고 그 함수가 백엔드에서 실행되는 것은 아님
  // -> 사실 프론트에서 실행됨 (console.log가 브라우저에서 출력됨)
  socket.emit("enter_room", { payload: input.value }, 1, "str", backendDone);
  input.value = "";
}

form.addEventListener("submit", handleRoomSubmit);
