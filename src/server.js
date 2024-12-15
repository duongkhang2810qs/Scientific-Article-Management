const app = require("./app.js"); // Import ứng dụng chính
const dotenv = require("dotenv"); // Thư viện để đọc các biến môi trường từ file .env
const fs = require("fs"); // Thư viện để làm việc với hệ thống tệp
const https = require("https"); // Thư viện để tạo HTTPS server
const http = require("http"); // Thư viện để tạo HTTP server
const path = require("path"); // Thư viện để xử lý đường dẫn
const mongoose = require("mongoose"); // Thư viện kết nối MongoDB
const { Server } = require("socket.io"); // Thư viện cho giao tiếp thời gian thực
const socketServer = require("./socketServer.js"); // File xử lý socket server

// Cấu hình dotenv để sử dụng biến môi trường
dotenv.config();

// Lấy cổng từ biến môi trường hoặc sử dụng giá trị mặc định là 8080
const port = process.env.PORT || 8080;

// Tạo HTTP server và tích hợp ứng dụng chính
const httpServer = http.createServer(
  // Có thể cấu hình HTTPS tại đây bằng cách cung cấp key và chứng chỉ SSL
  // {
  //   key: fs.readFileSync(path.join(__dirname, "ssl", "key.pem")),
  //   cert: fs.readFileSync(path.join(__dirname, "ssl", "cert.pem")),
  //   passphrase: "1234",
  // },
  app
);

// Kết nối cơ sở dữ liệu MongoDB
mongoose
  .connect(process.env.DATABASE_LOCAL, {
    useNewUrlParser: true, // Sử dụng trình phân tích URL mới
    useUnifiedTopology: true, // Sử dụng engine quản lý kết nối mới
  })
  .then(() => {
    console.log("Kết nối cơ sở dữ liệu thành công!");
  })
  .catch((err) => {
    console.error("Lỗi kết nối cơ sở dữ liệu:", err);
  });

// Tích hợp Socket.IO cho giao tiếp thời gian thực
const io = new Server(httpServer);
io.on("connection", (socket) => {
  console.log("Client kết nối:", socket.id);
  socketServer(socket, io); // Xử lý các sự kiện từ socket
});

// Khởi động server
httpServer.listen(port, () => {
  console.log(`Server đang chạy tại: http://localhost:${port}/`);
});
