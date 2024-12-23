const path = require("path");
const express = require("express");
const userRouter = require("./routes/user.router.js"); // Router cho người dùng
const topicRouter = require("./routes/topic.router.js");
const notifyRouter = require("./routes/notify.router.js");
const councilRouter = require("./routes/council.router.js");
const conversationRouter = require("./routes/conversation.router.js");
const messageRouter = require("./routes/message.router.js");
const { crawlImmediately, router: crawlRouter } = require("./routes/crawl.router.js"); // Import hàm crawl và router

const cors = require("cors"); // Middleware cho phép Cross-Origin Resource Sharing
const viewRouter = require("./routes/view.router.js"); // Router cho hiển thị giao diện
const bodyParser = require("body-parser"); // Middleware phân tích body của request
const cookieParser = require("cookie-parser"); // Middleware phân tích cookie
const YAML = require("yaml");
const swaggerUi = require("swagger-ui-express"); 
const fs = require("fs"); // // Thư viện làm việc với hệ thống file
const error = require("./utils/error");

const app = express(); // Tạo ứng dụng Express
app.use(cors()); // Cho phép CORS
app.set("view engine", "pug"); // Thiết lập engine hiển thị là Pug
app.set("views", path.join(__dirname, "views")); // Đường dẫn đến thư mục views

// Cung cấp file tĩnh
app.use(express.static(path.join(__dirname, "public")));

// ảnh avatar


// Phân tích body của request
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/v1/crawl", crawlRouter);

app.use("/api/v1/crawl", crawlImmediately); // Gọi hàm crawl ngay khi server chạy
crawlImmediately();

// Tích hợp Swagger để hiển thị tài liệu API
const file = fs.readFileSync("./document.yaml", "utf8"); // Đọc file YAML
const swaggerDocument = YAML.parse(file); // Phân tích file YAML
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument)); // Route cho tài liệu Swagger

// Sử dụng các router cho các phần của ứng dụng
app.use("/api/v1/users", userRouter); // Router người dùng
app.use("/api/v1/topics", topicRouter); // tương tự cho topic
app.use("/api/v1/councils", councilRouter);
app.use("/api/v1/notifys", notifyRouter);
app.use("/api/v1/conversations", conversationRouter);
app.use("/api/v1/messages", messageRouter);
app.use(express.static('public')); // Cung cấp lại các file tĩnh (dự phòng)

app.use("/", viewRouter); // Router cho giao diện

// Xử lý lỗi cho các route không tồn tại
app.all("*", (req, res, next) => {
  next(new error(`Can't find url: ${req.originalUrl} on this server!!!`, 400));
});

// Export ứng dụng Express
module.exports = app;
