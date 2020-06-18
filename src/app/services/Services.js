const ChefsModel = require("../models/ChefsModel")
const RecipesModel = require("../models/RecipesModel")
const FilesModel = require("../models/FilesModel")

async function formatRecipe(recipe) {
    try {
        const chef = await ChefsModel.getOne(recipe.chef_id)
        const recipeFiles = await FilesModel.getLinks(recipe.id)
        let imagesPromise = recipeFiles.map(recipeFile => FilesModel.getOne(recipeFile.file_id))
        let images = await Promise.all(imagesPromise)
        imagesPromise = images.map(image => formatFile(image))
        images = await Promise.all(imagesPromise)
        const image = images[0]
        recipe = {...recipe, chef, image, images}
        return recipe
    } catch (error) {
        console.error(error)
    }
}

async function formatChef(chef) {
    try {
        let image = await FilesModel.getOne(chef.file_id)
        image = await formatFile(image)
        let recipes = await RecipesModel.getbyChef(chef.id)
        const recipesPromise = recipes.map(recipe => formatRecipe(recipe))
        recipes = await Promise.all(recipesPromise)
        chef = {...chef, recipes, image}
        return chef
    } catch (error) {
        console.error(error)
    }
}

async function formatFile(file) {
    try {
        file.path = file.path.replace("public", "")
        return file
    } catch (error) {
        console.error(error)
    }
}

module.exports = {
    async getAllRecipes() {
        let recipes = await RecipesModel.getAll()
        const recipesPromise = recipes.map(recipe => formatRecipe(recipe))
        recipes = await Promise.all(recipesPromise)
        return recipes
    },
    async getAllChefs() {
        let chefs = await ChefsModel.getAll()
        const chefsPromise = chefs.map(chef => formatChef(chef))
        chefs = await Promise.all(chefsPromise)
        return chefs
    },
    async getOneChef(id) {
        let chef = await ChefsModel.getOne(id)
        if (!chef) return 
        chef = await formatChef(chef)
        return chef
    },
    async getRecipes(session) {
        const {userId, isAdmin} = session
        let recipes = isAdmin ? await RecipesModel.getAll() : await RecipesModel.getByUser(userId)
        const recipesPromise = recipes.map(recipe => formatRecipe(recipe))
        recipes = await Promise.all(recipesPromise)
        return recipes
    },
    async getOneRecipe(id) {
        let recipe = await RecipesModel.getOne(id)
        if (!recipe) return
        recipe = await formatRecipe(recipe)
        return recipe
    },
    formatFile,
    formatRecipe,
    formatChef
}