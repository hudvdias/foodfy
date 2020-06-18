const RecipesModel = require("../models/RecipesModel")
const ChefsModel = require("../models/ChefsModel")
const FilesModel = require("../models/FilesModel")
const Services = require("../services/Services")
const fs = require("fs")



module.exports = {
    async index(req, res) {
        try {
            const recipes = await Services.getRecipes(req.session)
            return res.render("admin/recipes/index", {recipes})
        } catch (error) {
            console.error(error)
            return res.send("Ocorreu um erro ao carregar a página. Verifique o console e tente novamente.")
        }
    },
    async create(req, res) {
        try {
            const chefs = await ChefsModel.getAll()
            return res.render("admin/recipes/create", {chefs})
        } catch (error) {
            console.error(error)
            return res.send("Ocorreu um erro ao carregar a página. Verifique o console e tente novamente.")
        }
    },
    async show(req, res) {
        try {
            let recipe = await Services.getOneRecipe(req.params.id)
            if (!recipe) {
                const recipes = await Services.getRecipes(req.session)
                return res.render("admin/recipes/index", {recipes, error: "Receita não encontrada."})
            }
            return res.render("admin/recipes/show", {recipe})
        } catch (error) {
            console.error(error)
            const recipes = await Services.getRecipes(req.session)
            return res.render("admin/recipes/index", {recipes, error: "Ocorreu um erro ao carregar a página. Verifique o console e tente novamente."})
        }
    },
    async edit(req, res) {
        try {
            const {userId, isAdmin} = req.session
            let recipe = await Services.getOneRecipe(req.params.id)
            if (!recipe) {
                const recipes = await Services.getRecipes(req.session)
                return res.render("admin/recipes/index", {recipes, error: "Receita não encontrada."})
            }
            if (isAdmin == false && recipe.user_id != userId) {
                const recipe = await Services.getOneRecipe(req.params.id)
                return res.render("admin/recipes/show", {recipe, error: "Você não pode editar essa receita."})
            }
            const chefs = await ChefsModel.getAll()
            return res.render("admin/recipes/edit", {recipe, chefs})
        } catch (error) {
            console.error(error)
            const recipes = await Services.getRecipes(req.session)
            return res.render("admin/recipes/index", {recipes, error: "Ocorreu um erro ao carregar a página. Verifique o console e tente novamente."})
        }
    },
    async post(req, res) {
        try {
            const data = req.body
            data.user_id = req.session.userId
            data.ingredients = data.ingredients.filter(ingredient => ingredient == "" ? false : true)
            data.preparation = data.preparation.filter(step => step == "" ? false : true)
            const {files} = req
            const filesPromise = files.map(file => FilesModel.create(file))
            const filesIds = await Promise.all(filesPromise)
            const recipeId = await RecipesModel.create(data)
            const linkPromise = filesIds.map(id => FilesModel.link(recipeId, id))
            await Promise.all(linkPromise)
            const recipes = await Services.getRecipes(req.session)
            return res.render("admin/recipes/index", {recipes, success: "Receita criada com sucesso."})
        } catch (error) {
            console.error(error)
            let recipe = req.body
            let chefs = await ChefsModel.getAll()
            return res.render("admin/recipes/create", {recipe, chefs, error: "Ocorreu um erro ao criar a receita. Verifique o console e tente novamente."})
        }
    },
    async put(req, res) {
        try {
            const data = req.body
            data.ingredients = data.ingredients.filter(ingredient => ingredient == "" ? false : true)
            data.preparation = data.preparation.filter(step => step == "" ? false : true)
            const {files} = req
            if (files.length > 0) {
                const filesPromise = files.map(file => FilesModel.create(file))
                const filesIds = await Promise.all(filesPromise)
                const linkPromise = filesIds.map(id => FilesModel.link(data.id, id))
                await Promise.all(linkPromise)
            }
            if (data.removed_files) {
                let filesIds = data.removed_files.split(",")
                filesIds.splice(filesIds.length - 1, 1)
                const filesPromise = filesIds.map(id => FilesModel.getOne(id))
                const files = await Promise.all(filesPromise)
                try {
                    files.forEach(file => fs.unlinkSync(file.path))
                } catch (error) {
                    console.error(error)
                }
                const unlinkPromise = filesIds.map(id => FilesModel.unlink(id))
                await Promise.all(unlinkPromise)
                const removePromise = filesIds.map(id => FilesModel.delete(id))
                await Promise.all(removePromise)
            }
            await RecipesModel.update(data)
            let recipe = await Services.getOneRecipe(data.id)
            return res.render("admin/recipes/show", {recipe, success:"Receita editada com sucesso."})
        } catch (error) {
            console.error(error)
            let recipe = await Services.getOneRecipe(req.body.id)
            const chefs = await ChefsModel.getAll()
            return res.render("admin/recipes/edit", {recipe, chefs, error: "Ocorreu um erro ao editar a receita. Verifique o console e tente novamente."})
        }
    },
    async delete(req, res) {
        try {
            const links = await FilesModel.getLinks(req.body.id)
            const filesPromise = links.map(link => FilesModel.getOne(link.file_id))
            const files = await Promise.all(filesPromise)
            try {
                files.forEach(file => fs.unlinkSync(file.path))
            } catch (error) {
                console.error(error)
            }
            const deleteFilesPromise = links.map(link => FilesModel.delete(link.file_id))
            await Promise.all(deleteFilesPromise)
            await RecipesModel.delete(req.body.id)
            const recipes = await Services.getRecipes(req.session)
            return res.render("admin/recipes/index", {recipes, success: "Receita deletada com sucesso."})
        } catch (error) {
            console.error(error)
            let recipe = await Services.getOneRecipe(req.body.id)
            const chefs = await ChefsModel.getAll()
            return res.render("admin/recipes/edit", {recipe, chefs, error: "Ocorreu um erro ao deletar a receita. Verifique o console e tente novamente."})
        }
    }
}