const express = require("express");
const userModel = require("../models/user.model");
const councilModel = require("../models/council.model");
const viewController = require("../controllers/view.controller");
const { addUserIdToQuery } = require("../middleware/addUserIdToQuery");
const {
  authMiddleware,
  forgotPassword,
} = require("../controllers/auth.controller");
const Router = express.Router();

//login
Router.get("/login", (req, res) => {
  res.status(200).render("login_form");
});

Router.post("/forgotPassword", forgotPassword);
Router.get("/resetPassword/:token", (req, res) => {
  res.status(200).render("resetPassword", { token: req.params.token });
});

Router.use(authMiddleware);

//home
Router.get("/", viewController.home);

//topic
Router.get("/topic/:id", authMiddleware, viewController.getTopic);
Router.get("/topics", viewController.getTopics);
Router.get("/my_topics", authMiddleware, viewController.getTopics);
Router.get("/new_topic", async (req, res) => {
  res.status(200).render("new_topic");
});
//user
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

module.exports = Router;
