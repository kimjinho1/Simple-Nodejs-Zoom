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
  socket.on("enter_room", (msg, a, b, done) => {
    console.log(msg, a, b);
    setTimeout(() => {
      done("Hello from the backend");
    }, 1000);
  });
});

const handleListen = () => console.log(`Listening on http://localhost:3000`);
httpServer.listen(3000, handleListen);
