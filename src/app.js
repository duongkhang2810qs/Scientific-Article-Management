const path = require("path");
const express = require("express");
const userRouter = require("./routes/user.router.js");
const topicRouter = require("./routes/topic.router.js");
const notifyRouter = require("./routes/notify.router.js");
const councilRouter = require("./routes/council.router.js");
const conversationRouter = require("./routes/conversation.router.js");
const messageRouter = require("./routes/message.router.js");
const cors = require("cors");
const viewRouter = require("./routes/view.router.js");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const YAML = require("yaml");
const swaggerUi = require("swagger-ui-express");
const fs = require("fs");
const error = require("./utils/error");

const app = express();
app.use(cors());
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

// Serving static files
app.use(express.static(path.join(__dirname, "public")));

// ảnh avatar



app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
// doc swagger
const file = fs.readFileSync("./document.yaml", "utf8");
const swaggerDocument = YAML.parse(file);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use("/api/v1/users", userRouter);
app.use("/api/v1/topics", topicRouter);
app.use("/api/v1/councils", councilRouter);
app.use("/api/v1/notifys", notifyRouter);
app.use("/api/v1/conversations", conversationRouter);
app.use("/api/v1/messages", messageRouter);
app.use(express.static('public'));

app.use("/", viewRouter);
app.all("*", (req, res, next) => {
  next(new error(`Can't find url: ${req.originalUrl} on this server!!!`, 400));
});

module.exports = app;
