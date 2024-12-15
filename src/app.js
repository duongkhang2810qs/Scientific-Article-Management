const path = require("path");
const express = require("express");
const userRouter = require("./routes/user.router.js"); // Router xử lý các API liên quan đến người dùng
const topicRouter = require("./routes/topic.router.js"); // Router xử lý các API liên quan đến đề tài
const notifyRouter = require("./routes/notify.router.js"); // Router xử lý các API liên quan đến thông báo
const councilRouter = require("./routes/council.router.js"); // Router xử lý các API liên quan đến hội đồng
const conversationRouter = require("./routes/conversation.router.js"); // Router xử lý các API liên quan đến hội thoại
const messageRouter = require("./routes/message.router.js"); // Router xử lý các API liên quan đến tin nhắn
const cors = require("cors"); // Cho phép sử dụng CORS (Cross-Origin Resource Sharing)
const viewRouter = require("./routes/view.router.js"); // Router xử lý hiển thị giao diện
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser"); // Dùng để phân tích cookie từ yêu cầu
const YAML = require("yaml"); // Dùng để đọc file YAML
const swaggerUi = require("swagger-ui-express"); // Thư viện hiển thị tài liệu API dựa trên file document.yaml bằng Swagger
const fs = require("fs");
const error = require("./utils/error"); // Xử lý lỗi tùy chỉnh

const app = express();

// Cho phép CORS, chia sẻ tài nguyên từ các domain khác nhau (fe truy cập be chạy được trên các domain khác nhau)
app.use(cors());

// Thiết lập view engine là Pug và đường dẫn đến thư mục views
app.set("view engine", "pug"); // View Engine: Sử dụng Pug để render giao diện HTML.
app.set("views", path.join(__dirname, "views")); // Views Directory: Chỉ định đường dẫn thư mục chứa các file .pug.


// Phục vụ các tệp tĩnh (CSS, JS, hình ảnh) từ thư mục public
app.use(express.static(path.join(__dirname, "public")));

// Phân tích dữ liệu JSON và dữ liệu URL-encoded từ yêu cầu
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Phân tích cookie từ yêu cầu
app.use(cookieParser());

// Đọc file Swagger YAML và thiết lập tài liệu API tại đường dẫn /api-docs
const file = fs.readFileSync("./document.yaml", "utf8");
const swaggerDocument = YAML.parse(file);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Định tuyến các API liên quan đến từng module
app.use("/api/v1/users", userRouter); // QUẢN LÝ NGƯỜI DÙNG (ĐĂNG KÝ, ĐĂNG NHẬP, CẬP NHẬT  THÔNG TIN)
app.use("/api/v1/topics", topicRouter); // QUẢN LÝ ĐỀ TÀI 
app.use("/api/v1/councils", councilRouter); // QUẢN LÝ HỘI ĐỒNG
app.use("/api/v1/notifys", notifyRouter); // QUẢN LÝ THÔNG BÁO
app.use("/api/v1/conversations", conversationRouter); // QUẢN LÝ HỘI THOẠI
app.use("/api/v1/messages", messageRouter); // QUẢN LÝ TIN NHẮN 

// Phục vụ tệp tĩnh từ thư mục public
app.use(express.static('public'));

// Định tuyến cho các giao diện hiển thị
app.use("/", viewRouter);

// Xử lý các yêu cầu không xác định
app.all("*", (req, res, next) => {
  next(new error(`Không tìm thấy URL: ${req.originalUrl} trên máy chủ này!!!`, 400));
});

module.exports = app;

/*
1.Frontend gửi yêu cầu:
Dữ liệu có thể là JSON, form data hoặc file.
Yêu cầu API (ví dụ: /api/v1/users) hoặc yêu cầu giao diện (/topics).

2.Middleware xử lý yêu cầu:
CORS kiểm tra quyền truy cập.
express.json(), express.urlencoded() xử lý dữ liệu gửi lên.
cookieParser đọc cookie.

3.Router xử lý:
Chuyển yêu cầu đến đúng controller (xử lý logic).

4.Trả về phản hồi:
API trả về JSON, giao diện trả về trang HTML/Pug.

5.Xử lý lỗi:
Nếu không tìm thấy route hoặc có lỗi trong quá trình xử lý, hệ thống gửi thông báo lỗi.
 */
