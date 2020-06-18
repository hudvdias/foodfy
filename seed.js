const faker = require("faker")
const {hash} = require("bcryptjs")

const UsersModel = require("./src/app/models/UsersModel")
const RecipesModel = require("./src/app/models/RecipesModel")
const ChefsModel = require("./src/app/models/ChefsModel")
const FilesModel = require("./src/app/models/FilesModel")

async function createUsers() {
    let users = []
    const admin = {
        name: "Administrador",
        email: "admin@foodfy.com",
        password: await hash("admin", 4),
        is_admin: true
    }
    users.push(admin)
    while (users.length < 10) {
        const user = {
            name: faker.name.firstName(),
            email: faker.internet.email(),
            password: await hash("senha", 4),
            is_admin: false
        }
        users.push(user)
    }
    const usersPromise = users.map(user => UsersModel.create(user))
    await Promise.all(usersPromise)
}

async function createChefs() {
    let chefs = []
    while (chefs.length < 10) {
        const fileInfo = faker.image.avatar()
            const file = {
                filename: fileInfo,
                path: fileInfo
            }
        const file_id = await FilesModel.create(file)
        const chef = {
            name: `${faker.name.firstName()} ${faker.name.lastName()}`,
            file_id: file_id,
        }
        await ChefsModel.create(chef)
        chefs.push(chef)
    }
}

async function createRecipes() {
    let recipes = []
    while (recipes.length < 50) {
        const recipe = {
            user_id: faker.random.number(9) + 1,
            chef_id: faker.random.number(9) + 1,
            title: faker.random.words(2),
            ingredients: [],
            preparation: [],
            information: faker.lorem.paragraph(Math.ceil(Math.random() * 5))
        }
        while (recipe.ingredients.length < Math.ceil(Math.random() * 8)) {
            const ingredient = `${faker.random.number(9) + 1} ${faker.lorem.sentence(3)}`
            recipe.ingredients.push(ingredient)
        }
        while (recipe.preparation.length < Math.ceil(Math.random() * 8)) {
            const step = faker.lorem.sentence(5)
            recipe.preparation.push(step)
        }
        const recipeId = await RecipesModel.create(recipe)
        let files = []
        while (files.length < Math.ceil(Math.random() * 5)) {
            const fileInfo = faker.image.food()
            const file = {
                filename: fileInfo,
                path: fileInfo
            }
            files.push(file)
        }
        const filesPromise = files.map(file => FilesModel.create(file))
        const filesIds = await Promise.all(filesPromise)
        const linkPromise = filesIds.map(id => FilesModel.link(recipeId, id))
        await Promise.all(linkPromise)
        recipes.push(recipe)
    }
}

async function init() {
    await createUsers()
    await createChefs()
    await createRecipes()
}

init()