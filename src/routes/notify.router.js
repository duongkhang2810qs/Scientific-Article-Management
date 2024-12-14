const express = require("express");
const notifyController = require("../controllers/api/notify.controller.js");
const {
  authMiddleware,
  restrictTo,
} = require("../controllers/api/auth.controller.js");

const Router = express.Router();

Router.route("/")
  .get(notifyController.getNotifys)
  .post(authMiddleware, notifyController.postNotify);

Router.route("/:id")
  .get(notifyController.getNotify)
  .patch(authMiddleware, notifyController.updateNotify)
  .delete(authMiddleware, restrictTo("admin"), notifyController.deleteNotify);
module.exports = Router;
