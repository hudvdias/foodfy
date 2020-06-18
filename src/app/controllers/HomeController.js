const RecipesModel = require("../models/RecipesModel")
const ChefsModel = require("../models/ChefsModel")
const Services = require("../services/Services")

module.exports = {
    async index(req, res) {
        try {
            let recipes = await Services.getAllRecipes()
            recipes = recipes.filter((recipe, index) => index > 5 ? false : true)
            return res.render("index", {recipes})
        } catch (error) {
            console.error(error)
            return res.send("Ocorreu um erro ao carregar a página. Verifique o console e tente novamente.")
        }
    },
    about(req, res) {
        try {
            return res.render("about")
        } catch (error) {
            console.error(error)
            return res.send("Ocorreu um erro ao carregar a página. Verifique o console e tente novamente.")
        }
    },
    async recipes(req, res) {
        try {
            let recipes = await Services.getAllRecipes()
            return res.render("recipes", {recipes})
        } catch (error) {
            console.error(error)
            return res.send("Ocorreu um erro ao carregar a página. Verifique o console e tente novamente.")
        }
    },
    async recipe(req, res) {
        try {
            let recipe = await Services.getOneRecipe(req.params.id)
            if (!recipe) {
                let recipes = await Services.getAllRecipes()
                return res.render("recipes", {recipes, error:"Receita não encontrada."})
            }
            return res.render("recipe", {recipe})
        } catch (error) {
            console.error(error)
            let recipes = await Services.getAllRecipes()
            return res.render("recipes", {recipes, error:"Ocorreu um erro ao carregar a página da receita. Verifique o console e tente novamente."})
        }
    },
    async chefs(req, res) {
        try {
            let chefs = await Services.getAllChefs()
            return res.render("chefs", {chefs})
        } catch (error) {
            console.error(error)
            return res.send("Ocorreu um erro ao carregar a página. Verifique o console e tente novamente.")
        }
    },
    async search(req, res) {
        try {
            let {search} = req.query
            if (search == "") {
                search = "Todas as Receitas"
                let recipes = await Services.getAllRecipes()
                return res.render("search", {search, recipes})
            }
            let recipes = await RecipesModel.getbyName(search)
            const recipesPromise = recipes.map(recipe => Services.formatRecipe(recipe))
            recipes = await Promise.all(recipesPromise)
            return res.render("search", {search, recipes})
        } catch (error) {
            console.error(error)
            return res.send("Ocorreu um erro ao carregar a página. Verifique o console e tente novamente.")
        }
    }
}