const db = require("./../db/db");

exports.getAllEnvs = (request, response) => {
  db.query("SELECT * FROM envelopes ORDER BY id ASC;", (error, results) => {
    if (error) {
      throw error;
    }
    response.json(results.rows);
  });
};

exports.createEnv = (request, response) => {
  const { name, budget } = request.body;
  db.query(
    "INSERT INTO envelopes (name, budget) VALUES ($1, $2) RETURNING *;",
    [name, budget],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.redirect("/api/v1/envelopes");
    }
  );
};

exports.getEnv = (request, response) => {
  const id = parseInt(request.params.id);
  db.query("SELECT * FROM envelopes WHERE id = $1", [id], (error, results) => {
    if (error) {
      throw error;
    }
    response.json(results.rows[0]);
  });
};

exports.updateEnv = (request, response) => {
  const id = parseInt(request.params.id);
  const { name, budget } = request.body;

  db.query(
    "UPDATE envelopes SET name = $1, budget = $2 WHERE id = $3 RETURNING *",
    [name, budget, id],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.json(results.rows[0]);
    }
  );
};

exports.deleteEnv = (request, response) => {
  const id = parseInt(request.params.id);
  db.query("DELETE FROM envelopes WHERE id = $1", [id], (error, results) => {
    if (error) {
      throw error;
    }
    response.redirect("/api/v1/envelopes");
  });
};
