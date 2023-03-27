// express, babel, nodemon, pug
import http from "http";
import WebSocket from "ws";
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
const wss = new WebSocket.Server({ httpServer });

const sockets = [];
// websocket 브라우저와의 연결
wss.on("connection", (socket) => {
  sockets.push(socket);
  socket["nickname"] = "Anon";
  console.log("Connected to Browser!");
  socket.on("close", () => console.log("Disconected from Browser"));
  socket.on("message", (msg) => {
    const message = JSON.parse(msg);
    switch (message.type) {
      case "message":
        sockets.forEach((aSocket) =>
          aSocket.send(
            `${socket.nickname}: ${message.payload.toString("utf-8")}`
          )
        );
        break;
      case "nickname":
        socket["nickname"] = message.payload;
        break;
      default:
        throw new Error("Error");
    }
  });
});

wss.on("connection", (socket) => {
  console.log(socket);
});

const handleListen = () => console.log(`Listening on http://localhost:3000`);
httpServer.listen(3000, handleListen);
