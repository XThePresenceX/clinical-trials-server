let express = require("express");
let path = require("path");
let cookieParser = require("cookie-parser");
let bodyParser = require("body-parser");
let logger = require("morgan");
require("dotenv").config();
const fileUpload = require("express-fileupload");
const db = require("./config/dbConfig");
const db2 = require("./config/userDBConfig");
let wcs = require("./routes/wcs");
let apis = require("./routes/apis");
let adminApis = require("./routes/adminApis");
let userApis = require("./routes/userApis");
let cors = require("cors");
let cron = require("./cron");

cron();

let app = express();
//console.log(process.env);

// view engine setup
app.use(cors());
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");
app.use(fileUpload());
app.use(logger("dev"));
app.use(bodyParser.json({ limit: "40mb", extended: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/wcs", wcs);
app.use("/api", apis);
app.use("/admin/api", adminApis);
app.use("/admin/api/users", userApis);

app.use("/static", express.static(path.join(__dirname, "public")));

// error handler
app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader("Access-Control-Allow-Origin", "*");
  // Request methods you wish to allow
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  // Request headers you wish to allow
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, content-type, Accept, apiKey,Authorization, session_token"
  );
  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader("Access-Control-Allow-Credentials", false);
  // Pass to next layer of middleware
  next();
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  res.json({ status: 404, message: `NOT FOUND` });
  next();
});
// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
