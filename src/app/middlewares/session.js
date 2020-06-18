const UsersModel = require("../models/UsersModel")

module.exports = {
    ifLogged(req, res, next) {
        if (req.session.userId) return res.redirect("/admin")
        next()
    },
    async onlyUsers(req, res, next) {
        const {userId} = req.session
        if (!userId) return res.render("session/login", {error: "Faça login para continuar."})
        const user = await UsersModel.getOne(userId)
        user.is_admin ? req.session.isAdmin = true : req.session.isAdmin = false
        next()
    },
    async onlyAdmins(req, res, next) {
        if (req.session.isAdmin == false) {
            const user = await UsersModel.getOne(req.session.userId)
            return res.render("admin/profile/index", {user, error: "Esta página só pode ser acessada por administradores."})
        }
        next()
    }
}