const express = require("express");
const usercontroller = require("../controllers/api/user.controller.js");
const authcontroller = require("../controllers/api/auth.controller.js");
const {
  authMiddleware,
  restrictTo,
} = require("../controllers/auth.controller.js");
const Router = express.Router();
Router.get("/mee", (req, res) => {
  console.log("f");
  res.status(200).json("Hello from the server");
});
Router.route("/login").post(authcontroller.login);
Router.route("/signup").post(authcontroller.createUser);
Router.route("/forgotPassword").post(authcontroller.forgotPassword);
Router.patch("/resetPassword/:token", authcontroller.resetPassword);

Router.use(authcontroller.authMiddleware);
Router.route("/logout").get(authcontroller.logout);
Router.route("/updatePassword").patch(authcontroller.updatePassword);
Router.route("/me")
  .get(usercontroller.getMe, usercontroller.getUser)
  .patch(
    usercontroller.uploadUserPhoto,
    usercontroller.updateMe,
    usercontroller.updateUser
  )
  .delete(usercontroller.deleteMe);
// Router.route("/users/:id")
//   .get(usercontroller.getUser)
//   .delete(authMiddleware, restrictTo("admin"), usercontroller.deleteUser);
Router.route("/").get(usercontroller.getUsers);
Router.route("/:id")
  .get(usercontroller.getUser)
  .patch(
    restrictTo("admin"),
    usercontroller.uploadUserPhoto,
    usercontroller.updateUser
  )
  .delete(authMiddleware, restrictTo("admin"), usercontroller.deleteUser);
module.exports = Router;
