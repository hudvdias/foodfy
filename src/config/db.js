const {Pool} = require("pg")

module.exports = new Pool({
    user: "", // INSERIR SEU USUÁRIO DO POSTGRE
    password: "", // INSERIR A SUA SENHA DO POSTGRE
    host: "localhost",
    port: 5432,
    database: "foodfy"
})