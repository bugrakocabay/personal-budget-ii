const express = require("express");
const envRouter = require("./routes/envelopeRouter");
const transactionRouter = require("./routes/transactionRouter");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./openapi.json");

const app = express();
app.use(express.json());

app.use("/api/v1/envelopes", envRouter);
app.use("/api/v1/transactions", transactionRouter);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(4000, () => {
  console.log("App running on port 4000!");
});
