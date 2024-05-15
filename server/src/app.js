import express from "express"
import cors from "cors"
import { db_conn } from "./db.js"
const app = express()
app.use(express.json())
app.use(cors())


app.get("/",(req, res)=>{
    let sql = "SELECT * FROM login"
    db_conn.query(sql,(err, data)=>{
        if(err) return res.json("Erro no servidor")
            res.json(data)
    })
})

app.post("/cadastrar",(req, res)=>{
    const {nome, senha, email} = req.body
    let sql = `insert into login values (default, '${nome}', '${email}', '${senha}')`
    db_conn.query(sql,(err, data)=>{
        if(err) return res.json("Erro ao cadastrar")
            res.json("SUCESSO AO CADASTRAR")
    })
})

app.put("/atualizar/:id", (req, res) => {
    const { nome, senha, email } = req.body;
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

// Rota para deletar um usuário
app.delete("/deletar/:id", (req, res) => {
    const userId = req.params.id;
    let sql = `DELETE FROM login WHERE id=${userId}`;
    db_conn.query(sql, (err, data) => {
        if (err) return res.json("Erro ao deletar usuário");
        res.json("Usuário deletado com sucesso");
    });
});


app.listen(3333,console.log("Server is running on http://localhost:3333"))