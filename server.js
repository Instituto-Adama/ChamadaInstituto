const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// Configuração do Banco de Dados
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// Rota para testar se a API está rodando
app.get("/", (req, res) => {
  res.send("API rodando no Railway!");
});

// Rota para buscar dados da tabela 'usuarios'
app.get("/usuarios", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM usuarios");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao buscar usuários" });
  }
});

// Rota para adicionar um usuário
app.post("/usuarios", async (req, res) => {
  const { nome, email } = req.body;
  try {
    await pool.query("INSERT INTO usuarios (nome, email) VALUES ($1, $2)", [nome, email]);
    res.status(201).json({ message: "Usuário adicionado com sucesso!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao adicionar usuário" });
  }
});

// Definindo a porta do servidor
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`🚀 Servidor rodando na porta ${port}`);
});
