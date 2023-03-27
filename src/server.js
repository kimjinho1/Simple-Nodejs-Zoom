// express, babel, nodemon, pug
import http from "http";
import WebSocket from "ws";
import express from "express";
import { SocketAddress } from "net";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (_, res) => res.render("home"));
app.get("/*", (_, res) => res.redirect("/"));

const handleListen = () => console.log(`Listening on http://localhost:3000`);
// app.listen(3000, handleListen);

// 같은 서버에서 http, websocket 둘 다 동작시킴
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const sockets = [];

// 브라우저와의 연결
wss.on("connection", (socket) => {
  sockets.push(socket);
  console.log("Connected to Browser!");
  socket.on("close", () => console.log("Disconected from Browser"));
  socket.on("message", (message) => {
    sockets.forEach((aSocket) => aSocket.send(message.toString()));
  });
  socket.send("hello!");
});

server.listen(3000, handleListen);
