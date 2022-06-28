const { db } = require("./../db/db");

exports.getTransactions = async (request, response) => {
  const query = "SELECT * FROM transactions ORDER BY id ASC;";

  try {
    const transactions = await db.query(query);
    response.status(200).send({
      status: "success",
      message: "retrieved transactions",
      data: transactions.rows,
    });
  } catch (error) {
    return response.status(500).send({
      error: error.message,
    });
  }
};

exports.getTransactionById = async (request, response) => {
  const { id } = request.params;
  const query = "SELECT * FROM transactions WHERE id = $1;";

  try {
    const transaction = await db.query(query, [id]);

    response.status(200).send({
      status: "success",
      message: "retrieved transaction",
      data: transaction.rows[0],
    });
  } catch (error) {
    return response.status(500).send({
      error: error.message,
    });
  }
};

exports.updateTransaction = async (request, response) => {
  const { id } = request.params;
  const { title, amount } = request.body;

  const transactionQuery = "SELECT * FROM transactions WHERE id = $1";
  const prevAmountQuery = "SELECT amount FROM transactions WHERE id = $1";
  const updateTransactionQuery =
    "UPDATE transactions SET title = $1, amount = $2 WHERE id = $3 RETURNING *";
  const updateEnvBudgetQuery = `UPDATE
		envelopes
	SET
		budget = (budget + $1) - $2
	WHERE
		id IN (SELECT envelope_id FROM transactions WHERE id=$3)`;

  try {
    // SQL TRANSACTION
    await db.query("BEGIN");
    const transaction = await db.query(transactionQuery, [id]);
    if (transaction.rowCount < 1) {
      return response.status(404).send({
        message: "No transaction information found",
      });
    }
    const prevAmount = await db.query(prevAmountQuery, [id]);
    await db.query(updateEnvBudgetQuery, [
      prevAmount.rows[0].amount,
      amount,
      id,
    ]);

    const updatedTransaction = await db.query(updateTransactionQuery, [
      title,
      amount,
      id,
    ]);
    await db.query("COMMIT");
    response.status(201).send({
      status: "Success",
      message: "Transaction has been updated",
      data: updatedTransaction.rows[0],
    });
  } catch (err) {
    await db.query("ROLLBACK");
    return response.status(500).send({
      error: err.message,
    });
  }
};

exports.deleteTransaction = async (request, response) => {
  const { id } = request.params;
  const updateEnvBudgetQuery = `UPDATE
		envelopes
	SET
		budget = budget + $1
	WHERE
		id IN (SELECT envelope_id FROM transactions WHERE id=$2)`;
  const transactionQuery = "SELECT * FROM transactions WHERE id=$1";
  const transactionAmountQuery =
    "SELECT amount FROM transactions WHERE id = $1;";
  const deleteTransaction = "DELETE FROM transactions WHERE id=$1";

  try {
    // SQL TRANSACTION
    await db.query("BEGIN");
    const transaction = await db.query(transactionQuery, [id]);
    if (transaction.rowCount < 1) {
      return response.status(404).send({
        message: "No transaction information found",
      });
    }
    const transactionAmount = await db.query(transactionAmountQuery, [id]);
    await db.query(updateEnvBudgetQuery, [
      transactionAmount.rows[0].amount,
      id,
    ]);
    await db.query(deleteTransaction, [id]);
    await db.query("COMMIT");
    response.sendStatus(204);
  } catch (err) {
    await db.query("ROLLBACK");
    return response.status(500).send({
      error: err.message,
    });
  }
};
