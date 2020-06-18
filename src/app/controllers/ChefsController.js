const ChefsModel = require("../models/ChefsModel")
const FilesModel = require("../models/FilesModel")
const Services = require("../services/Services")
const fs = require("fs")

module.exports = {
    async index(req, res) {
        try {
            const chefs = await Services.getAllChefs()
            return res.render("admin/chefs/index", {chefs})
        } catch (error) {
            console.error(error)
            return res.send("Ocorreu um erro ao carregar a página. Verifique o console e tente novamente.")
        }
    },
    create(req, res) {
        try {
            return res.render("admin/chefs/create")
        } catch (error) {
            console.error(error)
            return res.send("Ocorreu um erro ao carregar a página. Verifique o console e tente novamente.")
        }
    },
    async show(req, res) {
        try {
            let chef = await Services.getOneChef(req.params.id)
            if (!chef) {
                const chefs = await Services.getAllChefs()
                return res.render("admin/chefs/index", {chefs, error: "Chef não encontrado."})
            }
            return res.render("admin/chefs/show", {chef})
        } catch (error) {
            console.error(error)
            const chefs = await Services.getAllChefs()
            return res.render("admin/chefs/index", {chefs, error:"Ocorreu um erro ao carregar a página. Verifique o console e tente novamente."})
        }
    },
    async edit(req, res) {
        try {
            let chef = await Services.getOneChef(req.params.id)
            if (!chef) {
                const chefs = await Services.getAllChefs()
                return res.render("admin/chefs/index", {chefs, error: "Chef não encontrado."})
            }
            return res.render("admin/chefs/edit", {chef})
        } catch (error) {
            console.error(error)
            const chefs = await Services.getAllChefs()
            return res.render("admin/chefs/index", {chefs, error:"Ocorreu um erro ao carregar a página. Verifique o console e tente novamente."})
        }
    },
    async post(req, res) {
        try {
            const data = req.body
            const {file} = req
            const file_id = await FilesModel.create(file)
            await ChefsModel.create({...data, file_id})
            const chefs = await Services.getAllChefs()
            return res.render("admin/chefs/index", {chefs, success: "Chef criado com sucesso!"})
        } catch (error) {
            console.error(error)
            const chef = req.body
            return res.render("admin/chefs/create", {chef, error: "Ocorreu um erro ao criar o chef. Verifique o console e tente novamente."})
        }
    },
    async put(req, res) {
        try {
            const data = req.body
            const {file} = req
            const oldData = await ChefsModel.getOne(data.id)
            let file_id = oldData.file_id
            if (file) {
                file_id = await FilesModel.create(file)
                await ChefsModel.update({...data, file_id})
                const oldFile = await FilesModel.getOne(oldData.file_id)
                fs.unlinkSync(oldFile.path)
                await FilesModel.delete(oldData.file_id)
            } else {
                await ChefsModel.update({...data, file_id})
            }
            const chefs = await Services.getAllChefs()
            return res.render("admin/chefs/index", {chefs, success: "Chef editado com sucesso."})
        } catch (error) {
            console.error(error)
            let chef = await Services.getOneChef(req.body.id)
            res.render("admin/chefs/edit" , {chef, error: "Ocorreu um erro ao editar o chef. Verifique o console e tente novamente."})
        }
    },
    async delete(req, res) {
        try {
            let chef = await Services.getOneChef(req.body.id)
            if (chef.recipes.length > 0) {
                return res.render("admin/chefs/edit", {chef, error: "Não é possível deletar um Chef que possui receitas."})
            }
            await ChefsModel.delete(req.body.id)
            const file = await FilesModel.getOne(chef.file_id)
            try {
                fs.unlinkSync(file.path)
            } catch (error) {
                console.error(error)
            }
            await FilesModel.delete(chef.file_id)
            const chefs = await Services.getAllChefs()
            return res.render("admin/chefs/index", {chefs, success: "Chef deletado com sucesso."})
        } catch (error) {
            console.error(error)
            let chef = await Services.getOneChef(req.body.id)
            res.render("admin/chefs/edit" , {chef, error:"Ocorreu um erro ao deletar o chef. Verifique o console e tente novamente."})
        }
    }
}