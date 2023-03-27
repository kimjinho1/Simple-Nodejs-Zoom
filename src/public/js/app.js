// 서버와의 연결
const socket = new WebSocket(`ws://${window.location.host}`);

socket.addEventListener("message", (message) => {
  console.log(`Just got this: ${message.data} from server`);
});

socket.addEventListener("close", () => {
  console.log("Disconected from server");
});
