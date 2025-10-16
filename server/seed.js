require("dotenv").config();
const mysql = require("mysql2/promise");

async function seed() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
    });

    await connection.query(
      `CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`
    );
    console.log(`✅ Database '${process.env.DB_NAME}' ensured.`);
    await connection.end();

    const pool = await mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });

    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        image_url VARCHAR(255),
        score INT DEFAULT 0
      )
    `);

    await pool.query(`TRUNCATE TABLE users`);

    const users = [
      ["Alice", "https://example.com/alice.png", 100],
      ["Bob", "https://example.com/bob.png", 50],
      ["Charlie", "https://example.com/charlie.png", 75],
      ["David", "https://example.com/david.png", 25],
      ["Eve", "https://example.com/eve.png", 0],
    ];

    for (const user of users) {
      await pool.query(
        `INSERT INTO users (name, image_url, score) VALUES (?, ?, ?)`,
        user
      );
    }

    // בדיקה אם אינדקס כבר קיים
    const [indexRows] = await pool.query(
      `
  SELECT COUNT(1) AS idxExists
  FROM INFORMATION_SCHEMA.STATISTICS
  WHERE table_schema = ? AND table_name = 'users' AND index_name = 'idx_score'
`,
      [process.env.DB_NAME]
    );

    if (indexRows[0].idxExists === 0) {
      await pool.query(`CREATE INDEX idx_score ON users(score)`);
    }

    console.log("✅ Seed completed successfully!");
    await pool.end();
  } catch (err) {
    console.error("❌ Seed failed:", err.message);
  }
}

seed();
