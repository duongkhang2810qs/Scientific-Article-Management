const express = require("express");
const Router = express.Router();
const messageController = require("../controllers/api/message.controller");
const { authMiddleware } = require("../controllers/api/auth.controller");
Router.use(authMiddleware);
Router.route("/")
  .get(messageController.addUserIdToQuery, messageController.getMessages)
  .post(messageController.addSender, messageController.postMessage);

Router.route("/:id")
  .patch(messageController.updateMessage)
  .delete(messageController.deleteMessage);

module.exports = Router;
