
var express = require("express");

var cookieParser = require("cookie-parser");
var logger = require("morgan");
const cors = require("cors");

var indexRouter = require("./routes/index");
var app = express();

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
require("dotenv").config();
require("./schemas/db");
console.log("Booting...");
app.use("/api", indexRouter);

// run server
var port = process.env.Backend_PORT;
const server = app.listen(port || 8000, function () {
  var port = server.address().port;
  console.log("server listening at port %s\n", port);
});

module.exports = app;
