const db = require("../db");

exports.addUser = async (req, res) => {
  const { name, image_url, score } = req.body;
  try {
    const [result] = await db.query(
      "INSERT INTO users (name, image_url, score) VALUES (?, ?, ?)",
      [name, image_url, score]
    );
    res.json({ message: "User added", userId: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateScore = async (req, res) => {
  const { id } = req.params;
  const { score } = req.body;
  try {
    await db.query("UPDATE users SET score = ? WHERE id = ?", [score, id]);
    res.json({ message: "Score updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getTopUsers = async (req, res) => {
  try {
    const top = parseInt(req.query.top) || 10;
    const [rows] = await db.query(
      `SELECT 
          id,
          name,
          image_url,
          score,
          DENSE_RANK() OVER (ORDER BY score DESC) AS position
      FROM users
      LIMIT ?
      `,
      [top]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getLowestUsers = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 2;

    const [rows] = await db.query(
      `SELECT 
          id,
          name,
          image_url,
          score,
          DENSE_RANK() OVER (ORDER BY score ASC) AS position
        FROM users
        LIMIT ?`,
      [limit]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getUserRank = async (req, res) => {
  const userId = req.params.id;
  try {
    const [[user]] = await db.query(
      "SELECT id, name, image_url, score FROM users WHERE id = ?",
      [userId]
    );
    if (!user) return res.status(404).json({ error: "User not found" });

    const [[{ rank }]] = await db.query(
      "SELECT COUNT(*) + 1 AS rank FROM users WHERE score > ?",
      [user.score]
    );

    const [above] = await db.query(
      "SELECT id, name, image_url, score FROM users WHERE score > ? ORDER BY score ASC LIMIT 5",
      [user.score]
    );
    const aboveReversed = above.reverse();

    const [below] = await db.query(
      "SELECT id, name, image_url, score FROM users WHERE score < ? ORDER BY score DESC LIMIT 5",
      [user.score]
    );

    const neighbors = [...aboveReversed, user, ...below];

    res.json({ rank, user, neighbors });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
