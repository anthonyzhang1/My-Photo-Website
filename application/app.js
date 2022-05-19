const createError = require("http-errors");
const express = require("express");
require('dotenv').config({ path: './config.env' });
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
var sessions = require('express-session');
var mysqlSession = require('express-mysql-session')(sessions);
var flash = require('express-flash');
const handlebars = require("express-handlebars");

const {requestPrint} = require("./helpers/debug/debugprinters");
const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const postsRouter = require("./routes/posts");
const commentRouter = require('./routes/comments');
const cors = require('cors');
const app = express();

app.engine(
  "hbs",
  handlebars({
    layoutsDir: path.join(__dirname, "views/layouts"), // where to look for layouts
    partialsDir: path.join(__dirname, "views/partials"), // where to look for partials
    extname: ".hbs", // expected file extension for handlebars files
    defaultLayout: "layout", // default layout for app, general template for all pages in app

    helpers: { // add new helpers to handlebars for extra functionality
      /** Returns true if obj is not empty. */
      isNotEmptyObject: (obj) => {
        return !(obj.constructor === Object && Object.keys(obj).length === 0);
      }
    },
  })
);

var mysqlSessionStore = new mysqlSession({}, require("./config/database"));

app.use(sessions({
  key: "csid",
  secret: "secret",
  store: mysqlSessionStore,
  resave: false,
  saveUninitialized: false
}));

app.use(flash());

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

app.use(logger("dev"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/public", express.static(path.join(__dirname, "public")));

app.use((req, _, next) => {
  requestPrint(req.url);
  next();
});

app.use((req, res, next) => {
  if (req.session.username) res.locals.logged = true;
  next();
});

app.use("/", indexRouter); // route middleware from ./routes/index.js
app.use("/users", usersRouter); // route middleware from ./routes/users.js
app.use("/posts", postsRouter); // route middleware from ./routes/index.js
app.use("/comments", commentRouter); // route middleware from ./routes/comments.js

/* Catch all route, if we get to here then the resource requested could not be found. */
app.use((req, _, next) => { next(createError(404, `The route ${req.method}: ${req.url} does not exist.`)); });
  
/* Error Handler, used to render the error html file with relevant error information. */
app.use(function (err, _, res, _) {
  console.log(err);

  res.locals.message = err.message;
  res.locals.error = err;
  res.status(err.status || 500);
  res.render("error", { title: "Error " + err.status }); // render the error page
});

module.exports = app;