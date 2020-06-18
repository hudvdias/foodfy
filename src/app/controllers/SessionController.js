const crypto = require("crypto")
const {compare} = require("bcryptjs")
const UsersModel = require("../models/UsersModel")
const mailer = require("../../config/mailer")

module.exports = {
    index(req, res) {
        try {
            return res.render("session/login")
        } catch (error) {
            console.log(error)
            return res.send("Ocorreu um erro ao carregar a página. Verifique o console e tente novamente.")
        }
    },
    forgotPassword(req, res) {
        try {
            return res.render("session/forgot-password")
        } catch (error) {
            console.log(error)
            return res.send("Ocorreu um erro ao carregar a página. Verifique o console e tente novamente.")
        }
    },
    resetPassword(req, res) {
        try {   
            const {token} = req.query
            return res.render("session/reset-password", {token})
        } catch (error) {
            console.log(error)
            return res.send("Ocorreu um erro ao carregar a página. Verifique o console e tente novamente.")
        }
    },
    async login(req, res) {
        try {   
            const {email, password} = req.body
            const user = await UsersModel.getOneByEmail(email)
            if (!user) return res.render("session/login", {error: "Usuário não encontrado.", email})
            const passwordValidate = await compare(password, user.password)
            if (!passwordValidate) return res.render("session/login", {error: "Senha incorreta.", email})
            req.session.userId = user.id
            return res.redirect("/admin")
        } catch (error) {
            console.log(error)
            return res.render("session/login", {error: "Ocorreu um erro ao fazer o login. Verifique o console e tente novamente.", email})
        }
    },
    logout(req, res) {
        try {   
            req.session.destroy()
            return res.redirect("/login")
        } catch (error) {
            console.log(error)
            return res.send("Ocorreu um erro ao sair da conta. Verifique o console e tente novamente.")
        }
    },
    async forgot(req, res) {
        try {   
            const {email} = req.body
            const user = await UsersModel.getOneByEmail(email)
            if (!user) return res.render("session/forgot-password", {email, error:"Usuário não cadastrado."})
            const token = crypto.randomBytes(8).toString("hex")
            let expire = new Date()
            expire = expire.setHours(expire.getHours() + 1)
            await UsersModel.setToken(user.id, token, expire)
            await mailer.sendMail({
                to: user.email,
                from: "no-reply@foodfy.com",
                subject: "Recuperação de Senha",
                html: `<h1>${user.name},</h1>
                    <h3>Parece que você solicitou a redefinição da sua senha.</h3>
                    <p>Se não foi você, por favor, desconsidere o e-mail.</p>
                    <p>Caso sim, acesse o link abaixo para redefinir a sua senha.</p>
                    <a href="http://localhost:3000/reset-password?token=${token}" target="_blank">REDEFINIR SENHA</a>
                    <p>atenciosamente,</p>
                    <strong>Equipe Foodfy ❤</strong>`
            })
            return res.render("session/login", {success: "O link para redefinir a sua senha foi enviado para o e-mail cadastrado."})
        } catch (error) {
            console.log(error)
            return res.render("session/forgot-password", {error: "Ocorreu um erro no processo de redefinição de senha. Verifique o console e tente novamente."})
        }
    },
    async reset(req, res) {
        try {   
            const {email, password, confirmPassword, token} = req.body
            const user = await UsersModel.getOneByEmail(email)
            if (!user) return res.render("session/reset-password", {email, token, error: "Usuário não cadastrado."})
            if (password != confirmPassword) return res.render("session/reset-password", {email, token, error: "Os campos de senha devem ser iguais."})
            if (token != user.reset_token) return res.render("session/reset-password", {email, token, error: "Token inválido."})
            let now = new Date()
            now = now.setHours(now.getHours())
            if (now > user.reset_token_expires) return res.render("session/reset-password", {email, token, error:"Token expirado. Solicite uma nova redefinição de senha."})
            await UsersModel.updatePassword(user.id, password)
            return res.render("session/login", {success: "Senha alterada com sucesso."})
        } catch (error) {
            console.log(error)
            return res.render("session/reset-password", {error: "Ocorreu um erro ao mudar a senha. Verifique o console e tente novamente."})
        }
    }
}