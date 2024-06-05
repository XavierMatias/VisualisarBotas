import express from "express";
import cors from "cors";
import bcrypt from "bcrypt";
import { db_conn } from "./db.js";

const app = express();
app.use(express.json());
app.use(cors());

// Tabela login
app.get("/", (req, res) => {
    let sql = "SELECT * FROM login";
    db_conn.query(sql, (err, data) => {
        if (err) {
            console.error("Erro no servidor:", err);
            return res.json("Erro no servidor");
        }
        res.json(data);
    });
});

app.post("/veri", (req, res) => {
    const { email, password } = req.body;
    const check = 'SELECT * FROM login WHERE email = ? AND senha = ?';
    db_conn.query(check, [email, password], (err, results) => {
        if (err) {
            console.error("Erro ao consultar o banco de dados:", err);
            return res.status(500).json({ error: "Erro no servidor" });
        }
        
        if (results.length === 1) {
            res.json({ message: "Login bem-sucedido" });
        } else {
            res.status(401).json({ message: "Email ou senha incorretos" });
        }
    });
});

app.post("/cadastrar", (req, res) => {
    const { nome, email, senha } = req.body;
    let sql = `INSERT INTO login (nome, email, senha) VALUES (?, ?, ?)`;
    db_conn.query(sql, [nome, email, senha], (err, data) => {
        if (err) {
            console.error("Erro ao cadastrar:", err);
            return res.json("Erro ao cadastrar");
        }
        res.json("SUCESSO AO CADASTRAR");
    });
});

app.put("/atualizar/:id", (req, res) => {
    const { nome, email, senha } = req.body;
    const userId = req.params.id;
    let sql = `UPDATE login SET nome=?, email=?, senha=? WHERE id=?`;
    db_conn.query(sql, [nome, email, senha, userId], (err, data) => {
        if (err) {
            console.error("Erro ao atualizar usuário:", err);
            return res.json("Erro ao atualizar usuário");
        }
        res.json("Usuário atualizado com sucesso");
    });
});

app.delete("/deletar/:id", (req, res) => {
    const userId = req.params.id;
    let sql = `DELETE FROM login WHERE id=?`;
    db_conn.query(sql, [userId], (err, data) => {
        if (err) {
            console.error("Erro ao deletar usuário:", err);
            return res.json("Erro ao deletar usuário");
        }
        res.json("Usuário deletado com sucesso");
    });
});

app.post("/login", (req, res) => {
    const { email, senha } = req.body;
    let sql = `SELECT * FROM cadastrar WHERE email = ?`;
    db_conn.query(sql, [email], async (err, data) => {
        if (err) {
            console.error("Erro no servidor:", err);
            return res.status(500).json("Erro no servidor");
        }
        if (data.length > 0) {
            const user = data[0];
            console.log("Usuário encontrado:", user);
            const validPassword = await bcrypt.compare(senha, user.senha);
            if (validPassword) {
                res.json({ message: "Login bem-sucedido" });
            } else {
                console.log("Senha incorreta para o email:", email);
                res.status(401).json({ message: "Email ou senha incorretos" });
            }
        } else {
            console.log("Usuário não encontrado com o email:", email);
            res.status(401).json({ message: "Email ou senha incorretos" });
        }
    });
});

// CRUD para tabela categoria
app.get("/categorias", (req, res) => {
    let sql = "SELECT * FROM categoria";
    db_conn.query(sql, (err, data) => {
        if (err) {
            console.error("Erro no servidor:", err);
            return res.status(500).json("Erro no servidor");
        }
        res.json(data);
    });
});

app.post("/categorias", (req, res) => {
    const { nome_categoria, descricao } = req.body;
    let sql = `INSERT INTO categoria (nome_categoria, descricao) VALUES (?, ?)`;
    db_conn.query(sql, [nome_categoria, descricao], (err, data) => {
        if (err) {
            console.error("Erro ao cadastrar categoria:", err);
            return res.status(500).json("Erro ao cadastrar categoria");
        }
        res.json("Categoria cadastrada com sucesso");
    });
});

app.put("/categorias/:id", (req, res) => {
    // Desestrutura nome_categoria e descricao do corpo da requisição.
    const { nome_categoria, descricao } = req.body;
     // Obtém o id da categoria da URL da requisição.
    const categoriaId = req.params.id;
     // Define uma consulta SQL para atualizar a categoria com base no ID.
    let sql = `UPDATE categoria SET nome_categoria=?, descricao=? WHERE id=?`;
    // Executa a consulta SQL, substituindo os placeholders pelos valores recebidos.
    db_conn.query(sql, [nome_categoria, descricao, categoriaId], (err, data) => {
        if (err) {
            // Se ocorrer um erro, loga o erro e envia uma resposta HTTP 500 ao cliente
            console.error("Erro ao atualizar categoria:", err);
            return res.status(500).json("Erro ao atualizar categoria");
        }
        // Se a atualização for bem-sucedida, envia uma mensagem de sucesso como resposta JSON.
        res.json("Categoria atualizada com sucesso");
    });
});

app.delete("/categorias/:id", (req, res) => {
    const categoriaId = req.params.id;
    let sql = `DELETE FROM categoria WHERE id=?`;
    db_conn.query(sql, [categoriaId], (err, data) => {
        if (err) {
            console.error("Erro ao deletar categoria:", err);
            return res.status(500).json("Erro ao deletar categoria");
        }
        res.json("Categoria deletada com sucesso");
    });
});

// CRUD para tabela cor
app.get("/cores", (req, res) => {
    let sql = "SELECT * FROM cor";
    db_conn.query(sql, (err, data) => {
        if (err) {
            console.error("Erro no servidor:", err);
            return res.status(500).json("Erro no servidor");
        }
        res.json(data);
    });
});

app.post("/cores", (req, res) => {
    const { nome_cor } = req.body;
    let sql = `INSERT INTO cor (nome_cor) VALUES (?)`;
    db_conn.query(sql, [nome_cor], (err, data) => {
        if (err) {
            console.error("Erro ao cadastrar cor:", err);
            return res.status(500).json("Erro ao cadastrar cor");
        }
        res.json("Cor cadastrada com sucesso");
    });
});

app.put("/cores/:id", (req, res) => {
    const { nome_cor } = req.body;
    const corId = req.params.id;
    let sql = `UPDATE cor SET nome_cor=? WHERE id=?`;
    db_conn.query(sql, [nome_cor, corId], (err, data) => {
        if (err) {
            console.error("Erro ao atualizar cor:", err);
            return res.status(500).json("Erro ao atualizar cor");
        }
        res.json("Cor atualizada com sucesso");
    });
});

app.delete("/cores/:id", (req, res) => {
    const corId = req.params.id;
    let sql = `DELETE FROM cor WHERE id=?`;
    db_conn.query(sql, [corId], (err, data) => {
        if (err) {
            console.error("Erro ao deletar cor:", err);
            return res.status(500).json("Erro ao deletar cor");
        }
        res.json("Cor deletada com sucesso");
    });
});

// CRUD para tabela bota
app.get("/botas", (req, res) => {
    let sql = "SELECT * FROM bota";
    db_conn.query(sql, (err, data) => {
        if (err) {
            console.error("Erro no servidor:", err);
            return res.status(500).json("Erro no servidor");
        }
        res.json(data);
    });
});

app.post("/botas", (req, res) => {
    const { nome, id_categoria, id_cor, imagem_url } = req.body;
    let sql = `INSERT INTO bota (nome, id_categoria, id_cor, imagem_url) VALUES (?, ?, ?, ?)`;
    db_conn.query(sql, [nome, id_categoria, id_cor, imagem_url], (err, data) => {
        if (err) {
            console.error("Erro ao cadastrar bota:", err);
            return res.status(500).json("Erro ao cadastrar bota");
        }
        res.json("Bota cadastrada com sucesso");
    });
});

app.put("/botas/:id", (req, res) => {
    const { nome, id_categoria, id_cor, imagem_url } = req.body;
    const botaId = req.params.id;
    let sql = `UPDATE bota SET nome=?, id_categoria=?, id_cor=?, imagem_url=? WHERE id=?`;
    db_conn.query(sql, [nome, id_categoria, id_cor, imagem_url, botaId], (err, data) => {
        if (err) {
            console.error("Erro ao atualizar bota:", err);
            return res.status(500).json("Erro ao atualizar bota");
        }
        res.json("Bota atualizada com sucesso");
    });
});


app.delete("/botas/:id", (req, res) => {
    const botaId = req.params.id;
    let sql = `DELETE FROM bota WHERE id=?`;
    db_conn.query(sql, [botaId], (err, data) => {
        if (err) {
            console.error("Erro ao deletar bota:", err);
            return res.status(500).json("Erro ao deletar bota");
        }
        res.json("Bota deletada com sucesso");
    });
});

const PORT = process.env.PORT || 3333;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
