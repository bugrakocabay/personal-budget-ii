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

const db = new Pool(config);

module.exports = { db };
