const nodemailer = require("nodemailer")

module.exports = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
        user: "", // INSERIR SEU USUÁRIO DO MAILTRAP
        pass: "" // INSERIR SUA SENHA DO MAILTRAP
    }
})