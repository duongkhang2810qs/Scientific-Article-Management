const app = require("./app.js");
const dotenv = require("dotenv");
const fs = require("fs");
const https = require("https");
const http = require("http");
const path = require("path");
const mongoose = require("mongoose");
const { Server } = require("socket.io");
const socketServer = require("./socketServer.js");
//config dotenv
dotenv.config();
const port = process.env.PORT || 8080;
const httpServer = http.createServer(
  // {
  //   key: fs.readFileSync(path.join(__dirname, "ssl", "key.pem")),
  //   cert: fs.readFileSync(path.join(__dirname, "ssl", "cert.pem")),
  //   passphrase: "1234",
  // },
  app
);

//connect DB
mongoose
  .connect(process.env.DATABASE_LOCAL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("connect DB oke!");
  });
//socket
const io = new Server(httpServer);
io.on("connection", (socket) => {
  socketServer(socket, io);
});
httpServer.listen(port, () => {
  console.log(`http://localhost:${port}/`);
});
