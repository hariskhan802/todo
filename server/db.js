const { Pool } = require('pg');

const connectionString = process.env.DATABASE_URL;

const pool = new Pool({ connectionString });

pool.connect()
  .then(() => console.log("✅ Connected to PostgreSQL successfully"))
  .catch(err => console.error("❌ Database connection failed:", err.stack));

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool,
};
