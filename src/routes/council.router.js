const express = require("express");
const councilController = require("../controllers/api/council.controller.js");
const {
  authMiddleware,
  restrictTo,
} = require("../controllers/api/auth.controller.js");

const Router = express.Router();

Router.route("/")
  .get(councilController.getcouncils)
  .post(authMiddleware, councilController.postcouncil);

Router.route("/:id")
  .get(councilController.getcouncil)
  .patch(authMiddleware, councilController.updatecouncil)
  .delete(authMiddleware, restrictTo("admin"), councilController.deletecouncil);
module.exports = Router;
