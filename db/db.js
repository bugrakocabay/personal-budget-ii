const Pool = require("pg").Pool;

let config;
if (process.env.NODE_ENV === "production") {
  config = {
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  };
} else {
  config = {
    user: "postgres",
    host: "localhost",
    database: "postgres",
    password: "postgres",
    port: 5433,
  };
}

const pool = new Pool(config);

module.exports = {
  query: (text, params, callback) => {
    const start = Date.now();
    return pool.query(text, params, (err, res) => {
      const duration = Date.now() - start;
      console.log("executed query", { text, duration, rows: res.rowCount });
      callback(err, res);
    });
  },
};
