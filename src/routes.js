const express = require("express")
const routes = express.Router()

const HomeController = require("./app/controllers/HomeController")
const RecipesController = require("./app/controllers/RecipesController")
const ChefsController = require("./app/controllers/ChefsController")
const SessionController = require("./app/controllers/SessionController")
const ProfileController = require("./app/controllers/ProfileController")
const UsersController = require("./app/controllers/UsersController")

const multer = require("./app/middlewares/multer")
const {ifLogged, onlyUsers, onlyAdmins} = require("./app/middlewares/session")

// Páginas da aplicação
routes.get("/", HomeController.index) // Página inicial
routes.get("/about", HomeController.about) // Página sobre
routes.get("/recipes", HomeController.recipes) // Página com todas as receitas
routes.get("/recipes/:id", HomeController.recipe) // Página de detalhe da receita
routes.get("/chefs", HomeController.chefs) // Página de chefs
routes.get("/search", HomeController.search) // Página de busca

// Páginas de login
routes.get("/login", ifLogged, SessionController.index) // Página de Login
// Funções de login
routes.post("/login", SessionController.login) // Fazer login no banco de dados
routes.post("/logout", SessionController.logout) // Fazer logout do banco de dados

// Páginas de recuperação de senha
routes.get("/forgot-password", SessionController.forgotPassword) // Página de pedir nova senha
routes.get("/reset-password", SessionController.resetPassword) // Página de alterar senha
// Funções de recuperação de senha
routes.post("/forgot-password", SessionController.forgot) // Enviar email com link para alterar senha
routes.post("/reset-password", SessionController.reset) // Alterar senha no banco de dados

// Página de usuário logado
routes.get("/admin", (req, res) => res.redirect("/admin/profile")) // Redirecionar para página de usuário logado
routes.get("/admin/profile", onlyUsers, ProfileController.index) // Página de usuário logado
// Função de usuário logado
routes.put("/admin/profile", onlyUsers, ProfileController.put)// Editar o usuário logado

// Páginas de administração de usuários
routes.get("/admin/users", onlyUsers, onlyAdmins, UsersController.index) // Página de listar usuários
routes.get("/admin/users/create", onlyUsers, onlyAdmins, UsersController.create) // Página de criar usuário
routes.get("/admin/users/:id", onlyUsers, onlyAdmins, UsersController.edit) // Página de editar usuário
// Funções de administração de usuários
routes.post("/admin/users", onlyUsers, onlyAdmins, UsersController.post) // Criar usuário no banco de dados
routes.put("/admin/users", onlyUsers, onlyAdmins, UsersController.put) // Editar usuário no banco de dados
routes.delete("/admin/users", onlyUsers, onlyAdmins, UsersController.delete) // Deletar usuário no banco de dados

// Páginas de administração de receitas
routes.get("/admin/recipes", onlyUsers, RecipesController.index) // Página de listar receitas
routes.get("/admin/recipes/create", onlyUsers, RecipesController.create) // Página de criar receita
routes.get("/admin/recipes/:id", onlyUsers, RecipesController.show) // Página de mostrar receita
routes.get("/admin/recipes/:id/edit", onlyUsers, RecipesController.edit) // Página de editar receita
// Funções de administração de receitas
routes.post("/admin/recipes", onlyUsers, multer.array("images", 5), RecipesController.post) // Criar receita no banco de dados
routes.put("/admin/recipes", onlyUsers, multer.array("images", 5), RecipesController.put) // Editar receita no banco de dados
routes.delete("/admin/recipes", onlyUsers, RecipesController.delete) // Deletar receita no banco de dados

// Páginas de administração de chefs
routes.get("/admin/chefs", onlyUsers, ChefsController.index) // Página de listar chefs
routes.get("/admin/chefs/create", onlyUsers, onlyAdmins, ChefsController.create) // Página de criar chef
routes.get("/admin/chefs/:id", onlyUsers, ChefsController.show) // Página de mostrar chef
routes.get("/admin/chefs/:id/edit", onlyUsers, onlyAdmins, ChefsController.edit) // Página de editar chef
// Funções de administração de chefs
routes.post("/admin/chefs", onlyUsers, onlyAdmins, multer.single("image"), ChefsController.post) // Criar chef no banco de dados
routes.put("/admin/chefs", onlyUsers, onlyAdmins, multer.single("image"), ChefsController.put) // Editar chef no banco de dados
routes.delete("/admin/chefs", onlyUsers, onlyAdmins, ChefsController.delete) // Deletar chef no banco de dados

module.exports = routes