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
      [
        "Alice",
        "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e",
        100,
      ],
      [
        "Grace",
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d",
        40,
      ],
      [
        "Hannah",
        "https://images.unsplash.com/photo-1524504388940-b1c1722653e1",
        30,
      ],
      [
        "David",
        "https://images.unsplash.com/photo-1527980965255-d3b416303d12",
        65,
      ],
      [
        "Bob",
        "https://images.unsplash.com/photo-1502767089025-6572583495b0",
        85,
      ],
      [
        "Eve",
        "https://images.unsplash.com/photo-1531123897727-8f129e1688ce",
        55,
      ],
      ["Jack", "https://images.unsplash.com/photo-1544723795-3fb6469f5b39", 10],
      [
        "Frank",
        "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e",
        45,
      ],
      [
        "Isaac",
        "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91",
        20,
      ],
      [
        "Charlie",
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
        75,
      ],
    ];

    for (const user of users) {
      await pool.query(
        `INSERT INTO users (name, image_url, score) VALUES (?, ?, ?)`,
        user
      );
    }

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
