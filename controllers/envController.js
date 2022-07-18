const { db } = require("../db/db");
const catchAsync = require("../config/catchAsync");

exports.getAllEnvs = catchAsync(async (request, response, next) => {
  const query = "SELECT * FROM envelopes ORDER BY id ASC;";

  const envelopes = await db.query(query);
  response.status(200).render("main", {
    status: "success",
    message: "retrieved envelope",
    data: envelopes.rows,
  });
});

exports.createEnv = catchAsync(async (request, response, next) => {
  const query =
    "INSERT INTO envelopes (name, budget) VALUES ($1, $2) RETURNING *;";
  const { name, budget } = request.body;

  const envelope = await db.query(query, [name, budget]);
  response.redirect("/envelopes");
});

exports.readCreatePage = catchAsync(async (req, res) => {
  await res.status(200).render("create");
});

exports.readTransactionPage = catchAsync(async (req, res) => {
  const query = "SELECT * FROM envelopes WHERE id = $1";
  const id = parseInt(req.params.id);

  const envelope = await db.query(query, [id]);
  res.status(200).render("transaction", {
    status: "success",
    message: "retrieved envelope",
    data: envelope.rows[0],
  });
});

exports.getEnv = catchAsync(async (request, response, next) => {
  const query = "SELECT * FROM envelopes WHERE id = $1";
  const transQuery = "SELECT * FROM transactions WHERE envelope_id = $1";
  const id = parseInt(request.params.id);

  const envelope = await db.query(query, [id]);
  const transactions = await db.query(transQuery, [id]);
  response.status(200).render("envelope", {
    status: "success",
    message: "retrieved envelope",
    data: envelope.rows[0],
    transdata: transactions.rows,
  });
});

exports.getEnvelopeTransactions = catchAsync(async (req, res, next) => {
  const query = "SELECT * FROM transactions WHERE envelope_id = $1";
  const { id } = req.params;

  const transactions = await db.query(query, [id]);
  if (transactions.rows < 1) {
    return res.status(404).send({
      message: "No envelope information found",
    });
  }
  res.status(200).send({
    status: "Success",
    message: "Transactions information retrieved",
    transdata: transactions.rows,
  });
});

exports.updatePage = catchAsync(async (req, res, next) => {
  const query = "SELECT * FROM envelopes WHERE id = $1";
  const id = parseInt(req.params.id);

  const envelope = await db.query(query, [id]);
  res.status(200).render("edit", {
    status: "success",
    message: "retrieved envelope",
    data: envelope.rows[0],
  });
});

exports.updateEnv = catchAsync(async (request, response, next) => {
  const query =
    "UPDATE envelopes SET name = $1, budget = $2 WHERE id = $3 RETURNING *";
  const id = parseInt(request.params.id);
  const { name, budget } = request.body;

  const envelope = await db.query(query, [name, budget, id]);
  response.redirect("/envelopes");
});

exports.deleteEnv = catchAsync(async (request, response, next) => {
  const transactionQuery = "DELETE FROM transactions WHERE envelope_id = $1";
  const query = "DELETE FROM envelopes WHERE id = $1";

  const id = parseInt(request.params.id);
  await db.query(transactionQuery, [id]);
  await db.query(query, [id]);
  response.redirect("/envelopes");
});

exports.createEnvTransaction = catchAsync(async (request, response, next) => {
  const { id } = request.params;
  const { title, amount } = request.body;
  const date = new Date();

  const transactionQuery =
    "INSERT INTO transactions (title, amount, date, envelope_id) VALUES ($1, $2, $3, $4) RETURNING *;";
  const updateEnvQuery =
    "UPDATE envelopes SET budget = budget - $1 WHERE id = $2 RETURNING *; ";

  await db.query("BEGIN");

  const newTransaction = await db.query(transactionQuery, [
    title,
    amount,
    date,
    id,
  ]);
  await db.query(updateEnvQuery, [amount, id]);
  await db.query("COMMIT");
  response.redirect(`/envelopes/${id}`);
});
