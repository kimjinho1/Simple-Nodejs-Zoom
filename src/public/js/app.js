// 백엔드와 연결
// html에서 socket.io 코드들을 import 했기 때문에 가능함
const socket = io();

const welcome = document.querySelector("#welcome");
const form = welcome.querySelector("form");

function handleRoomSubmit(event) {
  event.preventDefault();
  const input = form.querySelector("input");
  // emit -> (event 이름, 보내고 싶은 데이터, 보내고 싶은 콜백 함수)
  socket.emit("enter_room", { payload: input.value }, () => {
    console.log("server is done!");
  });
  input.value = "";
}

form.addEventListener("submit", handleRoomSubmit);
