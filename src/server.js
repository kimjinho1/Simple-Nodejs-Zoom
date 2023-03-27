// express, babel, nodemon, pug
import http from "http";
import SocketIO from "socket.io";
import express from "express";
import { SocketAddress } from "net";
import { parse } from "path";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (_, res) => res.render("home"));
app.get("/*", (_, res) => res.redirect("/"));

// 같은 서버에서 http, websocket 둘 다 동작시킴
const httpServer = http.createServer(app);
const wsServer = SocketIO(httpServer);

wsServer.on("connection", (socket) => {
  // onAny: socket 관련 모든 이벤트를 감지
  socket.onAny((event) => {
    console.log(`Socket Event: ${event}`);
  });
  socket.on("enter_room", (roomName, done) => {
    // join: 채팅 방에 입장
    socket.join(roomName);
    done();
    // to: 특정 방을 저격함
    // 채팅 방에 접속해있는 사람들에게 welcome 메세지 보냄,
    // 처음에는 들어와있는 사람이 없어서 아무것도 안보임
    socket.to(roomName).emit(`welcome`);
  });
});

const handleListen = () => console.log(`Listening on http://localhost:3000`);
httpServer.listen(3000, handleListen);
