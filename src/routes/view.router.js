const express = require("express");// Import thư viện express để tạo router
const userModel = require("../models/user.model");
const councilModel = require("../models/council.model");
const viewController = require("../controllers/view.controller");// Import các controller để xử lý logic hiển thị
const { addUserIdToQuery } = require("../middleware/addUserIdToQuery");// Import middleware để thêm userId vào truy vấn
const {// Import middleware xác thực và chức năng quên mật khẩu
  authMiddleware,
  forgotPassword,
} = require("../controllers/auth.controller");
const Router = express.Router();

//login
Router.get("/login", (req, res) => {// Định nghĩa route cho trang đăng nhập
  res.status(200).render("login_form");
});

// Định nghĩa route cho chức năng quên mật khẩu
Router.post("/forgotPassword", forgotPassword);
Router.get("/resetPassword/:token", (req, res) => {
  res.status(200).render("resetPassword", { token: req.params.token });
});

Router.use(authMiddleware);// Áp dụng middleware xác thực cho các route bên dưới

//home
Router.get("/", viewController.home);// Định nghĩa route cho trang chủ

//topic
// Định nghĩa các route liên quan đến chủ đề (topic)
Router.get("/topic/:id", authMiddleware, viewController.getTopic);
Router.get("/topics", viewController.getTopics);
Router.get("/my_topics", authMiddleware, viewController.getTopics);
Router.get("/new_topic", async (req, res) => {
  res.status(200).render("new_topic");
});
//user
// Định nghĩa các route liên quan đến người dùng
Router.get("/users/:id", viewController.getUser);
Router.get("/me", authMiddleware, viewController.getMe, viewController.getUser);
Router.get("/newuser", async (req, res) => {
  res.status(200).render("new_user");
});
Router.get("/users", async (req, res) => {
  const users = await userModel.find();
  res.status(200).render("user_list", { users });
});
Router.get("/fixuser/:id", async (req, res) => {
  res.status(200).render("edituser");
});
Router.get("/changepass", async (req, res) => {
  res.status(200).render("changepass");
});
//  hội đồng
// Định nghĩa các route liên quan đến hội đồng (council)
Router.get("/new_council", async (req, res) => {
  res.status(200).render("new_council");
});
Router.get("/councillist", async (req, res) => {
  const councils = await councilModel.find().populate("ChuTich");
  res.status(200).render("council_list", { councils });
});
Router.get("/council/:id", async (req, res) => {
  const council = await councilModel
    .findById(req.params.id)
    .populate("ChuTich")
    .populate("Thuky")
    .populate("UyVien1")
    .populate("UyVien2");
  res.status(200).render("view_council", { council });
});
// Router.get("/council/:id", viewController.viewCouncil);

// Định nghĩa các route khác
Router.get("/notify/:id", viewController.viewNotify);
Router.get("/notify", async (req, res) => {
  res.status(200).render("notify");
});
// thêm đề tài
Router.get("/rating", viewController.getRating);

Router.get("/report", async (req, res) => {
  res.status(200).render("report");
});
Router.get("/manageprogress", async (req, res) => {
  res.status(200).render("manageprogress");
});
Router.get("/managetask", async (req, res) => {
  res.status(200).render("managetask");
});

Router.get("/chat", addUserIdToQuery, viewController.getConversations);
Router.get("/chatbox", async (req, res) => {
  res.status(200).render("MessagesPanel");
});

Router.get("/meeting", async (req, res) => {
  res.status(200).render("meeting");
});

module.exports = Router;// Xuất module Router để sử dụng trong các file khác
