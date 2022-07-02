const express = require("express");
const envRouter = require("./routes/envelopeRouter");
const transactionRouter = require("./routes/transactionRouter");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./openapi.json");
var path = require("path");
const morgan = require("morgan");
const bodyParser = require("body-parser");

const app = express();
app.use(express.json());
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(express.urlencoded({ extended: true }));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.static(__dirname));
app.use("/envelopes", envRouter);
app.use("/transactions", transactionRouter);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log("App running...");
});
