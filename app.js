const express = require("express");
const envRouter = require("./routes/envelopeRouter");
const transactionRouter = require("./routes/transactionRouter");
const authRouter = require("./routes/authRouter");
const errorController = require("./controllers/errorController");
const AppError = require("./config/appError");
const path = require("path");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const app = express();
const session = require("express-session");
const flash = require("express-flash");
const passport = require("passport");
const initializePassport = require("./config/passport");
const { db } = require("./db/db");
const pgSession = require("connect-pg-simple")(session);
const cors = require("cors");

/// **** MIDDLEWARES ****
initializePassport(passport);
app.use(express.json());
app.use(morgan("dev"));
app.use(flash());
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(__dirname));
app.use(express.urlencoded({ extended: true }));
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(
  session({
    store: new pgSession({
      pool: db,
      tableName: "session",
    }),
    secret: "asdfqwerty",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 },
  })
);

app.use(passport.initialize());
app.use(passport.session());

/// **** CONFIG ****
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

/// **** ROUTE HANDLERS ****
app.get("/", (req, res) => res.redirect("/user/login"));
app.use("/user", authRouter);
app.use("/envelopes", envRouter);
app.use("/transactions", transactionRouter);
app.all("*", (req, res, next) => {
  next(new AppError(`${req.originalUrl} bu sunucuda bulunmuyor :S`, 404));
});
app.use(errorController);

/// **** SERVER ****
const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log("App running...");
});
