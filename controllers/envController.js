const { db } = require("../db/db");

exports.getAllEnvs = async (request, response) => {
  const query = "SELECT * FROM envelopes ORDER BY id ASC;";

  try {
    const envelopes = await db.query(query);
    response.status(200).send({
      status: "success",
      message: "retrieved envelopes",
      data: envelopes.rows,
    });
  } catch (error) {
    return response.status(500).send({
      error: error.message,
    });
  }
};

exports.createEnv = async (request, response) => {
  const query =
    "INSERT INTO envelopes (name, budget) VALUES ($1, $2) RETURNING *;";
  const { name, budget } = request.body;
  try {
    const envelope = await db.query(query, [name, budget]);
    response.status(201).send({
      status: "success",
      message: "new envelope created!",
      data: envelope.rows,
    });
  } catch (error) {
    return response.status(500).send({
      error: error.message,
    });
  }
};

exports.getEnv = async (request, response) => {
  const query = "SELECT * FROM envelopes WHERE id = $1";
  const id = parseInt(request.params.id);
  try {
    const envelope = await db.query(query, [id]);
    response.status(200).send({
      status: "success",
      message: "retrieved envelope",
      data: envelope.rows[0],
    });
  } catch (error) {
    return response.status(500).send({
      error: error.message,
    });
  }
};

exports.updateEnv = async (request, response) => {
  const query =
    "UPDATE envelopes SET name = $1, budget = $2 WHERE id = $3 RETURNING *";
  const id = parseInt(request.params.id);
  const { name, budget } = request.body;

  const envelope = await db.query(query, [name, budget, id]);
  response.status(200).send({
    status: "success",
    message: "updated envelope",
    data: envelope.rows[0],
  });
};

exports.deleteEnv = async (request, response) => {
  const query = "DELETE FROM envelopes WHERE id = $1";
  const id = parseInt(request.params.id);
  await db.query(query, [id]);
  response.status(200).send({
    status: "success",
    message: "deleted envelope",
  });
};

exports.createEnvTransaction = async (request, response) => {
  const { id } = request.params;
  const { title, amount } = request.body;
  const date = new Date();

  const transactionQuery =
    "INSERT INTO transactions (title, amount, date, envelope_id) VALUES ($1, $2, $3, $4) RETURNING *;";
  const updateEnvQuery =
    "UPDATE envelopes SET budget = budget - $1 WHERE id = $2 RETURNING *; ";

  try {
    await db.query("BEGIN");

    const newTransaction = await db.query(transactionQuery, [
      title,
      amount,
      date,
      id,
    ]);
    await db.query(updateEnvQuery, [amount, id]);
    await db.query("COMMIT");
    response.status(201).send({
      status: "success",
      message: "created transaction",
      data: newTransaction.rows[0],
    });
  } catch (error) {
    await db.query("ROLLBACK");
    return response.status(500).send({
      error: error.message,
    });
  }
};

exports.getEnvelopeTransactions = async (req, res) => {
  const query = "SELECT * FROM transactions WHERE envelope_id = $1";
  const { id } = req.params;

  try {
    const transactions = await db.query(query, [id]);
    if (transactions.rows < 1) {
      return res.status(404).send({
        message: "No envelope information found",
      });
    }
    res.status(200).send({
      status: "Success",
      message: "Transactions information retrieved",
      data: transactions.rows,
    });
  } catch (err) {
    res.status(500).send({
      error: err.message,
    });
  }
};
