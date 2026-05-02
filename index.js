const express = require("express");
const { Pool } = require("pg");
require("dotenv").config();

const app = express();
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

// INSERT
app.post("/guardar", async (req, res) => {
  const { nombre, descripcion } = req.body;

  try {
    const result = await pool.query(
      "INSERT INTO registros(nombre, descripcion) VALUES($1, $2) RETURNING *",
      [nombre, descripcion]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// SELECT
app.get("/registros", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM registros");
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log("Servidor corriendo en puerto", PORT);
});