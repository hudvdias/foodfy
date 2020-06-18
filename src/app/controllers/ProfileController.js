const {hash} = require("bcryptjs")
const UsersModel = require("../models/UsersModel")

module.exports = {
    async index(req, res) {
        try {
            const user = await UsersModel.getOne(req.session.userId)
            return res.render("admin/profile/index", {user})
        } catch (error) {
            console.log(error)
            return res.send("Ocorreu um erro ao carregar a página. Verifique o console e tente novamente.")
        }
    },
    async put(req, res) {
        try {
            const data = req.body
            let user = await UsersModel.getOne(data.id)
            const passwordValidate = await compare(data.password, user.password)
            if (!passwordValidate) return res.render("admin/profile/index", {user, error: "Senha incorreta."})
            data.is_admin = user.is_admin
            await UsersModel.update(data)
            user = await UsersModel.getOne(data.id)
            return res.render("admin/profile/index", {user, success: "Usuário alterado com sucesso."})
        } catch (error) {
            console.log(error)
            const user = await UsersModel.getOne(req.session.userId)
            return res.render("admin/profile/index", {user, error: "Ocorreu um erro ao editar o usuário. Verifique o console e tente novamente."})
        }
    },
}