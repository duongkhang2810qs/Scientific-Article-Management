const app = require("./app.js"); // Import ứng dụng Express từ file app.js
const dotenv = require("dotenv"); // Thư viện để tải các biến môi trường từ file .env
const fs = require("fs"); // Thư viện làm việc với hệ thống file
const https = require("https"); // Thư viện tạo server HTTPS
const http = require("http"); // Thư viện tạo server HTTP
const path = require("path"); // Thư viện xử lý đường dẫn file
const mongoose = require("mongoose"); // Thư viện kết nối và làm việc với MongoDB
const { Server } = require("socket.io"); // Thư viện Socket.IO cho WebSocket
const socketServer = require("./socketServer.js"); // Import logic xử lý Socket.IO

// Load biến môi trường từ file .env
dotenv.config();
// Thiết lập cổng server từ biến môi trường hoặc giá trị mặc định là 8080
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
const dataBase = process.env.AZURE_COSMOS_CONNECTIONSTRING || process.env.DATABASE_LOCAL;
mongoose
  .connect(dataBase, {
    useNewUrlParser: true, // Sử dụng parser mới để xử lý URL chuỗi kết nối
    useUnifiedTopology: true, // Sử dụng công cụ giám sát mới
  })
  .then(() => {
    console.log("connect Database thành công!"); // Thông báo kết nối thành công
  });

// Khởi tạo WebSocket server với Socket.IO
const io = new Server(httpServer);
// Lắng nghe sự kiện kết nối WebSocket
io.on("connection", (socket) => {
  socketServer(socket, io);
});
httpServer.listen(port, () => {
  console.log(`http://localhost:${port}/`);// In thông báo URL khi server chạy
}); 
