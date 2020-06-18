const crypto = require("crypto")
const fs = require("fs")
const {hash} = require("bcryptjs")
const UsersModel = require("../models/UsersModel")
const RecipesModel = require("../models/RecipesModel")
const FilesModel = require("../models/FilesModel")
const mailer = require("../../config/mailer")

async function getUsers(id) {
    let users = await UsersModel.getAll()
    users = users.filter(user => user.id == id ? false : true)
    return users
}

module.exports = {
    async index (req, res) {
        try {   
            let users = await getUsers(req.session.userId)
            return res.render("admin/users/index", {users})
        } catch (error) {
            console.log(error)
            return res.send("Ocorreu um erro ao carregar a página. Verifique o console e tente novamente.")
        }
    },
    create(req, res) {
        try {   
            return res.render("admin/users/create")
        } catch (error) {
            console.log(error)
            return res.send("Ocorreu um erro ao carregar a página. Verifique o console e tente novamente.")
        }
    },
    async edit(req, res) {
        try {   
            const {id} = req.params
            const {userId} = req.session
            if (id == userId) {
                const user = await UsersModel.getOne(userId)
                return res.render("admin/profile/index", {user, error:"Para editar seu usuário, utilize esta página."})
            }
            const user = await UsersModel.getOne(id)
            return res.render("admin/users/edit", {user})
        } catch (error) {
            console.log(error)
            const users = await getUsers(req.session.userId)
            return res.render("admin/profile/index", {users, error: "Ocorreu um erro ao carregar a página. Verifique o console e tente novamente."})
        }
    },
    async post(req, res) {
        try {   
            const data = req.body
            data.is_admin == "on" ? data.is_admin = true : data.is_admin = false
            const password = crypto.randomBytes(3).toString("hex")
            data.password = await hash(password, 4)
            await UsersModel.create(data)
            await mailer.sendMail({
                to: data.email,
                from: "no-reply@foodfy.com",
                subject: "Bem vindo ao Foodfy!",
                html: `<h1>Bem Vindo, ${data.name}!</h1>
                    <h3>Esta é a sua senha para acessar o site: ${password}</h3>
                    <p>atenciosamente,</p>
                    <strong>Equipe Foodfy ❤</strong>`
            })
            const users = await getUsers(req.session.userId)
            return res.render("admin/users/index", {users, success: "Conta criada com sucesso. A senha de acesso foi enviada para o email cadastrado."})
        } catch (error) {
            console.log(error)
            const user = req.body
            return res.render("admin/users/create", {user, error: "Ocorreu um erro ao criar um usuário. Verifique o console e tente novamente."})
        }
    },
    async put(req, res) {
        try {   
            const data = req.body
            data.is_admin == "on" ? data.is_admin = true : data.is_admin = false
            await UsersModel.update(data)
            const users = await getUsers(req.session.userId)
            return res.render("admin/users/index", {users, success: "Usuário editado com sucesso."})
        } catch (error) {
            console.log(error)
            const user = await UsersModel.getOne(req.body.id)
            return res.render("admin/users/edit", {user, error: "Ocorreu um erro ao editar o usuário. Verifique o console e tente novamente."})
        }
    },
    async delete(req, res) {
        try {   
            const {id} = req.body
            const recipes = await RecipesModel.getByUser(id)
            const deleteRecipesPromise = recipes.map(async recipe => {
                const links = await FilesModel.getLinks(recipe.id)
                const filesPromise = links.map(link => FilesModel.getOne(link.file_id))
                const files = await Promise.all(filesPromise)
                try {
                    files.forEach(file => fs.unlinkSync(file.path))
                } catch (error) {
                    console.error(error)
                }
                const deleteFilesPromise = links.map(link => FilesModel.delete(link.file_id))
                await Promise.all(deleteFilesPromise)
            })
            await Promise.all(deleteRecipesPromise)
            await UsersModel.delete(id)
            const users = await getUsers(req.session.userId)
            return res.render("admin/users/index", {users, success: "Usuário deletado com sucesso."})
        } catch (error) {
            console.log(error)
            const user = await UsersModel.getOne(req.body.id)
            return res.render("admin/users/edit", {user, error: "Ocorreu um erro ao deletar o usuário. Verifique o console e tente novamente."})
        }
    }
}